<?php

final class App {
  static private $_use_xhprof ;
  static private $_xhprof_page ;
  static private $_xhprof_start_time ;
  static private $_use_bootstrap = false ;
  const cache_timeout = 3600 ;
  const app_use_https = true ;
  const product_domain	= 'admin.prod.my.gmc' ;
  static private $config = null ;
  static private $_is_console = false ;
  static function request_browser( $referer_debug = false ) {
      static $browser	= null ;
      if ( null === $browser ) {
        $is_testing = App::is_testing() ;
        $is_debug	= App::is_debug() || $is_testing || App::is_deveploer() ;
        $deploy_version	= App::deploy_version() ;
        $session_cache_key	= 'app_client_browser_cache_' . $deploy_version ;

      if( !$is_debug ) {
        if( isset($_SESSION) && isset($_SESSION[ $session_cache_key ]) ) {
          $browser = $_SESSION[ $session_cache_key ] ;
          return $browser ;
        }
      }
            
      $browser	= array(
                   'name' => false ,
                   'version' => false ,
                   'engine' => false ,
                   'os' => false ,
                   'os_version' => false ,
                   'mobile' => false ,
				   'android_tablet'	=>	false ,
               ) ;
      
            if( isset($_SERVER['HTTP_USER_AGENT']) ) {
                
                if( preg_match('/\WAppleWebKit\W/', $_SERVER['HTTP_USER_AGENT']) ){
                    $browser['engine'] = 'webkit' ;
                    if( preg_match('/\WChrome\/(\d+)\.([\.\d]+)\W/', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name'] = 'chrome' ;
                        $browser['version'] = $ls[1] ;
                    } else if( preg_match('/\W\sVersion\/(\d+)\.([\.\d]+)\s+Safari\//', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name'] = 'safari' ;
                        $browser['version'] = $ls[1] ;
                    } else if( preg_match('/\W\sVersion\/(\d+)\.([\.\d]+)\s+Mobile\/(\w+)\s+Safari\//', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name'] = 'safari' ;
                        $browser['version'] = $ls[1] ;
                        $browser['mobile'] = true ;
                    }
                } else if( preg_match('/\sMSIE\s+(\d+)\.([\.\d+]);\W/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['engine'] = 'trident' ;
                    $browser['name'] = 'ie' ;
                    $browser['version'] = $ls[1] ;
                } else if( preg_match('/\sGecko\/(\d+)\s/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['engine'] = 'gecko' ;
                    if( preg_match('/\WFirefox\/(\d+)\.([\.\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls ) ){
                        $browser['name'] = 'firefox' ;
                        $browser['version'] = $ls[1] ;
                    }else {
                        
                    }
                } else if( preg_match('/Opera\/(\d+)\.([\.\d]+)\W/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['engine'] = 'presto' ;
                    $browser['name'] = 'opera' ;
                    $browser['version'] = $ls[1] ;
                } 
                
                if( preg_match('/Mac OS X ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'osx' ;
                    $browser['os_version'] = $ls[1] ;
                } else if(preg_match('/Windows NT (\d+)\.([\.\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'win' ;
                    $browser['os_version'] = $ls[1] ;
                } else if(preg_match('/\siPhone OS ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'iphone' ;
                    $browser['os_version'] = $ls[1] ;
                    $browser['mobile'] = true ;
                } else if(preg_match('/\WiPad\W.+? OS ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'ipad' ;
                    $browser['os_version'] = $ls[1] ;
                    $browser['mobile'] = true ;
                } else if(preg_match('/\siPod OS ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'ipod' ;
                    $browser['os_version'] = $ls[1] ;
                    $browser['mobile'] = true ;
                } /*else if(preg_match('/\sAndroid ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'android' ;
                    $browser['os_version'] = $ls[1] ;
                    $browser['mobile'] = true ;
                } else if(preg_match('/Android/i', $_SERVER['HTTP_USER_AGENT'], $ls) ){
                    $browser['os'] = 'android' ;
                    $browser['os_version'] = 5.0;
                    $browser['mobile'] = true ;
                }*/
				else if(stripos($_SERVER['HTTP_USER_AGENT'],"Android") && stripos($_SERVER['HTTP_USER_AGENT'],"mobile")){
					if(preg_match('/\sAndroid ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
						$browser['os'] = 'android' ;
						$browser['os_version'] = $ls[1] ;
						$browser['mobile'] = true ;
					} else if(preg_match('/Android/i', $_SERVER['HTTP_USER_AGENT'], $ls) ){
						$browser['os'] = 'android' ;
						$browser['os_version'] = 5.0;
						$browser['mobile'] = true ;
					}
				}
				else if(stripos($_SERVER['HTTP_USER_AGENT'],"Android")){
					if(preg_match('/\sAndroid ([\.\_\d]+)/', $_SERVER['HTTP_USER_AGENT'], $ls) ){
						$browser['os'] = 'android' ;
						$browser['os_version'] = $ls[1] ;
						$browser['android_tablet'] = true ;
					} else if(preg_match('/Android/i', $_SERVER['HTTP_USER_AGENT'], $ls) ){
						$browser['os'] = 'android' ;
						$browser['os_version'] = 5.0;
						$browser['android_tablet'] = true ;
					}
				}
                 if( $browser['version'] ) {
                    $browser['version'] = (int) $browser['version'] ;
                }
                
                if( $browser['os_version'] ) {
                    $browser['os_version'] = (int) $browser['os_version'] ;
                }
                
                $browser['app_version'] = self::deploy_version() ;
                
                if( $is_debug ) {
                    $browser['agent'] = $_SERVER['HTTP_USER_AGENT'] ;
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
                     $browser['mobile'] = true ;
                     $browser['os'] = 'ipad' ;
                     $_version	= (int) $_q['query']['ipad_debug'] ;
                    if( $_version > 0 ) {
                     $browser['os_version'] = $_version ;
                     }
                    } else if( isset($_q['query']['iphone_debug']) ){
                     $browser['mobile'] = true ;
                     $browser['os'] = 'iphone' ;
                     $_version	= (int) $_q['query']['iphone_debug'] ;
                     if( $_version > 0 ) {
                     $browser['os_version'] = $_version ;
                     }
                    } else if( isset($_q['query']['ipod_debug']) ){
                     $browser['mobile'] = true ;
                     $browser['os'] = 'ipod' ;
                     $_version	= (int) $_q['query']['ipod_debug'] ;
                    if( $_version > 0 ) {
                     $browser['os_version'] = $_version ;
                     }
                    }
                    if( isset($_q['query']['safari_debug']) ){
                     $browser['name'] = 'safari' ;
                     $browser['engine'] = 'webkit' ;
                     $_version	= (int) $_q['query']['safari_debug'] ;
                     if( $_version > 0 ) {
                     $browser['version'] = $_version ;
                     }
                    } else if( isset($_q['query']['chrome_debug']) ){
                     $browser['name'] = 'chrome' ;
                     $browser['engine'] = 'webkit' ;
                     $_version	= (int) $_q['query']['chrome_debug'] ;
                    if( $_version > 0 ) {
                     $browser['version'] = $_version ;
                     }
                    }
                }

                $browser['is_iphone']	= 'iphone' == $browser['os'];
                $browser['is_ipod']	= 'ipod' == $browser['os'];
                $browser['is_ipad']	= 'ipad' == $browser['os'];
                $browser['is_android']	= 'android' == $browser['os'];
                
                $browser['is_debug']	= $is_debug ;
                

                $browser['use_html5player']	= false ;
                if( $browser['engine'] === 'webkit' ){
                     if( $is_testing || $browser['mobile'] ) {
                        $browser['use_html5player']	= true ;
                     } else if( $is_debug ) {
                         $app_request = self::orig_request() ;
                         if( isset($app_request['query']['use_html5player']) ){
                            $browser['use_html5player']	= true ;
                         }
                     }
                }
                if( $browser['use_html5player'] ) {
                    if( $is_debug) {
                           $app_request = self::orig_request() ;
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
    static public function orig_request(){
            static $uri = null ;
            if( $uri == null ) {
                $uri = parse_url($_SERVER['REQUEST_URI']) ;
                $q = array() ;
                if( isset($uri['query']) ) {
                    parse_str($uri['query'], $q);
                }
                $uri['query'] = $q ;
            }
            return $uri ;
        }
        
    static public function orig_referer(){
         static $uri = null ;
         if( $uri == null ) {
    if( isset($_SERVER['HTTP_REFERER']) ) {
    $uri = parse_url($_SERVER['HTTP_REFERER']) ;
    $q = array() ;
    if( isset($uri['query']) ) {
    parse_str($uri['query'], $q);
    }
    $uri['query'] = $q ;
         } else {
         $uri	= array( 'query' => array() );
         }
         }
         return $uri ;
        }
    static public function is_testing(){
        static $is_tesging	= null ;
        if( null === $is_tesging ) {
            $is_tesging	= $_SERVER['SERVER_NAME'] != 'www.guitarmasterclass.net' ;
        }
        return $is_tesging ;
    }

    static public function is_debug() {
        static $is_debug	= null ;
        if( null === $is_debug ) {
            $is_debug	= isset($_COOKIE['XDEBUG_SESSION']) && 'GMC_DEBUG' == $_COOKIE['XDEBUG_SESSION'] ;
        }
        return $is_debug ;
    }
static public function deploy_version() {
        return self::$config['version'] ;
    }
  static public function sendfile( $path, $file, $line, $use_cache = false ) {
        $is_debug = false ;
        // $is_debug = '202.111.41.74' == $_SERVER['HTTP_X_REAL_IP'] ;
        if(
                isset($_SERVER['HTTP_X_REAL_IP'])
         || strpos($_SERVER['SERVER_SOFTWARE'], 'nginx') !== false
                // && '202.111.41.74' == $_SERVER['HTTP_X_REAL_IP']
        ) {
            $file_size = 0 ;
            if( file_exists($path) ) {
                $path = realpath($path) ;
                $file_size = @filesize($path) ;
                if( $use_cache
                        // && $is_debug
                ) {
                    $last_modified = @filemtime($path) ;
                    if( $last_modified > 0 ) {
                        $etag = '"' . md5( $path ) . ':' . base_convert($last_modified, 10, 16) . ':' . base_convert( $file_size, 10, 16) . '"';
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $last_modified ).' GMT');
                        header('ETag:'. $etag) ;
                        header( "Content-Length: " . $file_size );
                        if(
                                /*
(isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) &&
strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $last_modified
)
||
(isset($_SERVER['HTTP_IF_UNMODIFIED_SINCE']) &&
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
             $_q	= App::orig_request();
             $_url	= App::request_scheme() . '://' . self::product_domain . $_SERVER['REQUEST_URI'] ;
             header('Location: ' . $_url );
             exit;
            }
            $root = $_SERVER['DOCUMENT_ROOT'] ;
            if( '/' == substr($root, -1) ) {
                $root = substr($root, 0, -1) ;
            }
            $root = dirname($root) ;
            if( strpos($path, $root) === 0 ) {
                $_path = str_replace($root, '/xsendfile/', $path) ;
                $_path = str_replace('//', '/', $_path) ;
                header('X-Accel-Redirect: ' . $_path ) ;
                header( "Content-Length: " . $file_size ) ;
                if( $is_debug ) {
                    $log_data = $file . ':' . $line . ':' . date('y/m/d H:i:s') . "\n"
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
    
}
