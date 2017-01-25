<?php
  global $base_url,$user;
  $user_detail = $variables['user_detail'];
  $hasVideo = $variables['hasVideo'];
  $path = $variables['path'];
  $total_count = $variables['total_count'];
  drupal_set_title($variables['name'], $output = CHECK_PLAIN);
  $autostart = 'true';
  
  $browserInfo = browserInfo();
  $is_mobile = $browserInfo['mobile'];

	$cookie_name = 'Instructor'.$user_detail->uid;
	if (isset($_COOKIE['Instructor'.$user_detail->uid])) {
		if($_COOKIE['Instructor'.$user_detail->uid] == 1){
			$value = 2;
			setcookie($cookie_name, $value);
			$autostart = 'true';
		}
		else {
			$value = 3;
			setcookie($cookie_name, $value);
			$autostart = 'false';
		}
	}
	else {
		$value = 1;
		setcookie($cookie_name, $value);
		$autostart = 'true';
	}
?>
<!--********************************-->
<div id="page-instructor">&nbsp;
	<div class="content-block zeroTop">
		<div class="top"></div>
		<div class="profile-image">
			<p></p>
			<h2 class="instructor-subscribe-button <?php print $hasVideo; ?>" instructor-uid="<?php print $user_detail->uid; ?>" instructor-name="<?php print $user_detail->name; ?>" login-user-uid="<?php print $user->uid; ?>" login-user-email="<?php print $user->mail; ?>"><img src="/font/Subscribe+to+lessons+by+<?php print $user_detail->name; ?>/12/ffffef/" alt="Subscribe to lessons by <?php print $user_detail->name; ?>"><span class="rightside-end"></span></h2>
			<p></p>
			<?php //if(!empty($video_url)) {?>
			<?php if($hasVideo == 'hasVideo') {?>
				<?php if($is_mobile) { ?>
					<video poster="<?php print $path; ?>instructor-video-splash.jpg" width="448" height="252" src="<?php print $ios_video_url; ?>" controls="" autoplay="">
						<source src="<?php print $ios_video_url; ?>" type="video/mp4">
						Your browser does not support this video format.
					</video>
				<?php } else { ?>
					<object width="448" height="252" name="player" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" class="instructor-video" id="player">
						<param value="/sites/all/modules/custom/gmc_user_signup/swf/videoPlayer.swf" name="movie">
						<param value="true" name="allowfullscreen">
						<param value="always" name="allowscriptaccess">
						<param name="wmode" value="transparent">
						<param value="file=<?php print $video_url; ?>&amp;image=/hej.jpg&amp;skin=/sites/all/modules/custom/gmc_user_signup/swf/skin.swf&amp;controlbar=over&amp;autostart=<?php print $autostart; ?>&amp;bufferlength=4" name="flashvars">
						
						<embed width="448" height="252" flashvars="file=<?php print $video_url; ?>&amp;image=<?php print $path; ?>instructor-video-splash.jpg&amp;skin=/sites/all/modules/custom/gmc_user_signup/swf/skin.swf&amp;controlbar=over&amp;autostart=<?php print $autostart; ?>&amp;bufferlength=4" allowfullscreen="true" allowscriptaccess="always" wmode="transparent" src="/sites/all/modules/custom/gmc_user_signup/swf/videoPlayer.swf" name="player2" id="player2" type="application/x-shockwave-flash">
					</object>
				<?php } ?>
			<?php } else { ?>
			<div style="padding-right:12px;">
				<img style="display:block;float: right; height: 320px; width: 320px;" alt="<?php print $user_detail->name; ?>" src="<?php print $user_image; ?>" class="instr-pic-320">
			</div>
			<?php } ?>
		</div>
		<h1><img src="/font/<?php print $user_detail->name; ?>/20/" alt="<?php print $user_detail->name; ?>"></h1>
		<?php if(isset($user_detail->field_introduction['und']['0']['safe_value'])) {?>
			<p><?php print html_entity_decode($user_detail->field_introduction['und']['0']['safe_value']); ?></p>
		<?php } ?>
		<p>
			<img src="<?print $path; ?>/interact.jpg" width="28" height="27" align="absbottom">
			<b style="color:darkred;"> Interact with <?php print $first_name; ?>:</b>
			<?php if(isset($user_detail->field_board_id['und']['0']['value'])) {?>
				<a href="/guitar_forum?showforum=<?php print $user_detail->field_board_id['und']['0']['value']; ?>"><u>Personal Board</u></a>,
			<?php } ?>
			<a href="/forum-posts/<?php print $uid; ?>"> <u>Forum Posts</u></a>,			
			<?php if(isset($user_detail->field_enable_pm_link['und']['0']['value']) && $user_detail->field_enable_pm_link['und']['0']['value'] == 1) { ?>
				<a href="/forum-profile/<?php print str_replace(" ", "-", $user_detail->name); ?>"><u>Forum Profile</u></a>, 
				<a href="/messages/new/<?php print $uid; ?>?destination=user/<?php print $uid; ?>"> <u>Private Message</u></a>
			<?php } else { ?>
				<a href="/forum-profile/<?php print str_replace(" ", "-", $user_detail->name); ?>"><u>Forum Profile</u></a>
			<?php } ?>
		</p>
		<?php if(isset($user_detail->field_music['und'])) {?>
		<div class="content-block audio-player-left-container">
			<h2><img src="/font/Music+by+<?php print $user_detail->name; ?>/12/" alt="Music by <?php print $user_detail->name; ?>"></h2>
			<table cellspacing="0" border="1" width="250px">
				<tbody>
					<tr>
						<td bgcolor="#000000">
							<div id="wimpyTarget">
								<embed type="application/x-shockwave-flash" src="/sites/all/modules/custom/gmc_user_signup/flash/wimpy.swf" width="200" height="15" style="undefined" id="wimpy" name="wimpy" bgcolor="#000000" quality="high" scale="noscale" salign="lt" allowscriptaccess="always" allowfullscreen="true" menu="false" flashvars="wimpyReg=NyUzQVpseUwlMjRfJTdEJTgwUGJiUWxlJTQwJTI5WSU4NTFMcVklN0NXWUtDQjQlM0Itd3BLS3MlM0I4&amp;wimpyApp=wimpy.php&amp;wimpySkin=/sites/all/modules/custom/gmc_user_signup/flash/skin_simple_bar.xml">
							</div>
						</td>
					</tr>
					<?php
						foreach($user_detail->field_music['und'] as $music) {
							$file_url = file_create_url($music['uri']);
							$file_name = substr($music['filename'], 0, -4); ?>
							<tr>
								<td>
									<div id="ibackings" class="wimpy_list">
										&nbsp;&nbsp;<a onclick="wimpy_clearPlaylist();wimpy_loadAndPlay('<?php print $file_url; ?>', '', '<?php print $file_name; ?>', '', '');" href="javascript:nothing();"><?php print $file_name; ?></a>
									</div>
								</td>
							</tr>
							<script type="text/javascript">
								(function(){
									if( typeof(wimpy_loadAndPlay_once) != 'function' ){
										setTimeout( arguments.callee, 222 );
										return ;
									}
									wimpy_loadAndPlay_once('<?php print $file_url; ?>', '', '<?php print $file_name; ?>', '', ''); 
								})(); 
							</script>
					
					<?php	}
					?>
				</tbody>
			</table>
		</div>
		<?php } ?>
		<var></var>
	</div>
	<div class="content-block empty">
		<h2 class="total_lesson_views_counter">
			<img src="/font/<?php print $user_detail->name; ?>%27s+lessons+<?php print $total_count; ?>+views%29/12/" alt="<?php print $user_detail->name; ?>'s lessons (<?php print $total_count; ?> views)">
		</h2>
	</div>
	<div class="content-block" style="padding-bottom:0px;">
		<div class="top"></div>
		<ul class="tabs">
			<li class="current">All</li>
			<li>By Level</li>
			<li>Coolest</li>
		</ul>
		<div class="instructor_lessons_all tab-content show">
			<?php print views_embed_view('instructor_lessons','block', $uid); ?>
		</div>
		<div class="instructor_lessons_level tab-content">
			<?php print views_embed_view('instructor_lessons','block_1', $uid); ?>
		</div>
		<div class="instructor_lessons_coolest tab-content">
			<?php print views_embed_view('instructor_lessons','block_2', $uid); ?>
		</div>
		<span name="testing">
			<var></var>
		</span>
	</div>
</div>
<!--********************************-->
