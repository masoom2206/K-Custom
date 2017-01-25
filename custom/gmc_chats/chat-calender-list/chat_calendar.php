<?php


	require_once 'lib/classes/App.php';
	require_once 'Zend/Loader.php';
	//set_include_path( __DIR__ . '/../library/' . PATH_SEPARATOR .  get_include_path()  ) ;
	Zend_Loader::loadClass('Zend_Gdata');
	Zend_Loader::loadClass('Zend_Gdata_AuthSub');
	Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
	Zend_Loader::loadClass('Zend_Gdata_HttpClient');
	Zend_Loader::loadClass('Zend_Gdata_Calendar');

	$get_calender_data        = function ($cache, $key) {
		$is_debug        = 0 && ( App::is_testing() || App::is_deveploer() ) ;
		$googleAccount = 'loong0xf@gmail.com';
		$googlePassword = 'q123123.';
		$calendarID = 'loong0xf@gmail.com';
		$client = Zend_Gdata_ClientLogin::getHttpClient($googleAccount, $googlePassword, Zend_Gdata_Calendar::AUTH_SERVICE_NAME);
		$last_time        = time() + 3600 * 24 * 18 ;
		$service = new Zend_Gdata_Calendar($client);
		$query = $service->newEventQuery();
		$query->setUser('pfg4s8ijqoigsq9sdjgkrd01f0%40group.calendar.google.com');
		$query->setVisibility('public');
		$query->setProjection('full');
		$query->setOrderby('starttime'); 
		$query->setFutureevents('true');
		$query->setStartMin( date('Y-m-d H:i:s') );
		$query->setStartMax( date('Y-m-d H:i:s', $last_time ) );

		// Retrieve the event list from the calendar server
		try {
			$eventFeed = $service->getCalendarEventFeed($query);
		}
		catch (Zend_Gdata_App_Exception $e) {
			echo "Error: " . $e->getMessage();
			echo "\n", __FILE__, ':', __LINE__ ;
			exit;
		}
		// Iterate through the list of events, outputting them as an HTML list
		$list        = array() ;
		foreach ($eventFeed as $event) if( $event instanceof Zend_Gdata_Calendar_EventEntry ){
			$status        = $event->getEventStatus() ;
			if( ! preg_match('/event.confirmed/', $status->getValue() ) ){
				continue;
			}
			if( $is_debug ){
				echo "\n\n\n";
				echo 'id: ', $event->id->text, "\n" ;
				echo 'title: ', $event->title->text, "\n" ;
				echo 'content: ', $event->content->text, "\n" ;
				echo 'published: ', $event->getPublished() , "\n" ; 
				echo 'status: ', $event->getEventStatus() , "\n" ; 
				echo 'visibility: ', $event->getVisibility() , "\n" ; 
			}
			foreach ($event->when as $when)  if( $when instanceof Zend_Gdata_Extension_When) {
				if( $is_debug ) {
					echo "        when:[ ", $when->startTime, ', ', $when->endTime, ', ' ,  $when->valueString ,  " ]\n" ;
				}
				$_start_time        = strtotime( $when->startTime ) ;
				if(  $_start_time > $last_time ) {
					break ;
				}
				$e        = array(
				'id'                => $event->id->text ,
				'title'                => $event->title->text ,
				'content'        => $event->content->text ,
				'where'                => $when->valueString ,
				'startTime'        => $when->startTime  ,
				'endTime'        => $when->endTime  ,
				);
				$list[ $_start_time ]        = $e;
			}
			else {
				echo __FILE__, ':', __LINE__; 
				exit;
			}
		} else {
			echo __FILE__, ':', __LINE__; 
			exit;
		}
		ksort( $list );
		$list        = array_values($list);
		$ttl        = App::cache_timeout ;
		if( App::is_testing() ){
			$ttl        =  $ttl / 10 ;
		}
		return $cache->store($key, $list, array (
			'ttl'        => $ttl ,
			// 'tags'        => array( 'chat_calendar_tag' ) ,
		));
	};
	$q        = App::orig_request() ;
	$cache        = App::cache('chat_calendar') ;
	$cache_key        = 'my_calendar_cache_' .  App::deploy_version() ;
	$clear_cache        = isset($q['query']['clear_cache']) ;
	if( $clear_cache ){
		// $cache->erase( array($cache_key) );
		$get_calender_data( $cache, $cache_key ) ;
		echo "cache is cleared!";
		exit;
	}
	$_list        = $cache->retrieve( $cache_key , $get_calender_data ) ;
	$tz        = null ;
	$offset        = 0 ;
	$q        = App::orig_request() ;
	$london_tz        = 'Europe/London' ;
	$london_offset        = 7200 ;
	if( isset($q['query']['tz']) ) {
		$offset        =  (int) $q['query']['tz'] ;
		foreach(DateTimeZone::listAbbreviations() as $o){
			if(  $offset == $o[0]['offset']) {
				$tz        = $o[0]['timezone_id'] ;
				break ;
			}
			/*
			foreach($o as $_o){
				if($_o['timezone_id'] == $london_offset ) {
				print_r($o); die;
				}
			}
			*/
		}
	}
	if( !$tz ) {
		$tz        = 'CET' ;
	} 
	date_default_timezone_set( $tz );
	if( (int) date('Z') != $offset ) {
		if( App::is_testing() || App::is_deveploer() ){
			//throw new Exception('error');
		}
	}
	$list        = array() ; 
	foreach($_list as $e){
		$e['startTime']        = strtotime( $e['startTime'] ) ;
		$e['endTime']        = strtotime( $e['endTime'] ) ;
		/*
		$e['startDate']        = date( 'Y/m/d H:i', $e['startTime'] ) ;
		$e['endDate']        = date( 'Y/m/d H:i', $e['endTime'] ) ;
		*/

		$e['_date']        = date( 'Y/m/d', $e['startTime'] ) ;
		$e['_time']        = date( 'H:i', $e['startTime'] ) ;

		$list[ $e['startTime'] ]        = $e ;
	}
	date_default_timezone_set( $london_tz );
	foreach($list as & $e ) {
		$e['date']        = date( 'Y/m/d',  $e['startTime'] ) ;
		$e['time']        = date( 'H:i',  $e['startTime'] ) ; 
	}
	ksort($list) ;
	$json        = array(
		'timezone'        =>  array(
			'name'                =>  $tz ,
			'offset'        => (int) date('Z') ,
		),
		'events'        => array_values($list) ,
	);
	echo json_encode($json , JSON_PRETTY_PRINT );
