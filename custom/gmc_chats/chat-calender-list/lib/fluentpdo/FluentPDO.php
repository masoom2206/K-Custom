<?php
/** 
 * FluentPDO is simple and smart SQL query builder for PDO
 * 
 * With FluentPDO you can build simple and difficult queries quickly
 * and effectively. Killer feature of FluentPDO is "Smart join builder"
 * which is able generate joins automatically. FluentPDO is a perfect choice
 * for small projects. If you are not "in-doctrine-ated" ;-) you can use
 * FluentPDO also for large projects as a base of your models or repositories.
 * 
 * For more information @see readme.md
 * 
 * @link http://github.com/lichtner/fluentpdo
 * @author Marek Lichtner, marek@licht.sk
 * @copyright 2012 Marek Lichtner
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU General Public License, version 2 (one or other)
 */
class FluentPDO {
	
	private $pdo, $structure;
	
	/** @var boolean|callback */
	public $debug;
	
	function __construct(PDO $pdo, FluentStructure $structure = null) {
		$this->pdo = $pdo;
		if (!$structure) {
			$structure = new FluentStructure;
		}
		$this->structure = $structure;
	}
	
	
	public function create_db($tab_name, array $fields ) {
		$_fields	= array() ;
		foreach($fields as $name => $property ) {
			if( 'id' == $property ) {
				$_fields[$name]	= $name . ' INTEGER PRIMARY KEY AUTOINCREMENT' ;
			} else {
				$_fields[$name]	= $name . ' ' . $property ;
			}
		}
		$sql	= 'CREATE TABLE IF NOT EXISTS ' . $tab_name  . ' ( ' . join(",\n", $_fields) . ' ) ;' ;
		echo $sql ;
		$sth    = $this->pdo->prepare( $sql ) ;
		$sth->execute();
	}
	
	public function use_db($db_name) {
	    $sth    = $this->pdo->prepare('USE ' . $db_name );
	    $sth->execute();
	}
	
	/**
	 * 
	 * @param string $tab
	 * @param array $values
	 * @return integer
	 */
	public function insert($tab, array $values , $strip_keys = array() ) {
	    $sql    = 'INSERT INTO ' . $tab . ' (' . join(', ', array_keys($values)) . ') VALUES (' ;
	    $_values    = array() ;
	    foreach($values as $key => $_val ) {
	        if( in_array($key, $strip_keys) ) {
	            $_values[]    = $_val ;
	        } else {
	            $_values[]    = '\''. str_replace('\'', '\'\'', $_val) . '\'' ;
	        }
	    }
	    $sql    .= join(',', $_values ) . ')' ;
	    $sth = $this->pdo->query($sql) ;
	    return $this->pdo->lastInsertId();
	}
	
	/**
	 *
	 * @param string $tab
	 * @param array $values
	 * @param string $where
	 * @return integer
	 */
	public function update($tab, array $values , $where , array $strip_keys = array() ) {
	    $sql    = 'UPDATE ' . $tab . ' SET '  ;
	    $_values    = array() ;
	    foreach($values as $_key    => $_val ) {
	        if( in_array($_key, $strip_keys) ) {
	            $_values[]    =  '`' . str_replace('\'', '\'\'', $_key) . '`=' . $_val ;
	        } else {
	            $_values[]    =  '`' . str_replace('\'', '\'\'', $_key) . '`=\''. str_replace('\'', '\'\'', $_val) . '\'' ;
	        }
	    }
	    $sql    .= join(', ', $_values ) . ' WHERE ' . $where  ;
	    $sth = $this->pdo->query($sql) ;
	    return $sth->rowCount() ;
	}
	
	public function select_one($tab, $where, $select = '*',  $order = '' ) {
	    $sql    = 'SELECT ' . $select . ' FROM ' . $tab . ' WHERE ' ;
	    if( is_string($where) ) {
	        $sql    .= $where ;
	    } else if( is_array($where) ) {
	        $_where = array() ;
	        foreach($where as $_key => $_val ) {
	            $_where[]    = $_key  . '=\'' . str_replace('\'', '\'\'', $_val) . '\'' ;
	        }
	        
	        $sql    .= join(' AND ', $_where ) ;
	    }
	    $sql .= $order ;
	    $sth = $this->pdo->query($sql) ;
	    foreach ($sth as $row) {
	        return $row ;
	    }
	    return null ;
	}

