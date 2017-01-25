<?php

require_once __DIR__ . '/../php-cache/Source/Cache.php' ;
require_once __DIR__ . '/../php-cache/Source/Backend/Memcache.php' ;
require_once __DIR__ . '/../php-loader/Source/Loader.php' ;
require_once __DIR__ . '/../fluentpdo/FluentPDO.php' ;

use Cache\Cache ;

final class App {
//class App {

    static private $_use_xhprof ;
    static private $_xhprof_page ;
    static private $_xhprof_start_time ;
    static private $_use_bootstrap = false ;
    const cache_timeout    = 3600 ;
    const app_use_https    = true ;
    const product_domain		= 'www.guitarmasterclass.net' ;
    
    static private $config  = null ;
    static private $_is_console  = false ;

    /*static public function onLoad(){
        static $loader    = null ;
        if( null == $loader ) {
        	//self::$config	= require __DIR__ . '/../../internals/deploy_config.php' ;
        	if( defined('STDIN') ) {
        		$_SERVER['SERVER_NAME']	= self::$config['domain'] ;
        		$_SERVER["REMOTE_ADDR"] = '127.0.0.1' ;
        		$_SERVER["REQUEST_URI"] = '/' ;
        		self::$_is_console	= true ;
        	}
        	
        	$loader_debug	= self::is_debug() || self::is_testing() ;
        	$load_cache_key	= 'loader_' . self::deploy_version() ;
            $cache    	= App::cache( $load_cache_key ) ;
            $loader    	= \Loader\Loader::create('MainLoader', $cache, array(
            			'debug'	=> $loader_debug ,
            			'cache_options'	=> array(
            						'ttl'	=> App::cache_timeout * 10 ,
            					) ,
            		) ) ;
            $loader->add( __DIR__ . '/../php-type/Source', 'Type', $loader_debug) ;
            $loader->add( __DIR__ . '/../../library/Monolog', 'Monolog', $loader_debug) ;
            $loader->add( __DIR__ . '/../../library/Process', 'Symfony\Component\Process', $loader_debug) ;
            $loader->add( __DIR__ . '/../../library/FFMpeg', 'FFMpeg', $loader_debug) ;
            $loader->add( __DIR__ . '/../../library/Imagine', 'Imagine', $loader_debug) ;
            $loader->add( __DIR__ . '/../../library/Gmc', 'Gmc', $loader_debug) ; 
            
            $loader->register();
            
            if( $_SERVER["REMOTE_ADDR"] == '127.0.0.1' ) {
                if( isset($_SERVER["HTTP_X_REAL_IP"]) ) {
                    $_SERVER["REMOTE_ADDR"] = $_SERVER["HTTP_X_REAL_IP"] ;
                } else if( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ){
                    $_SERVER["REMOTE_ADDR"] = $_SERVER["HTTP_X_FORWARDED_FOR"] ;
                }
            }
        } else {
        	throw new Exception( __CLASS__ . ':' . __FUNCTION__ . ' only can call once!');
        }
    }*/

    static public function useBootstrap( $use = null ) {
        if( null !== $use ){
            self::$_use_bootstrap    = $use ;
        }
        return self::$_use_bootstrap ;
    }

    static public function onInit(){
        self::check_https() ;
        /**
         * xhprof for performance analysis
         */
        if( self::is_debug_profile() && function_exists('xhprof_enable') ) {
            if( 
            	!(
                    '/actions/update-chat-status/' == $_SERVER['REQUEST_URI']
                    ||
                    preg_match('/\.(jpg|gif|png|mp3|mp4|js|css)\/?$/',  $_SERVER['REQUEST_URI'] )
           		 )
            ) {
                self::$_use_xhprof	= true ;
                self::$_xhprof_page = $_SERVER['REQUEST_URI'] ;
                self::$_xhprof_start_time    = microtime(true) ;
                // file_put_contents('/tmp/xhprof_page.php', $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);
                xhprof_enable(); //  XHPROF_FLAGS_CPU + XHPROF_FLAGS_MEMORY
                register_shutdown_function( array( __CLASS__, 'onExit') );
            }
        }
    }

    static public function is_https() {
        static $is_https	= null ;
        if( null === $is_https ) {
            $is_https	= isset($_SERVER["HTTPS"]) || isset($_SERVER['HTTP_X_PROXY_HTTPS']) ;
        }
        return $is_https ;
    }


