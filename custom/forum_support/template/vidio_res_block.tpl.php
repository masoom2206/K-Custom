<?php 
global $base_url;
$html = '';
foreach($nids as $key => $node) {
	//$r = node_load($node->rid);
	$n = node_load($node->nid);
	$u = user_load($node->uid);
	if ($key == 0) {
		$width = 500;
		$height = 284;
		$instructor_link = l($n->name, 'users/'.str_replace(" ", "-", $n->name));
		$lesson_link = l($n->title, 'node/'.$n->nid);
		$forum_profile = l($u->name, 'forum-profile/'.str_replace(" ", "-", $u->name));
		$html .= '<li class="video-responses"><h1 nname="'.$n->name.'" ntitle="'.$n->title.'" uname="'.$u->name.'">This is a video response to '.$instructor_link.' lesson "'.$lesson_link.'"<br>by '.$forum_profile.'</h1>';
		
		$html .= '<div id="res-youtube-video-id"><p id="res-youtube-video" value="'.$node->fid.'"><iframe frameborder="0" height="'.$height.'" width="'.$width.'" src="http://youtube.com/embed/'.$node->fid.'?autoplay=0" type="text/html"></iframe></p></div></li>';
		
		//$html .= '<div id="res-youtube-video-id"><object id="res-youtube-video" width="'.$width.'" height="'.$height.'" value="'.$node->fid.'"><param name="movie" value="http://www.youtube.com/v/'.$node->fid.'&amp;hl=en&amp;fs=1"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><embed src="http://www.youtube.com/v/'.$node->fid.'&amp;hl=en&amp;fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'.$width.'" height="'.$height.'"></object></div></li>';
	}
	else {
		$width = 150;
		$height = 120;
		if(strlen($n->title) > 20) {
			$ntitle = substr($n->title, 0, 20).'...';
		}
		else {
			$ntitle = $n->title;
		}
		$lesson_link = l($ntitle, 'node/'.$n->nid);
		$forum_profile = l($u->name, 'forum-profile/'.str_replace(" ", "-", $u->name));

		$html .= '<li class="video-responses video-responses-image"><h1 nname="'.$n->name.'" ntitle="'.$n->title.'" uname="'.$u->name.'">'.$lesson_link.'<br> by '.$forum_profile.'</h1>';
		$html .= '<div class="youtube-play-button"><img src="/sites/all/themes/gmc_v2/images/youtube-play.png" width="30" height="30"></div>';
		$html .= '<div class="res-youtube-image"><img src="http://i3.ytimg.com/vi/'.$node->fid.'/hqdefault.jpg" width="'.$width.'" height="'.$height.'" value="'.$node->fid.'"></div></li>';
		
		//$html .= '<object width="'.$width.'" height="'.$height.'"><param name="movie" value="http://www.youtube.com/v/'.$node->fid.'&amp;hl=en&amp;fs=1"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><embed src="http://www.youtube.com/v/'.$node->fid.'&amp;hl=en&amp;fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'.$width.'" height="'.$height.'"></object>';
	}
} 
print '<div class="content-block">
		<h1 class="startpage_welcome_text">
			<img src="'.$base_url.'/font/Student Videos/12">
		</h1>
			<div class="top"></div><ul>'.$html.'</ul>
			<div align="right" class="more-student-videos">'.l(">> more", "student-videos").'</div>
			<var></var>
		</div>';