	/** Create SELECT query from $table
	 * @param string $table  db table name
	 * @param integer $id  return one row by primary key
	 * @return FluentQuery
	 */
    public function from($table, $id = null) {
		$query = new FluentQuery($this, $table);
		if ($id) {
			$primary = $this->structure->getPrimaryKey($table);
			$query = $query->where("$table.$primary = ?", $id);
		}
		return $query;
	}
	
	/**
	 * @return PDO
	 */
	public function getPdo() {
		return $this->pdo;
	}

	/**
	 * @return FluentStructure
	 */
	public function getStructure() {
		return $this->structure;
	}
}

class FluentStructure {
	private $primaryKey, $foreignKey;
	
	function __construct($primaryKey = 'id', $foreignKey = '%s_id') {
		$this->primaryKey = $primaryKey;
		$this->foreignKey = $foreignKey;
	}
	
	public function getPrimaryKey($table) {
		return sprintf($this->primaryKey, $table);
	}

	public function getForeignKey($table) {
		return sprintf($this->foreignKey, $table);
	}
}

/** 
 * SQL Fluent query builder
 * 
 * @method FluentQuery  select(string $column) add one or more columns in SELECT to query
 * @method FluentQuery  leftJoin(string $statement) add LEFT JOIN to query 
 *						($statement can be 'table' name only or 'table:' means back reference)
 * @method FluentQuery  innerJoin(string $statement) add INNER JOIN to query 
 *						($statement can be 'table' name only or 'table:' means back reference)
 * @method FluentQuery  groupBy(string $column) add GROUP BY to query
 * @method FluentQuery  having(string $column) add HAVING query
 * @method FluentQuery  orderBy(string $column) add ORDER BY to query
 * @method FluentQuery  limit(int $limit) add LIMIT to query
 * @method FluentQuery  offset(int $offset) add OFFSET to query
 */
class FluentQuery implements IteratorAggregate {
	
	/** @var FluentPDO */
	private $fpdo;
	private $clauses = array(), $statements = array(), $parameters = array();
	private $joins = array();
	/** @var PDOStatement */		
	private $result;

	/** @var float */
	private $time;

	function __construct(FluentPDO $fpdo, $from) {
		$this->fpdo = $fpdo;
		$this->createSelectClauses();
		$this->statements['FROM'] = $from;
		$this->statements['SELECT'][] = "$from.*";
	}
	
	function getPDO() {
		return $this->fpdo->getPdo();
	}

	private function createSelectClauses() {
		$this->clauses = array(
			'SELECT' => ', ',
			'FROM' => null,
			'JOIN' => ' ',
			'WHERE' => ' AND ',
			'GROUP BY' => ',',
			'HAVING' => ' AND ',
			'ORDER BY' => ', ',
			'LIMIT' => null,
			'OFFSET' => null,
		);
		$this->initClauses();
	}
	
	private function initClauses() {
		foreach ($this->clauses as $clause => $value) {
			if ($value) {
				$this->statements[$clause] = array();
				$this->parameters[$clause] = array();
			} else {
				$this->statements[$clause] = null;
				$this->parameters[$clause] = null;
			}
		}
	}
	
	/** Add SQL clause with parameters
	 * @param type $clause
	 * @param type $parameters  first is $statement followed by $parameters
	 * @return FluentQuery
	 */
	function __call($clause, $parameters = array()) {
		$clause = FluentUtils::toUpperWords($clause);
		if ($clause == 'GROUP') $clause = 'GROUP BY';
		if ($clause == 'ORDER') $clause = 'ORDER BY';
		$statement = array_shift($parameters);
		if (strpos($clause, 'JOIN')) {
			return $this->addJoinStatements($clause, $statement, $parameters);
		}
		return $this->addStatement($clause, $statement, $parameters);
	}
	
	/** add statement for all kind of clauses
	 * @return FluentQuery 
	 */
	private function addStatement($clause, $statement, $parameters = array()) {
		if ($statement === null) {
			return $this->resetClause($clause);
		}
		# $statement !== null 
		if ($this->clauses[$clause]) {
			$this->statements[$clause][] = $statement;
			$this->parameters[$clause] = array_merge($this->parameters[$clause], $parameters);
		} else {
			$this->statements[$clause] = $statement;
			$this->parameters[$clause] = $parameters;
		}
		return $this;
	}
	