    static public function https_scheme() {
        static $scheme	= null ;
        if( null === $scheme ) {
            if( self::app_use_https ) {
                $scheme    = 'https' ;
            } else {
                $scheme	= self::is_https() ? 'https' : 'http' ;
            }
        }
        return $scheme ;
    }

    static public function request_scheme() {
        static $scheme	= null ;
        if( null === $scheme ) {
            $scheme	= self::is_https() ? 'https' : 'http' ;
        }
        return $scheme ;
    }
    
    static function request_browser( $referer_debug = false ) {
        static $browser	= null ;
        if( null === $browser ) {
                $is_testing     =  App::is_testing() ;
    		$is_debug	=  App::is_debug() || $is_testing || App::is_deveploer() ;
    		$deploy_version	= App::deploy_version() ;
    		$session_cache_key	= 'app_client_browser_cache_' . $deploy_version ;
	
        	if(  !$is_debug ) {
	             if( isset($_SESSION) &&  isset($_SESSION[ $session_cache_key ]) ) {
	                 $browser    = $_SESSION[ $session_cache_key ] ;
	                 return $browser ;
                    }
        	}
            
            $browser	= array(
                         'name'    => false ,
                         'version'    => false ,
                         'engine'    => false ,
                         'os'    => false ,
                         'os_version'    => false ,
                         'mobile'    => false ,
                     ) ;
            if( isset($_SERVER['HTTP_USER_AGENT']) ) {
                
                if( preg_match('/\WAppleWebKit\W/', $_SERVER['HTTP_USER_AGENT']) ){
                    $browser['engine']    = 'webkit' ;
                    if(  preg_match('/\WChrome\/(\d+)\.([\.\d]+)\W/', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name']    = 'chrome' ;
                        $browser['version']    = $ls[1] ;
                    } else if( preg_match('/\W\sVersion\/(\d+)\.([\.\d]+)\s+Safari\//', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name']    = 'safari' ;
                        $browser['version']    = $ls[1] ;
                    } else if( preg_match('/\W\sVersion\/(\d+)\.([\.\d]+)\s+Mobile\/(\w+)\s+Safari\//', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name']    = 'safari' ;
                        $browser['version']    = $ls[1] ;
                        $browser['mobile']    = true ;
                    }
                } else if( preg_match('/\sMSIE\s+(\d+)\.([\.\d+]);\W/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['engine']    = 'trident' ;
                    $browser['name']    = 'ie' ;
                    $browser['version']    = $ls[1] ; 
                } else if( preg_match('/\sGecko\/(\d+)\s/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['engine']    = 'gecko' ;
                    if(  preg_match('/\WFirefox\/(\d+)\.([\.\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name']    = 'firefox' ;
                        $browser['version']    = $ls[1] ;
                    }else {
                        
                    }
                } else if( preg_match('/Opera\/(\d+)\.([\.\d]+)\W/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['engine']    = 'presto' ;
                    $browser['name']    = 'opera' ;
                    $browser['version']    = $ls[1] ;
                } 
                
                if( preg_match('/Mac OS X ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os']    = 'osx' ;
                    $browser['os_version']    = $ls[1] ; 
                } else if(preg_match('/Windows NT (\d+)\.([\.\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os']    = 'win' ;
                    $browser['os_version']    = $ls[1] ;
                } else if(preg_match('/\siPhone OS ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os']    = 'iphone' ;
                    $browser['os_version']    = $ls[1] ;
                    $browser['mobile']    = true ;
                } else if(preg_match('/\WiPad\W.+? OS ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os']    = 'ipad' ;
                    $browser['os_version']    = $ls[1] ;
                    $browser['mobile']    = true ;
                } else if(preg_match('/\siPod OS ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os']    = 'ipod' ;
                    $browser['os_version']    = $ls[1] ;
                    $browser['mobile']    = true ;
                } else if(preg_match('/\sAndroid ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os']    = 'android' ;
                    $browser['os_version']    = $ls[1] ;
                    $browser['mobile']    = true ;
                } 
                
                if( $browser['version'] ) {
                    $browser['version'] = (int) $browser['version'] ;
                }
                
                if( $browser['os_version'] ) {
                    $browser['os_version'] = (int) $browser['os_version'] ;
                }
                
                $browser['app_version'] = self::deploy_version() ;
                
                if( $is_debug ) {
                    $browser['agent'] =   $_SERVER['HTTP_USER_AGENT'] ;
                    $_q	= self::orig_request() ;
                    $_rq	= self::orig_referer();
                    if( $referer_debug || isset($_rq['query']['referer_debug']) ) {
	                    foreach($_rq['query'] as $key => $val ) {
	                    	if( !isset($_q['query'][$key]) ) {
	                    		$_q['query'][$key]	= $val ;
	                    	}
	                    }
                    }
                    
                    if( isset($_q['query']['ipad_debug']) ){
                    	$browser['mobile']    = true ;
                    	$browser['os']    = 'ipad' ;
                    	$_version	= (int) $_q['query']['ipad_debug'] ;
                   		if( $_version > 0 ) {
                    		$browser['os_version'] = $_version ;
                    	}
                    } else if(  isset($_q['query']['iphone_debug'])  ){
                    	$browser['mobile']    = true ;
                    	$browser['os']    = 'iphone' ;
                    	$_version	= (int) $_q['query']['iphone_debug'] ;
                    	if( $_version > 0 ) {
                    		$browser['os_version'] = $_version ;
                    	}
                    } else if(  isset($_q['query']['ipod_debug'])  ){
                    	$browser['mobile']    = true ;
                    	$browser['os']    = 'ipod' ;
                    	$_version	= (int) $_q['query']['ipod_debug'] ;
                   		if( $_version > 0 ) {
                    		$browser['os_version'] = $_version ;
                    	}
                    }
                    if( isset($_q['query']['safari_debug']) ){
                    	$browser['name']    = 'safari' ;
                    	$browser['engine']  = 'webkit' ;
                    	$_version	= (int) $_q['query']['safari_debug'] ;
                    	if( $_version > 0 ) {
                    		$browser['version'] = $_version ;
                    	}
                    } else if( isset($_q['query']['chrome_debug']) ){
                    	$browser['name']    = 'chrome' ;
                    	$browser['engine']  = 'webkit' ;
                    	$_version	= (int) $_q['query']['chrome_debug'] ;
                   		if( $_version > 0 ) {
                    		$browser['version'] = $_version ;
                    	}
                    }
                } 
				
                $browser['is_iphone']	= 'iphone' == $browser['os'];
                $browser['is_ipod']		= 'ipod' == $browser['os'];
                $browser['is_ipad']		= 'ipad' == $browser['os'];
                $browser['is_android']	= 'android' == $browser['os'];
                
                $browser['is_debug']	= $is_debug ;
                

                $browser['use_html5player']	= false ;
                if( $browser['engine'] === 'webkit' ){
                     if( $is_testing || $browser['mobile'] ) {
                        $browser['use_html5player']	= true ;
                     } else if( $is_debug ) {
                         $app_request   = self::orig_request() ;
                         if( isset($app_request['query']['use_html5player']) ){
                            $browser['use_html5player']	= true ;
                         }
                     }
                }
                if( $browser['use_html5player']  ) {
                    if( $is_debug) {
                           $app_request   = self::orig_request() ;
                           if( isset($app_request['query']['use_flashplayer']) ){
                            $browser['use_html5player']	= false ;
                           }
                    }
                    if( $browser['is_android'] && $browser['os_version'] >= 4 ) {
                           $browser['use_html5player']	= false ;
                    }
                }

                if ( !$is_debug ) {
                	$_SESSION[ $session_cache_key ] = $browser ;
                }
            }
        }
        return $browser ;
    }
    
    static public function is_debug_profile() {
    	static $is_debug	= null ;
    	if( null === $is_debug ) {
    		$is_debug	= isset($_COOKIE['XDEBUG_PROFILE']) && 'GMC_DEBUG' == $_COOKIE['XDEBUG_PROFILE'] ;
    	}
    	return $is_debug ;
    }
    
    static public function is_debug() {
        static $is_debug	= null ;
        if( null === $is_debug ) {
            $is_debug	=   isset($_COOKIE['XDEBUG_SESSION']) && 'GMC_DEBUG' == $_COOKIE['XDEBUG_SESSION'] ;
        }
        return $is_debug ;
    }

    static public function is_deveploer() {
        static $is_local = null ;
        if( null === $is_local){
            if( isset($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
                $is_local    = '202.111.41.74' ==  $_SERVER['HTTP_X_FORWARDED_FOR'] || '58.240.219.10' == $_SERVER['HTTP_X_FORWARDED_FOR'] ;
            } else if($_SERVER['HTTP_X_REAL_IP']){
                $is_local    = '202.111.41.74' ==  $_SERVER['HTTP_X_REAL_IP'] || '58.240.219.10' == $_SERVER['HTTP_X_REAL_IP'] ;
            } else {
                $is_local    = '202.111.41.74' ==  $_SERVER['REMOTE_ADDR']  || '58.240.219.10' == $_SERVER['REMOTE_ADDR'] ;
            }
        }
        return $is_local ;
    }

    static public function is_testing(){
        static $is_tesging	= null ;
        if( null === $is_tesging ) {
            $is_tesging	= $_SERVER['SERVER_NAME'] != 'www.guitarmasterclass.net' ;
        }
        return $is_tesging ;
    }

    static public function is_local(){
        static $is_local = null ;
        if( null === $is_local){
            if( isset($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
                $is_local    = '127.0.0.1' ==  $_SERVER['HTTP_X_FORWARDED_FOR'] ;
            } else if($_SERVER['HTTP_X_REAL_IP']){
                $is_local    = '127.0.0.1' ==  $_SERVER['HTTP_X_REAL_IP'] ;
            } else {
                $is_local    = '127.0.0.1' ==  $_SERVER['REMOTE_ADDR'] ;
            }
        }
        return $is_local ;
    }

    static public function onExit(){
        /**
         * xhprof for performance analysis
         */
        if( self::$_use_xhprof ) {
            $xhprof_data = xhprof_disable() ;
            $time_use    = microtime(true) -  self::$_xhprof_start_time ;
            $file_name    = preg_replace('/^\W+|\W+$/','', self::$_xhprof_page) ;
            if( $time_use > 0.4 ){
                $file_name    = 'use_time_______' . $time_use  . '_______' . $file_name ;
            }
            	
            $file_name    = preg_replace('/\W/', '_',  $file_name ) ;
            	
            include_once  'xhprof_lib/utils/xhprof_lib.php' ;
            include_once  'xhprof_lib/utils/xhprof_runs.php' ;
            $xhprof_runs = new XHProfRuns_Default();
            $run_id = $xhprof_runs->save_run($xhprof_data, $file_name) ;
        }
    }

    static public function print_trace(){
        $dt	= debug_backtrace();
        foreach($dt as $i => & $o){
            if( is_object($o['object']) ) {
                $o['object']	= get_class($o['object']);
            }
            if( is_array($o['args']) ) foreach($o['args'] as & $_o){
                if( is_object($_o) ) {
                    $_o =  get_class($_o);
                } else if( is_array($_o) ){
                    $_o	= array_keys($_o);
                }
            }
        }
        print_r($dt);
        exit() ;
    }


    static public function system($cmd, $file, $line, $return_data = false , $async = false ) {
        $_file_path    = preg_replace('/\W/', '_', strtolower($file) )  ;
        $_file    = '/tmp/app_system_' . $_file_path . '_' . $line .  '_' . time() . '_' .  rand(0, 0x7fffffff ) . '.log' ;
        $_cmd    = $cmd . ' > ' . $_file . ' 2>&1';
        $log    = "\n" . $cmd ;
        $log    .= "\nstart: " . date('Y/m/d H:i:s') ;
        $ret    = system($_cmd) ;
        if( $return_data ) {
            if( $ret ) {
                throw new Exception( sprintf('system error at file:%s, line:%s', $file, $line) ) ;
            }
            $return_data    = file_get_contents($_file) ;
        } else {
            $return_data    = $ret ;
        }
        $log    .= "\nend: " . date('Y/m/d H:i:s') ;
        if( App::is_debug() ) {
            file_put_contents($_file,  $log , FILE_APPEND  ) ;
        } else {
            @unlink($_file) ;
        }
        return $return_data ;
    }

    static public function sendfile( $path, $file, $line, $use_cache = false ) {
        $is_debug    = false ;
        // $is_debug    =  '202.111.41.74' == $_SERVER['HTTP_X_REAL_IP'] ;
        if(
                isset($_SERVER['HTTP_X_REAL_IP'])
        		|| strpos($_SERVER['SERVER_SOFTWARE'], 'nginx') !== false
                // && '202.111.41.74' == $_SERVER['HTTP_X_REAL_IP']
        ) {
            $file_size    = 0 ;
            if( file_exists($path) ) {
                $path    = realpath($path) ;
                $file_size    = @filesize($path) ;
                if( $use_cache
                        // && $is_debug
                ) {
                    $last_modified    = @filemtime($path) ;
                    if( $last_modified > 0 ) {
                        $etag = '"' . md5( $path ) . ':' . base_convert($last_modified, 10, 16) . ':' . base_convert( $file_size, 10, 16) . '"';
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $last_modified ).' GMT');
                        header('ETag:'. $etag) ;
                        header( "Content-Length: " . $file_size );
                        if(
                                /*
                                 (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])   &&
                                         strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $last_modified
                                 )
                        ||
                        (isset($_SERVER['HTTP_IF_UNMODIFIED_SINCE'])  &&
                                strtotime($_SERVER['HTTP_IF_UNMODIFIED_SINCE']) < $last_modified )
                        ||
                        */
                                (isset($_SERVER['HTTP_IF_NONE_MATCH']) &&
                                        $_SERVER['HTTP_IF_NONE_MATCH'] == $etag )
                        ) {
                            header("HTTP/1.1 304 Not Modified");
                            exit(0);
                        }
                    }
                }
            } elseif ( App::is_testing() && $_SERVER['SERVER_NAME'] != self::product_domain ){
            	$_q		= App::orig_request();
            	$_url	= App::request_scheme() . '://' . self::product_domain .  $_SERVER['REQUEST_URI'] ;
            	header('Location: ' . $_url );
            	exit;
            }
            $root    = $_SERVER['DOCUMENT_ROOT'] ;
            if( '/' == substr($root, -1) ) {
                $root    = substr($root, 0, -1) ;
            }
            $root    = dirname($root) ;
            if( strpos($path, $root) === 0 ) {
                $_path    = str_replace($root, '/xsendfile/', $path) ;
                $_path    = str_replace('//', '/', $_path) ;
                header('X-Accel-Redirect: ' . $_path ) ;
                header( "Content-Length: " . $file_size ) ;
                if( $is_debug ) {
                    $log_data    = $file . ':' . $line . ':' . date('y/m/d H:i:s') . "\n"
                    . $path . "\n"
                    . $_path . "\n"
                    . $_SERVER["REQUEST_URI"] . "\n"
                    ;
                    file_put_contents('/tmp/xsendfile.log', $log_data , FILE_APPEND ) ;
                }
                return ;
            }
        }
        header("X-Sendfile: ". $path);
    }

    static public function sendCacheHeader( $delay , $file, $line ) {
        $time    = time() + $delay ;
        $date = date('D, d M Y H:i:s', $time ) . ' GMT' ;
        header("Pragma: public");
        header('Expires: ' . $date);
        header('Cache-Control: public, max-age=' . $delay . ', must-revalidate' ) ;
    }

    /**
     * @param string $prefix
     * @return \Cache\Cache
     */
    static public function cache( $prefix = 'gmc' ) {
        static $cahce    = array() ;
        if( !isset($cahce[$prefix])  ) {
            $host_prefix    = strtok($_SERVER['SERVER_NAME'], '.' ) ;
            $options    = self::$config['php-cache'] ;
            $options['prefix']    =  $host_prefix . '_' .$prefix ;
            $root    =  __DIR__ . '/../php-cache/tmp/cache_' . $host_prefix ;
            if( !file_exists($root) ) {
                mkdir($root, 0755) ;
            }
            $cahce[$prefix]    = new Cache(  $root , $options ) ;
        }
        return $cahce[$prefix] ;
    }


    /**
     * @param string $timer
     * @param integer $timeout_second
     * @return bool
     */
    static public function is_timeout( $timer, $timeout_second = 60 , $update_timer = true ) {
        $cache_key    = 'global_timer' ;
        $cache    = App::cache($cache_key);
        $last_time    = $cache->retrieve($cache_key ) ;
        $now    = time() ;
        if( $last_time && $now - $last_time < $timeout_second ) {
            return false ;
        }
        if( $update_timer ) {
            $cache->store($cache_key, $now ,
                    array( 'ttl' => APP::cache_timeout ,
                            'tags' => array( $cache_key ) ) ) ;
        }
        return true ;
    }

    static public function deploy_config() {
        return self::$config ;
    }


    static public function deploy_domain(){
        return self::$config['domain'] ;
    }

    static public function deploy_version() {
        return self::$config['version'] ;
    }
    
    static public function is_forece_utf8(){
    	$is_forece_utf8	= null ;
    	if( null == $is_forece_utf8 ) {
    		$q	= self::orig_request() ;
    		$is_forece_utf8	= true ;
    		if( isset($q['gmc_db_utf8_debug']) ) {
    			$is_forece_utf8	= false ;
    		}
    	}
    	return $is_forece_utf8 ;
    }
    
    /**
     * @return PDO
     */
    static public function sqlite( $name ) {
    	static $sqlite_caches	= array() ;
    	$name	= preg_replace('/\W/', '_', $name) ;
    	if( !array_key_exists($name, $sqlite_caches) ) {
	    	$_dir	= __DIR__ . '/../../internals/cache/sqlite/pdo_' . $name . '.db3' ;
	    	$dsn = 'sqlite:' . $_dir ;
	    	$pdo = new PDO($dsn) ;
	    	$sqlite_caches[$name]	= $pdo ;
    	} else {
    		$pdo	= $sqlite_caches[$name] ;
    	}
    	return $pdo ;
    }
    
    /**
     * @return PDO
     */
    static public function pdo(){
        static $pdo    = null ;
        if( null == $pdo ) {
            $conf     = self::$config['db_settings'] ;
            $dsn = 'mysql:dbname=' . $conf['database'] . ';host=' . $conf['host'] ;
            $user    = $conf['user'] ;
            $pass    = $conf['pass'] ;
            if( isset($conf['port']) ) {
                if( (int) $conf['port'] > 1000 ) {
                    $dsn    .= ';port='  . $conf['port'] ;
                } else {
                    $dsn    .= ';unix_socket='  . $conf['port'] ;
                }
                 
            }
            $options    = array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ,
                    PDO::ATTR_CASE => PDO::CASE_LOWER ,
            ) ;
            $pdo = new PDO($dsn, $user,$pass, $options ) ;
            if( App::is_forece_utf8() ) {
            	$sth    = $pdo->prepare('SET NAMES utf8');
            }
            $sth->execute();
            $sth->closeCursor();
        }
        return $pdo ;
    }

    /**
     * @return FluentPDO
     */
    static public function fpdo( $_pdo	= null ) {
    	if( null != $_pdo ) {
    		return new FluentPDO($_pdo);
    	}
        static $pdb    = null ;
        if( null == $pdb ) {
            $pdo = self::pdo();
            $pdb = new FluentPDO($pdo);
        }
        return $pdb ;
    }

    static public function clearFrontQueue(){
        App::cache('fq')->eraseByTag('front_queue') ;
        
        $video_lessons_cache	= App::cache('video_lessons') ;
        $video_lessons_cache->eraseByTags( array('video_lessons') ) ;
        
    }

    static public function orig_request(){
        static $uri    = null ;
        if( $uri == null ) {
            $uri    = parse_url($_SERVER['REQUEST_URI']) ;
            $q = array() ;
            if( isset($uri['query']) ) {
                parse_str($uri['query'], $q);
            }
            $uri['query'] =  $q ;
        }
        return $uri ;
    }
    
    static public function orig_referer(){
    	static $uri    = null ;
    	if( $uri == null ) {
	    	if( isset($_SERVER['HTTP_REFERER']) ) {
	    		$uri    = parse_url($_SERVER['HTTP_REFERER']) ;
	    		$q = array() ;
	    		if( isset($uri['query']) ) {
	    			parse_str($uri['query'], $q);
	    		}
	    		$uri['query'] =  $q ;
    		} else {
    			$uri	= array( 'query' => array() );
    		}
    	}
    	return $uri ;
    }

    static public function check_https(){
        static $checked    = null ;
        if( null !== $checked ) {
            return ;
        }
         
        if( !self::app_use_https ) {
            return ;
        }
        $checked    = true ;
        if( isset($_POST) && !empty($_POST) ){
            return ;
        }
        $uri    = $_SERVER['REQUEST_URI'] ;
        $skip_check_pages    = array(
                '/font/' ,
                '/adminjs/' ,
                '/actions/live-update/',
                '/actions/update-chat-status/' ,
        );
        foreach($skip_check_pages as $_uri) {
            if( 0 === strpos($uri, $_uri) ){
                return ;
            }
        }
        $force_https_pages    = array(
                '/actions/login/' ,
                '/wrong-username-password/' ,
                 
                '/new-password/' ,
                '/restorepassword/' ,
                '/passwordsent/' ,
                '/passwordreset/' ,
                 
                '/signup/' ,
                '/actions/payment/' ,
                '/dibs-response/' ,
                '/dibs-callback/' ,
                '/paypal-review-payment/' ,
                '/actions/paypal-payment/' ,
                // '/actions/paypal-process-payment/' ,
                 
        ) ;
        $use_https    = false ;
        foreach($force_https_pages as $_uri) {
            if( 0 === strpos($uri, $_uri) ){
                $use_https    = true ;
                break ;
            }
        }
        $force_redirect = false ;
        $is_https    = self::is_https() ;
        if( $is_https ) {
            if( !$use_https ) {
                $force_redirect = true ;
            }
        } else {
            if( $use_https ) {
                $force_redirect = true ;
            }
        }
        if( $force_redirect ) {
            $url    = ($use_https ? 'https://': 'http://') . $_SERVER['SERVER_NAME'] . $uri ;
            if( App::is_debug() ) {
                $debug_data    = array(
                        'old_url'    => $uri ,
                        'new_url'    => $url ,
                        'use_https'    => $use_https ,
                        'is_https'    => $is_https ,
                        'force_redirect'    => $force_redirect ,
                );
                var_dump($debug_data);
            } else {
                header('location: ' . $url );
            }
            exit;
        }
    }

    static function force_use_https() {
        if( self::is_local() ) {
            return ;
        }
        if( self::app_use_https ) {
            if( ! self::is_https() ) {
                header('location: /') ;
                exit;
            }
        }
    }
    
    static function secure_link($path , $timeout = 3600 ) {
    	static $map_dirs	= null ;
    	static $secret 		= 'segredo';
    	if ( null === $map_dirs ) {
    		$_root	= dirname( dirname(__DIR__) ) ;
    		$map_dirs	= array(
    					'/downloads/lm2/'	=> $_root . '/public_html/icp/lm2/files/flv/' ,
    			);
    	}
    	
    	$secure_url	= null ;
    	
    	foreach($map_dirs as $url => $dir ) {
    		if ( 0 === strpos($path, $dir) ) {
    			$protected_resource	= substr( $path, strlen($dir) ) ;
    			$url_path	= $url  . $protected_resource ;
    			
    			$arg_e	= time() + $timeout ;
    			
    			$md5 = base64_encode(md5($secret . $url_path . $arg_e, true)); // Using binary hashing.
    			$md5 = strtr($md5, '+/', '-_'); // + and / are considered special characters in URLs, see the wikipedia page linked in references.
    			$md5 = str_replace('=', '', $md5);
    			$secure_url	=  $url_path . '?st=' . $md5 . '&e=' . $arg_e ;
    			break ;
    			
    		}
    	}
    	
    	return $secure_url ;
    }
    
    /**
     * @return User
     */
    static function getUser(){
    	if( isset($GLOBALS['USER']) ) {
    		return $GLOBALS['USER'] ;
    	}
    	return null ;
	}
	
	/**
	 * @return Gmc\FFMpeg\Coder
	 */
	static function ffmpeg () {
		static $ffmpeg	= null ;
		if( null== $ffmpeg ) {
			$logger = new Monolog\Logger('ffmpeg');
			$logger->pushHandler(new \Monolog\Handler\NullHandler()) ;
			$ffmpeg = \Gmc\FFmpeg\Coder::load($logger);
			$probe = \FFMpeg\FFProbe::load( $logger ) ;
			$ffmpeg->setProber($probe);
		}
		return $ffmpeg ;
	}
}

//App::onLoad();
