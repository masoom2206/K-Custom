<?php
	require __DIR__ . '/../../lib/classes/App.php' ;
	require __DIR__ . '/../../library/lessc.inc.php' ;
	header('Content-Type: text/css');

	$cache_file	= __DIR__ . '/../min/tmp/html5player' . App::deploy_version() . '.css' ;
	$less_file	= 'html5player2.less' ;

	$is_cached	= @file_exists($cache_file) ;

	if( !$is_cached ) {
		if( App::is_testing() ){
			if( @filemtime($cache_file) < @filemtime($less_file)){
				$is_cached	= false ;
			}
		}
	}

	if( $is_cached ) {
		App::sendfile($cache_file, __FILE__, __LINE__, true );
		exit;
	}
   
	$less = new lessc ;
	$less_data  = file_get_contents( $less_file ) ;
	$css_data	= $less->compile($less_data) ;
	file_put_contents($cache_file, $css_data ) ;
	echo $css_data ;
	exit;
    