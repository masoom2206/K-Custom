<?php
	$browser	= browserInfo();
    
    $browser['lesson_id']   = 3353 ;
    $browser['lesson_lotd']   =  0 ;
    $browser['player_debug']   = 0 ;
    $browser['player_static_tools']   = 0 ;
    if( isset($_GET['id']) ) {
        $browser['lesson_id']   = (int) $_GET['id'];
    }
    //$lesson_url =  '/actions/getlessonpartslist/' . $browser['lesson_id'] . '/?jsonp=App.lesson_data'   ;
	$lesson_url =  'http:\/\/admin.prod.gmc.my\/sites\/default\/files\/lick_of_the_day\/mp4\/C%20Lydian%20Lick.mp4';
    if( isset($_GET['lotd']) ) {
        $browser['lesson_lotd']   = 1 ;
        $lesson_url    .=  '&lotd=1' ;
    }
    
	$app_class	= array() ;
	$app_class[]	= 'app_' . $browser['name'] ;
	$app_class[]	= 'app_' . $browser['name'] . $browser['version'] ;
	$app_class[]	= 'app_' . $browser['os'] ;
	$app_class[]	= 'app_' . $browser['os'] . $browser['os_version'] ;
	if(  $browser['mobile'] ) {
		$app_class[]	= 'app_mobile';
	}
	if(  $browser['is_debug'] ) {
		$app_class[]	= 'app_debug' ;
        $browser['player_debug']   = 1 ;
	}
	if(  $browser['is_iphone'] || $browser['is_ipod'] ) {
		$app_class[]	= 'app_static_tools' ;
        $browser['player_static_tools']   = 1 ;
	}
	if(  $browser['lesson_lotd']   ) {
		$app_class[]	= 'app_lesson_lotd' ;
	}
	
	 if( isset($_GET['app_admin']) ) {
		$app_class[]	= 'app_admin' ;
	}
	
	/*
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
	*/
?>
<!DOCTYPE html>
<html>
  <head>
    	<meta charset="utf-8">
	<meta name="viewport" content="user-scalable=no" />
    <title>Gmc HTML5 Player</title>
    <link rel="stylesheet" href="/sites/all/modules/custom/lick_days/html5player/html5player.css" type="text/css" media="screen" charset="utf-8" />
    <script type="text/javascript">var App  = <?php echo json_encode($browser) ;?> ;</script>
    <script type="text/javascript" src="<?php echo $lesson_url ;?>"></script>
  </head>
<body class="<?php echo join(' ', $app_class);?>">

<div id="player_box">

	<div id="player">
	    <div>
			<video preload="metadata" id="mp4_player">http://admin.prod.gmc.my/sites/default/files/lick_of_the_day/mp4/C%20Lydian%20Lick.mp4</video>
	    </div>
	</div>

	<div id="player_mask">
		<div>
			<img src="images/memberonly.jpg" />
			<a href="/signup/" target="_blank"></a>
		</div>
	</div>

	<div id="tools">
		<div>
			<!--  arrow -->
			<p><a></a><a></a></p>
			<div>
				<!--  tools top padding -->
				<div id="tools_title"></div>
				<div id="tools_items"></div>
				<div id="tools_songs"></div>
			</div>
		</div>
		
		
		<div id="gmc_html5player_member_only" class="HideClassName">
				<div></div>
				<div style="border: 1px solid rgb(0, 0, 0); ">
					<div id="gmc_html5player_member_only_text">
						To access memeber content login or <a href="/signup/" target="_blank">sign up</a>
					</div>
					<p><?php echo $browser['mobile'] ? 'tap': 'click' ;?> to close</p>
				</div>
				<div></div>
		</div>
			
	</div>

	<div id="controlls">
		<div id="mp4_box">
			<div>
					<p class="controlls_title">VIDEO PLAYER</p>
					<div class="progress_time">00:00 / 00:00</div>
					<div class="play_or_pause"><p></p><div></div></div>
					<div class="progress_box">
						<div class="progress_bar_box">
							<div class="progress_bg_bar"></div>
							<div class="progress_buffer_bar"></div>
							<div class="progress_bar"></div>
							<div class="progress_position"></div>
						</div>
					</div>
				</div>
		</div>
		<div id="mp3_box">
			<div>
					<p class="controlls_title">BACKING TRACKS</p>
					<div class="progress_time">00:00 / 00:00</div>
					<div class="play_or_pause"><p></p><div></div></div>

					<div class="progress_box">
						<div class="progress_bar_box">
							<div class="progress_bg_bar"></div>
							<div class="progress_buffer_bar"></div>
							<div class="progress_bar"></div>
							<div class="progress_position"></div>
						</div>
					</div>
			</div>
		</div>
		
		<div id="quality_box">
			<div id="quality_btn"><a></a><span>HQ</span></div>
		</div>
		
		<div id="metronome_box">
			<p class="controlls_title">METRONOME</p>
			<input type="text" value="120"  maxlength="3" />
			<div>
				<div id="metronome_left"><a></a><span></span></div>
				<div id="metronome_right"><a></a><span></span></div>
				<div id="metronome_status"><a></a><span>start</span></div>
			</div>
		</div>
		
	</div>
	

</div>

<div id="full_screen"></div>
<div id="portrait_orientation"><p>Please turn your device to landscape orientation - for a better viewing experience</p></div>

<audio preload="metadata" id="metronome_player" loop="loop"></audio>
<audio preload="metadata" id="mp3_player"></audio>


<!--<script type="text/javascript" src="/sites/all/modules/custom/lick_days/html5player/jquery.js"></script>-->

</body>
</html>