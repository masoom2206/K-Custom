<!-- members_Only_lessons_videos = file_url" -->
<?php
	$extention = substr($file_url, -3);
?>
<?php
if($extention == 'swf') {
?>
	<p align="center">&nbsp;</p>
	<p align="center">
		<span class="huvudtext">
			<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="640" height="480">
				<param name="movie" value="<?php print $file_url; ?>">
				<param name="quality" value="high">
				<embed src="<?php print $file_url; ?>" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="640" height="480"></embed>
			</object>
		</span>
	</p>
	<p>&nbsp; </p>
<?php
//} elseif($extention == 'flv' && $file_url == 'http://admin.prod.gmc.my/sites/default/files/admin_lessons_videos/20051210-w50s_56K.flv') {
?>
<?php } else { ?>
<!--<script type="text/javascript" src="/sites/all/modules/custom/gmc_admin_keyword/jwplayer/jwplayer.js"></script>-->
<!--<script type="text/javascript">jwplayer.key="ZP0tyNQAQNQhO1GaSc2n9vZDoX900M+TX10b8A==";</script>-->
<!--<script src="http://jwpsrv.com/library/uZfc7LynEeO74CIACi0I_Q.js"></script>-->
<p align="center">&nbsp;</p>
<p align="center">
	<span id="myElement">Loading the player...</span>
</p>
<p>&nbsp; </p>
<script type="text/javascript">
    jwplayer("myElement").setup({
        file: "<?php print $file_url; ?>",
		title: "GMC members only video",
		width: "640",
		height: "480",
		autostart: true,
		primary: "flash",
		skin: "/sites/all/modules/custom/gmc_admin_keyword/jwplayer/jwplayer-skins/five.xml"
        //image: "/uploads/myPoster.jpg"
    });
	jwplayer().onVolume( function(event){
		alert('the volume is now: ' + event.volume);
	});
</script>
<?php } ?>
<?php /*} else { ?>
	<p align="center">&nbsp;</p>
	<p align="center">
		<span class="huvudtext">
			<object width="640" height="480" name="player" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" class="instructor-video" id="player">
				<param value="/sites/all/modules/custom/gmc_user_signup/swf/videoPlayer.swf" name="movie">
				<param value="true" name="allowfullscreen">
				<param value="always" name="allowscriptaccess">
				<param name="wmode" value="transparent">
				<param value="file=<?php print $file_url; ?>&amp;controlbar=over&amp;autostart=true&amp;bufferlength=0" name="flashvars">
				
				<embed width="640" height="480" flashvars="file=<?php print $file_url; ?>&amp;controlbar=over&amp;autostart=true&amp;bufferlength=0" allowfullscreen="true" allowscriptaccess="always" wmode="transparent" src="/sites/all/modules/custom/gmc_user_signup/swf/videoPlayer.swf" name="player2" id="player2" type="application/x-shockwave-flash">
			</object>
		</span>
	</p>
	<p>&nbsp; </p>
<?php }*/ ?>
