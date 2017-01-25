<!DOCTYPE html>
<html>
  <head>
    	<meta charset="utf-8">
	<meta name="viewport" content="user-scalable=no" />
    <title>Gmc HTML5 Player</title>
    <link rel="stylesheet" href="http://www.guitarmasterclass.net/site/html5playercss/gmc.1387117464.css/" type="text/css" media="screen" charset="utf-8" />
    <script type="text/javascript">var App  = {"name":"chrome","version":31,"engine":"webkit","os":"win","os_version":5,"mobile":false,"app_version":1387117464,"is_iphone":false,"is_ipod":false,"is_ipad":false,"is_android":false,"is_debug":false,"use_html5player":false,"lesson_id":3353,"lesson_lotd":0,"player_debug":0,"player_static_tools":0} ;</script>
    <script type="text/javascript" src="http://www.guitarmasterclass.net/actions/getlessonpartslist/3353/?jsonp=App.lesson_data"></script>
  </head>
<body class="app_chrome app_chrome31 app_win app_win5">

<div id="player_box">

	<div id="player">
	    <div>
			<video preload="metadata" id="mp4_player"><source type="video/mp4" src="/actions/getvideo/5090f130d8cdd.mp4"></video>
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
					<p>click to close</p>
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
		
		div id="metronome_box">
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


<script type="text/javascript" src="http://www.guitarmasterclass.net/site/html5playerjs/gmc.1387117464.js/"></script>

</body>
</html>