	/** Remove all prev defined statements 
	 * @return FluentQuery 
	 */
	private function resetClause($clause) {
		$this->statements[$clause] = null;
		if ($this->clauses[$clause]) {
			$this->statements[$clause] = array();
		}
		return $this;
	}
	
	/** Statement can contain more tables (e.g. "table1.table2:table3:")
	 * @return FluentQuery 
	 */
	private function addJoinStatements($clause, $statement, $parameters = array()) {
		if ($statement === null) {
			$this->joins = array();
			return $this->resetClause('JOIN');
		}
		
		# match "tables AS alias"
		preg_match('~([a-z_][a-z0-9_\.:]*)(\s+AS)?(\s+([a-z_][a-z0-9_]*))?~i', $statement, $matches);
		$joinAlias = '';
		if ($matches) {
			$joinTable = $matches[1];
			if (isset($matches[4]) && strtoupper($matches[4]) != 'ON') {
				$joinAlias = $matches[4];
			}
		}
		
		if (strpos(strtoupper($statement), ' ON ') || strpos(strtoupper($statement), ' USING')) {
			if (!$joinAlias) $joinAlias = $joinTable;
			if (in_array($joinAlias, $this->joins)) {
				return $this;
			} else {
				$this->joins[] = $joinAlias;
				$statement = " $clause $statement";
				return $this->addStatement('JOIN', $statement, $parameters);
			}
		} 
		
		# $joinTable is list of tables for join e.g.: table1.table2:table3....
		if (!in_array(substr($joinTable, -1), array('.', ':'))) {
			$joinTable .= '.';
		}
		
		preg_match_all('~([a-z_][a-z0-9_]*[\.:]?)~i', $joinTable, $matches);
		$mainTable = $this->statements['FROM'];
		$lastItem = array_pop($matches[1]);
		array_push($matches[1], $lastItem);
		foreach ($matches[1] as $joinItem) {
			if ($mainTable == substr($joinItem, 0, -1)) continue;
			
			# use $joinAlias only for $lastItem
			$alias = '';
			if ($joinItem == $lastItem) $alias = $joinAlias;
			
			$newJoin = $this->createJoinStatement($clause, $mainTable, $joinItem, $alias);
			if ($newJoin) $this->addStatement('JOIN', $newJoin, $parameters);
			$mainTable = $joinItem;
		}
		return $this;
	}

	/** Create join string
	 * @return string 
	 */
	private function createJoinStatement($clause, $mainTable, $joinTable, $joinAlias = '') {
		if (in_array(substr($mainTable, -1), array(':', '.'))) {
			$mainTable = substr($mainTable, 0, -1);
		}
		$referenceDirection = substr($joinTable, -1);
		$joinTable = substr($joinTable, 0, -1);
		$asJoinAlias = '';
		if ($joinAlias) {
			$asJoinAlias = " AS $joinAlias";
		} else {
			$joinAlias = $joinTable;
		}
		if (in_array($joinAlias, $this->joins)) {
			# if join exists don't create same again
			return '';
		} else {
			$this->joins[] = $joinAlias;
		}
		if ($referenceDirection == ':') {
			# back reference
			$primaryKey = $this->fpdo->getStructure()->getPrimaryKey($mainTable);
			$foreignKey = $this->fpdo->getStructure()->getForeignKey($mainTable);
			return " $clause $joinTable$asJoinAlias ON $joinAlias.$foreignKey = $mainTable.$primaryKey";
		} else {
			$primaryKey = $this->fpdo->getStructure()->getPrimaryKey($joinTable);
			$foreignKey = $this->fpdo->getStructure()->getForeignKey($joinTable);
			return " $clause $joinTable$asJoinAlias ON $joinAlias.$primaryKey = $mainTable.$foreignKey";
		}
	}
	
