<?
include_once ('mobile_device_detect.php');
$sitepath = "http://".$_SERVER['HTTP_HOST'];
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
		<title></title>
		<script type="text/javascript" src="javascripts/swfobject.js"></script>
		<script src="javascripts/flash_detect.js" type="text/javascript"></script>
		<link rel="stylesheet" href="html5/video-js.css" type="text/css" media="screen" title="Video JS"/>
	<script src="html5/video.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript">
    // Must come after the video.js library

    // Add VideoJS to all video tags on the page when the DOM is ready
    VideoJS.setupAllWhenReady();

  </script>
	</head>
	<body style="padding:0px;margin:0px;">
		<?
	$mobile=mobile_device_detect();
if($mobile)
{
	?>
	<p>DDDDDD</p>
	 <div class="video-js-box">
    <!-- Using the Video for Everybody Embed Code http://camendesign.com/code/video_for_everybody -->
    <video id="example_video_1" class="video-js" width="590" height="442" controls="controls" preload="auto" poster="logo/30alogo.png">
      <!--<source src="videos/catwalk1b_x264.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />-->
	  <source src="http://admin.prod.gmc.my/sites/default/files/lick_of_the_day/mp4/Chord%20Substitution.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
	

    </video>
  </div>
  <?
}else
{?>
	<p>asdasdasD</p>
	 <div class="video-js-box">
    <!-- Using the Video for Everybody Embed Code http://camendesign.com/code/video_for_everybody -->
    <video id="example_video_1" class="video-js" width="590" height="442" controls="controls" preload="auto" poster="logo/30alogo.png">
      <source src="videos/catwalk1b_x264.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
	  <!--<source src="http://admin.prod.gmc.my/sites/default/files/lick_of_the_day/mp4/Chord%20Substitution.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />-->
	

    </video>
  </div>
	<!--<div class="lotd-wrap">
		<div class="lotd-border top"></div>
		<div class="lotd-border left"></div>
		<div class="lotd-border right"></div>
		<div id="videoPlayer" class="{lotd: 'true', lessonId: 46835}">
		<object name="videoPlayerName" id="videoPlayerId" width="680" height="463" allowscriptaccess="always" style="vertical-align:text-top;" type="application/x-shockwave-flash" data="/flashvideoplayer/videoPlayer4.swf">
			<param name="bgcolor" value="#000000">
			<param name="allowFullscreen" value="true">
			<param name="wmode" value="opaque">
			<param name="flashvars" id="flashvars" value="xml=../lick/ofthe/day/46835/230357/xml">
			<param name="allowscriptaccess" value="always">
			<param name="allownetworking" value="all">
		</object>
		</div>
	</div>-->
		<!--<div name="flashcontent2" id="flashcontent2"></div>
   		<script type="text/javascript" language="javascript">		
			if(!FlashDetect.installed){
				document.getElementById("flashcontent2").innerHTML = "<b>This content requires the Adobe Flash Player. If the player does not load here in a moment please install flash. <a href=http://www.adobe.com/go/getflash/>GET FLASH HERE</a></b>";    	
			} else{
				    // Flash embed code starts 
						//delete the below sample
						var so1 = new SWFObject("YTPlayer.swf", "YTPlayer", "640", "320", "8",  null, true);
		so1.addParam("allowFullScreen", "true");
		so1.addParam("allowSciptAccess", "always");
        so1.addVariable("movieName", "videos/catwalk1b_x264.mp4");
        so1.addVariable("autoStart", "false");
		so1.addVariable("logoPath", "logo/30alogo.png"); // 60*60 dimension
		so1.addVariable("logoPosition", "top_left"); // accepted values are top_left, top_right, bottom_left and bottom_right
		so1.addVariable("logoClickURL", "http://www.flvhosting.com/af/idevaffiliate.php?id=385");
		so1.write("flashcontent2");
				// Flash Embed code ends
			}
   		</script>-->
	<?}?>
	</body>
</html>
