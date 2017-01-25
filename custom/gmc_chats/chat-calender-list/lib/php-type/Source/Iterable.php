<?php

namespace Type;

abstract class Iterable extends Type {
    
    /**
     * @return integer
     */
	public function length(){
		return $this->count();
	}
	
	/**
	 * @param  function($value, $key, $this)
	 * @return \Type\Iterable
	 */
	public function each($fn){
		foreach ($this as $key => $value)
			$fn($value, $key, $this);
		
		return $this;
	}
	
	/**
	 * @param  function($value, $key, $this)
	 * @return \Type\Iterable
	 */
	public function map($fn){
		$results = array();
		
		foreach ($this as $key => $value)
			$results[$key] = $fn($value, $key, $this);
		
		return static::from($results);
	}
	
	/**
	 * @param  function($results, $value, $key, $this)
	 * @return \Type\Iterable
	 */
	public function map2($fn){
	    $results =  static::from( array() ) ;
	
	    foreach ($this as $key => $value)
	        $fn($results, $value, $key, $this);
	
	    return $results ;
	}
	
	/**
	 * @param  function($value, $key, $this)
	 * @param $preserveKeys
	 * @return \Type\Iterable
	 */
	public function filter($fn, $preserveKeys = false){
		$results = array();
		
		foreach ($this as $key => $value)
			if ($fn($value, $key, $this))
				$preserveKeys ? $results[$key] = $value : $results[] = $value;
		
		return static::from($results);
	}
	
	/**
	 * @param  function($value, $key, $this)
	 * @return bool
	 */
	public function every($fn){
		foreach($this as $key => $value)
			if (!$fn($value, $key, $this)) return false;
		
		return true;
	}
	
	/**
	 * @param  function($value, $key, $this)
	 * @return bool
	 */
	public function some($fn){
		foreach($this as $key => $value)
			if ($fn($value, $key, $this)) return true;

		return false;
	}
	
}