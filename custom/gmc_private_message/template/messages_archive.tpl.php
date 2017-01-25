<!-- saved from url=(0022)http://internet.e-mail -->
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<title>Private Message Archive</title>
	<style type="text/css">
		html{
			overflow-x: auto;
		}
		
		body{
			background-color: #fff;
			color: #000;
			font-family: Verdana, Tahoma, Arial, sans-serif;
			font-size: 11px;
			margin:0px;
			padding:0px;
			text-align:center;
		   }
		   
		a:link, a:visited, a:active{
			color: #000;
			text-decoration: underline;
		}
		
		a:hover{
			color: #465584;
			text-decoration:underline;
		}
		
		img{
			border: 0;
			vertical-align: middle;
		}
				
		#ipbwrapper{
			margin: 0 auto 0 auto;
			text-align: left;
			width: 95%;
		}
		
		.post1{
			background-color: #F5F9FD;
		}
		
		.post2{
			background-color: #EEF2F7;
		}
	
		/* Common elements */
		.row1{
			background-color: #F5F9FD;
		}
		
		.row1{
			background-color: #DFE6EF;
		}
		
		.row3{
			background-color: #EEF2F7;
		}
		
		.row2{
			background-color: #E4EAF2;
		}
	
		/* tableborders gives the white column / row lines effect */
		.plainborder{
			background-color: #F5F9FD
			border: 1px solid #345487;
		}
		
		.tableborder{
			background-color: #FFF;
			border: 1px solid #345487;
			margin: 0;
			padding: 0;
		}
		
		.tablefill{
			background-color: #F5F9FD;
			border: 1px solid #345487;
			padding: 6px;
		}
		
		.tablepad{
			background-color: #F5F9FD;
			padding:6px;
		}
		
		.tablebasic{
			border: 0;
			margin: 0;
			padding: 0;
			width:100%;
		}
	
		.pformstrip{
			background-color: #D1DCEB;
			color: #3A4F6C;
			font-weight: bold;
			margin-top:1px
			padding:7px;
		}
		
		#QUOTE{
			background-color: #FAFCFE;
			border: 1px solid #000;
			color: #465584;
			font-family: Verdana, Arial;
			font-size: 11px;
			padding: 2px;
		}
		
		#CODE{
			background-color: #FAFCFE;
			border: 1px solid #000;
			color: #465584;
			font-family: Courier, Courier New, Verdana, Arial;
			font-size: 11px;
			padding: 2px;
		}
		/* Main table top (dark blue gradient by default) */
		.maintitle{
			background-color: #D1DCEB;
			background-image: url(http://www.guitarmasterclass.net/guitar_forum/style_images/23redcryst/tile_back.gif);
			color: #FFF;
			font-weight: bold;
			padding:8px 0px 8px 5px;
			vertical-align:middle;
		}
		
		.maintitle a:link, .maintitle  a:visited, .maintitle  a:active{
			color: #fff;
			text-decoration: none;
		}
		
		.maintitle a:hover{
			text-decoration: underline;
		}
		
		/* Topic View elements */
		.signature{
			color: #339;
			font-size: 10px;
			line-height:150%;
		}
		
		.postdetails{
			font-size: 10px;
		}
		
		.postcolor{
			font-size: 12px;
			line-height: 160%;
		}
	</style>
</head>
<body>
	<div id="ipbwrapper">
		<?php
		foreach($messages as $message) {
			$user_detail = user_load($message->author);
			$date = date('d/m/Y', $message->timestamp);
			if($date == date('d/m/Y')) {
				$post_date = 'Today, ' . date('H:i A', $message->timestamp);
			} else if($date == date('d/m/Y',time() - (24 * 60 * 60))) {
				$post_date = 'Yesterday, ' . date('H:i A', $message->timestamp);
			}
			else {
				$post_date = date('M d Y, H:i A', $message->timestamp);
			}
		?>
		<div class="borderwrapm">
			<div class="maintitle"><?php print $message->subject; ?></div>
			<div class="tablefill">
				<div class="postcolor"><?php print $message->body; ?></div>
			</div>
			<div class="formsubtitle">Sent by <b><?php print $user_detail->name; ?></b> on <?php print $post_date; ?></div>
		</div><br />
		<?php
		}
		?>
	</div>
</body>
</html>