	/** Add where condition, more calls appends with AND
	* @param string $condition  possibly containing ? or :name (PDO syntax)
	* @param mixed $parameters  array or a scalar value
	* @return FluentQuery 
	*/
	function where($condition, $parameters = array()) {
		if (is_array($condition)) { // where(array("column1" => 1, "column2 > ?" => 2))
			foreach ($condition as $key => $val) {
				$this->where($key, $val);
			}
			return $this;
		}
		if ($condition === null) {
			return $this->resetClause('WHERE');
		}
		$args = func_get_args();
		if (count($args) == 1) {
			return $this->addStatement('WHERE', $condition);
		}
		if (count($args) == 2 && preg_match('~^[a-z_:][a-z0-9_.:]*$~i', $condition)) {
			# condition is column only 
			if (is_null($parameters)) {
				return $this->addStatement('WHERE', "$condition is NULL");
			} elseif (is_array($args[1])) {
				$in = $this->quote($args[1]);
				return $this->addStatement('WHERE', "$condition IN $in");
			}
			$condition = "$condition = ?";
		}
		array_shift($args); 
		return $this->addStatement('WHERE', $condition, $args);
	}

	/** Implements method from IteratorAggregate
	 * @return PDOStatement
	 */
	public function getIterator() {
		return $this->execute();
	}
	
	/** Execute query with earlier added parameters
	 * @return PDOStatement
	 */
	function execute() {
		$query = $this->buildQuery();
		$parameters = $this->buildParameters();
		
		$result = $this->fpdo->getPdo()->prepare($query);
		$result->setFetchMode(PDO::FETCH_ASSOC);
		
		$time = microtime(true);
		if ($result && $result->execute($parameters)) {
			$this->time = microtime(true) - $time;
		} else {
			$result = false;
		}
		
		$this->result = $result;
		$this->debugger();
		
		return $result;
	}
	
	private function debugger() {
		if ($this->fpdo->debug) {
			if (!is_callable($this->fpdo->debug)) {
				$query = $this->getQuery();
				$parameters = $this->getParameters();
				$debug = '';
				if ($parameters) {
					$debug = "# parameters: " . implode(", ", array_map(array($this, 'quote'), $parameters));
				}
				$debug .= "\n$query";
				$pattern = '(^' . preg_quote(dirname(__FILE__)) . '(\\.php$|[/\\\\]))'; // can be static
				foreach (debug_backtrace() as $backtrace) {
					if (isset($backtrace["file"]) && !preg_match($pattern, $backtrace["file"])) { 
						// stop on first file outside FluentPDO source codes
						break;
					}
				}
				$time = sprintf('%0.3f', $this->time * 1000).' ms';
				$rows = $this->result->rowCount();
				fwrite(STDERR, "# $backtrace[file]:$backtrace[line] ($time; rows = $rows)\n$debug\n");
			} else {
				call_user_func($this->fpdo->debug, $this);
			}
		}
	}
	
	/**
	 * @return PDOStatement
	 */
	public function getResult() {
		return $this->result;
	}
	
	/**
	 * @return float
	 */
	public function getTime() {
		return $this->time;
	}
	
	/** Fetch first row or column
	 * @param string column name or empty string for the whole row
	 * @return mixed string, array or false if there is no row
	 */
	function fetch($column = '') {
		$return = $this->execute()->fetch();
		if ($return && $column != '') {
			return $return[$column];
		}
		return $return;
	}
	
	/** Fetch pairs
	 * @return array of fetched rows as pairs
	 */
	function fetchPairs($key, $value) {
		return $this->select(null)->select("$key, $value")->execute()->fetchAll(PDO::FETCH_KEY_PAIR);
	}
	
	/** Fetch all row
	 * @param string $index  specify index column
	 * @param string $selectOnly  select columns which could be fetched
	 * @return array of fetched rows
	 */
	function fetchAll($index = '', $selectOnly = '') {
		if ($selectOnly) {
			$this->select(null)->select($index . ', ' . $selectOnly);
		}
		if ($index) {
			$data = array();
			foreach ($this as $row) {
				$data[$row[$index]] = $row;
			}
			return $data;
		} else {
			return $this->execute()->fetchAll();
		}
	}
	
	/** Get added parameters
	 * @return array
	 */
	function getParameters() {
		return $this->buildParameters();
	}
	
	/** Get built query
	 * @param boolean $formated  return formated query
	 * @return string
	 */
	function getQuery($formated = true) {
		$query = $this->buildQuery();
		if ($formated) $query = FluentUtils::formatQuery($query);
		return $query;
	}
	
