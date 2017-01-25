<?php

namespace Type;

class Array2 extends ArrayObject {
	
	public function __construct(){
		parent::__construct(func_get_args());
	}
	
	/**
	 * @return \Type\Array2
	 */
	public static function from($data = null){
		$array = new Array2;
		return $array->setData($data);
	}
	

	/**
	 * @return string
	 */
	protected static function getClassName(){
		return __CLASS__;
	}
	
}