	/**
	 * @return string
	 */
	private function buildQuery() {
		# first create extra join from statements with columns with referenced tables 
		$statementsWithReferences = array('WHERE', 'SELECT', 'GROUP BY', 'ORDER BY');
	 
		foreach ($statementsWithReferences as $clause) {
			$this->statements[$clause] = array_map(array($this, 'createUndefinedJoins'), $this->statements[$clause]);
		}
		$query = '';
		foreach ($this->clauses as $clause => $separator) {
			if ($this->clauseNotEmpty($clause)) {
				if ($clause !== 'JOIN') $query .= " $clause ";
				if (is_array($this->statements[$clause])) {
					$query .= implode($separator, $this->statements[$clause]);
				} else {
					$query .= $this->statements[$clause];
				}
			}
		}
		return trim($query);
	}
	
	/** Create undefined joins from statement with column with referenced tables
	 * @param string $statement
	 * @return string  rewrited $statement (e.g. tab1.tab2:col => tab2.col)
	 */
	private function createUndefinedJoins($statement) {
		preg_match_all('~\\b([a-z_][a-z0-9_.:]*[.:])[a-z_]*~i', $statement, $matches);
		foreach ($matches[1] as $join) {
		    if( false === strpos(':', $join) || false === strpos('.', $join)  ) {
		        continue ;
		    }
			if (!in_array(substr($join, 0, -1), $this->joins)) {
				$this->addJoinStatements('LEFT JOIN', $join);
			}
		}
		# remove extra referenced tables (rewrite tab1.tab2:col => tab2.col)
		if( false !== strpos(':', $statement) && false !== strpos('.', $statement)  ) {
		    $statement = preg_replace('~(?:\\b[a-z_][a-z0-9_.:]*[.:])?([a-z_][a-z0-9_]*)[.:]([a-z_*])~i', '\\1.\\2', $statement);
		}
		return $statement;
	}

	private function clauseNotEmpty($clause) {
		if ($this->clauses[$clause]) {
			return (boolean) count($this->statements[$clause]);
		} else {
			return (boolean) $this->statements[$clause];
		}
	}
	
	private function buildParameters() {
		$parameters = array();
		foreach ($this->parameters as $clauses) {
			if (is_array($clauses)) {
				foreach ($clauses as $value) {
					if (is_array($value) && is_string(key($value)) && substr(key($value),0,1) == ':') {
						// this is named params e.g. (':name' => 'Mark')
						$parameters = array_merge($parameters, $value);
					} else {
						$parameters[] = $value;
					}
				}
			} else {
				if ($clauses) $parameters[] = $clauses;
			}
		}
		return $parameters;
	}
	
	private function quote($value) {
		if (!isset($value)) {
			return "NULL";
		}
		if (is_array($value)) { // (a, b) IN ((1, 2), (3, 4))
			return "(" . implode(", ", array_map(array($this, 'quote'), $value)) . ")";
		}
		$value = $this->formatValue($value);
		if (is_float($value)) {
			return sprintf("%F", $value); // otherwise depends on setlocale()
		}
		if ($value === false) {
			return "0";
		}
		if (is_int($value)) { # @todo maybe add FluentLiteral
			return (string) $value;
		}
		return $this->fpdo->getPdo()->quote($value);
	}
	
	private function formatValue($val) {
		if ($val instanceof DateTime) {
			return $val->format("Y-m-d H:i:s"); //! may be driver specific
		}
		return $val;
	}
	
}

class FluentUtils {
	
	/** Convert "camelCaseWord" to "CAMEL CASE WORD"
	 * @param string $string
	 * @return string 
	 */
	public static function toUpperWords($string) {
		return trim(strtoupper(preg_replace('#(.)([A-Z]+)#', '$1 $2', $string)));
	}

	public static function formatQuery($query) {
		$query = preg_replace(
			'/WHERE|FROM|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|UNION|DUPLICATE KEY/',
			"\n$0", $query
		);
		$query = preg_replace(
			'/INNER|LEFT|RIGHT|CASE|WHEN|END|ELSE|AND/',
			"\n    $0", $query
		);
		return $query;
	}
}