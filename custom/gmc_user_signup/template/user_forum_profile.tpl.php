<?php
  global $base_url,$user;
  $path = $base_url.'/sites/all/themes/gmc_v2/images/';
  if(is_numeric(arg(1))) {
	  $uid = arg(1);
  }
  else {
	  $name = str_replace("-", " ", arg(1));
	  $uid = get_user_id($name);
  }
  $user_detail = user_load($uid);
  //print "<pre>";print_r($user_detail);exit;

  /******* User Role *******/
  $roles = '';
  if (array_key_exists(4, $user_detail->roles)) {
      $roles = 'Instructor';
  }
  else if(array_key_exists(5, $user_detail->roles)) {
	  $roles = 'Member';
  }
  /******* User Role *******/
  /******* Year Old *******/
  if(isset($user_detail->field_date['und']['0']['value'])) {
	  $diff_date = abs(strtotime($user_detail->field_date['und']['0']['value']) - time());
	  $year_old = floor($diff_date / (365*60*60*24));
  }
  /******* Year Old *******/
  $image = '';
  if(isset($user_detail->picture->uri)) {
	  $image = file_create_url($user_detail->picture->uri);
  }
  else {
	  $image = $base_url.'/sites/default/files/pictures/default-user-image.png';
  }
  if($image != ''){
	$size = getimagesize($image);
	$width = $size[0];
	$height = $size[1];
	if($size[0] > 90) {
		$width = 90;
	}
	if($size[1] > 90) {
		$height = 90;
	}
	$user_image = '<img src="'.$image.'" border="0" width="'.$width.'" height="'.$height.'" alt="" style="max-width: none;">';
  }
  $name = '';
  if(isset($user_detail->field_first_name['und'][0]['value'])) {
	if(isset($user_detail->field_last_name['und'][0]['value'])) {
		$name = $user_detail->field_first_name['und'][0]['value'].' '.$user_detail->field_last_name['und'][0]['value'];
	}
	else {
		$name = $user_detail->field_first_name['und'][0]['value'];
	}
  }
  if (empty($name)) {
	  $name = $user_detail->name;
  }
  /*******RelationShip*******/
  $requester_id = $uid;
  $requestee_id = $user->uid;
  $friend_link = '';
  $relationships = user_relationships_load(array('between' => array($requester_id, $requestee_id)));
  if (empty($relationships)) {
	  $friend_link = l(t('Add as Friend') , "relationship/$uid/request/1", array('html' => TRUE, 'absolute' => TRUE, 'query' => array('destination' => 'forum-profile/' . $uid), 'attributes' => array('class' => array('ur-link add-friend-btn user_relationships_popup_link'))));
  }
  else {
	  foreach ($relationships as $relationship) {
		  if ($relationship->approved == 1 && user_relationships_ui_check_access('view', NULL, $relationship)) {
			  $friend_rid = $relationship->rid;
			  $friend_link = l(t('Remove Friend') , "/user/" . $user->uid . "/relationships/" . $friend_rid . "/remove", array('html' => TRUE, 'absolute' => TRUE, 'query' => array('destination' => 'forum-profile/' . $uid), 'attributes' => array('class' => array('ur-link add-friend-btn user_relationships_popup_link'))));
		  }
	  }
  }
/*******RelationShip*******/
/******User Last Seen******/
$last_seen = '';
$date = date('d/m/Y', $user_detail->access);
if($date == date('d/m/Y')) {
	$last_seen = 'Today, '.date("H:i A");
}
else if($date == date('d/m/Y',time() - (24 * 60 * 60))) {
	$last_seen = 'Yesterday, '.date("H:i A");
}
else {
	$last_seen = date("dS F Y - H:i A");
}
/******User Last Seen******/
//print "<pre>";print_r($relationships);exit;
?>
<table id="forum-profile-table" cellspacing="4" cellpadding="0" width="100%" border="0">
<tbody><tr>
	<!--First TD-->
	<td style="width:210px" valign="top">
		<div class="borderwrap" style="padding:1px">
			<div class="pp-title">Profile</div>
			<!--<div class="pp-header">Personal Photo</div>-->
			<table cellpadding="1" cellspacing="0" width="100%">
			<tbody><tr>
				<td width="60%" class="row1" style="padding:3px;margin-bottom:0px" valign="middle" align="center">
					<!--<img id="pp-main-photo" src="<?php //print $user_image; ?>" width="150" height="150" alt="">-->
					<?php if($user->uid >= 1) {?>
					<div style="margin-top:10px;margin-bottom:6px">
						<!--<div id="pp-friend-wrap">
							<img src="<?php //print $path; ?>friend_add_small.png" id="pp-friend-img" alt="" border="0">
							<a href="#" id="pp-friend-text"><?php //print $friend_link; ?></a>
						</div>-->
							<img src="<?php print $path; ?>send_pm_small.png" alt="" border="0">
							<a href="/messages/new/<?php print $uid; ?>?destination=forum-profile/<?php print $uid; ?>">Send Message</a>
					</div>
					<?php } ?>
				</td>
			</tr>
			</tbody></table>
			<div class="pp-header" style=" clear: both; ">Options</div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px; text-align: center">
				<div class="popmenubutton-new" id="profile-options" style="cursor: pointer;">Options</div>
				<div class="popupmenu-options" id="profile-options_menu" style="display: none; z-index: 100; position: absolute;">
					<?php if($user->uid != 0) {?>
						<div class="popupmenu-item">
							<img src="<?php print $path; ?>profile_item.gif" border="0"> <a href="/messages/blocked?uid=<?php print $uid; ?>" id="saf-link-profile-options2">Add to PM Block List</a>
						</div>
					<?php } ?>
					<div class="popupmenu-item">
						<img src="<?php print $path; ?>profile_item.gif" border="0"> <a href="/forum-posts/<?php print $uid; ?>" id="saf-link-profile-options3">Find member's posts</a>
					</div>
					<div class="popupmenu-item-last">
						<img src="<?php print $path; ?>profile_item.gif" border="0"> <a href="/user-forum-topic/<?php print $uid; ?>">Find member's topics</a>
					</div>
				</div>
			</div>
			<?php if (isset($user_detail->field_personal_statement['und']['0']['value']) && strip_tags($user_detail->field_personal_statement['und']['0']['value']) != '') {?>
				<div class="pp-header">Personal Statement</div>
				<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px" id="pp-personal_statement">
					<?php print strip_tags($user_detail->field_personal_statement['und']['0']['value'], '<br/><br>'); ?>
					<?php /*if (isset($user_detail->field_your_website_url['und']['0']['value'])) {?>
					<div style="padding-top:5px">
						<a href="<?php print $user_detail->field_your_website_url['und']['0']['value']; ?>" target="_blank">Visit My Website</a>
					</div>
					<?php } */?>
				</div>
			<?php } ?>
			<div class="pp-header">Personal Info</div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px"><?php print $name; ?></div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px"><?php print $roles; ?></div>
			<!--<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px" id="pp-entry-age-wrap">
				 <span id="pp-entry-age-text"><?php //print $year_old; ?></span> <span id="pp-entry-age-yearsold">years old</span>
			</div>-->
			<div class="row2" style="padding:6px; margin-bottom:1px; padding-left:10px">
				<div id="pp-entry-gender-wrap">
					<span id="pp-entry-gender-imgwrap">
						<img src="<?php print $path; ?>gender_male.png" id="pp-entry-gender-img-2" style="vertical-align:top" alt="" border="0">
					</span>
					<span id="pp-entry-gender-text"><?php print isset($user_detail->field_gender['und']['0']['value']) ? $user_detail->field_gender['und']['0']['value'] : ''; ?></span>
				</div>
			</div>
			<div class="row2" style="padding:6px; margin-bottom:1px; padding-left:10px">
				<div id="pp-entry-location-wrap">
						<span id="pp-entry-location-text"><?php print isset($user_detail->field_address['und']['0']['value']) ? $user_detail->field_address['und']['0']['value'] : ''; ?></span>
				</div>
			</div>
			<!--<div class="row1" style="padding:6px; margin-bottom:0px; padding-left:10px">
				<div id="pp-entry-born-wrap">
					<span id="pp-entry-born-pretext">Born</span> <span id="pp-entry-born-text"><?php //print date("M-d-Y", strtotime($user_detail->field_date['und']['0']['value'])); ?></span>
				</div>
			</div>-->
			<?php if (isset($user_detail->field_your_interests['und']['0']['value']) && trim($user_detail->field_your_interests['und']['0']['value']) != '') { ?>
				<div class="pp-header">Interests</div>
				<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px; word-break: break-word;" id="pp-personal_statement">
					<?php print $user_detail->field_your_interests['und']['0']['value']; ?>
				</div>
			<?php } ?>
			<!--<div class="pp-header">Other Information</div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px"><?php //print $user_detail->field_currently_practicing['und']['0']['value']; ?></div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px">Paypal Email address: <?php //print $user_detail->field_paypal_email_address['und']['0']['value']; ?></div>-->
			<div class="pp-header">Statistics</div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px">Joined: <?php print date("d-F-y", $user_detail->created); ?></div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px">Profile Views: <?php /*function call from gmc_forum_count.module file*/ print gmc_user_view_count($user_detail->uid);?><span class="pp-tiny-text">*</span></div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px">
				Last Seen: <?php print $last_seen;?>
				<!--<br><a href="/forum">Viewing Board Index</a>-->
			</div>
			<div class="row2" style="padding:6px; margin-bottom:1px; padding-left:10px">Local Time: <?php print date("M d Y H:i A"); ?></div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px"><?php print gmc_user_post_count($uid); ?></div>
			<div class="pp-header">Contact Information</div>
			<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px">
				<div class="row1" style="padding:6px; margin-bottom:1px; padding-left:10px">
					<img style="float: left;padding: 0 5px;" src="<?php print $path; ?>icon_msg_nonew.gif" border="0" alt="Contact"> <a href="/messages/new/<?php print $uid; ?>?destination=forum-profile/<?php print $uid; ?>">Send Message</a>
				</div>
				<!--<div class="row1" style="padding:6px; padding-left:10px">
					<img style="float: left;padding: 0 5px;" src="<?php //print $path; ?>icon_msg_nonew.gif" border="0" alt="Contact"> <i>Private</i>
				</div>-->
			</div>
			<div class="pp-tiny-text">* Profile views updated each hour</div>
			<img src="<?php print $path; ?>blank.gif" width="210" height="1" alt="" style=" height: 1px; ">
		</div>
	</td>

<!--******************************************-->	

	<!--Second TD-->
	<td valign="top">
		<div class="pp-name">
			<table cellpadding="0" cellspacing="0" width="100%">
			<tbody><tr>
				<td width="2%"><?php print $user_image; ?></td>
				<td width="98%" style="padding-left:10px">
					<h3 style="font-size:20px;font-weight: normal;"><?php print $name; ?></h3>
					<?php
						if(in_array('instructor', $user_detail->roles)) {
					?>
					<span style="color:red">GMC Instructor</span>
					<p><img src="<?php print $path; ?>staff2.jpg" alt=""></p>
					<?php
						} else {
					?>
						<strong style="font-style: normal; font-weight: normal;">Members</strong>
						<p><img src="<?php print $path; ?>pip.gif" border="0" alt="*"></p>
					<?php } ?>
				</td>
			</tr>
			</tbody></table>
		</div>		
		<br>		
		<div class="pp-tabwrap">
			<div class="pp-tabon" id="pp-content-tab-topics" style="cursor: pointer; display: block;">Topics</div>
			<div class="pp-taboff" id="pp-content-tab-posts" style="cursor: pointer; display: block;">Posts</div>
			<!--<div class="pp-taboff" id="pp-content-tab-gallery" style="cursor: pointer; display: block;">Gallery</div>
			<div class="pp-taboff" id="pp-content-tab-blog" style="cursor: pointer; display: block;">Practice Agenda</div> -->
			<div class="pp-taboff" id="pp-content-tab-comments" style="cursor: pointer; display: block;">Comments</div>
			<!--<div class="pp-taboff" id="pp-content-tab-friends" style="cursor: pointer; display: block;">Friends</div>
			<div class="pp-taboff" id="pp-content-tab-settings" style="cursor: pointer; display: block;">Settings</div>-->
		</div>
		<div class="pp-tabclear">My Content</div>
		<div class="borderwrap">
			<div id="pp-main-tab-topics" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px;">
				<?php print gmc_user_panel_topics($uid); ?>
			</div>
			<div id="pp-main-tab-posts" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px; display:none;">
				<?php print gmc_user_panel_posts($uid); ?>
			</div>
			<div id="pp-main-tab-gallery" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px; display:none;">
				<table cellspacing="1" class="ipbtable"><tbody><tr>
					<td align="center">
						<h3>No images were found</h3>
					</td>
				</tr></tbody></table>
			</div>
			<div id="pp-main-tab-blog" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px; display:none;">
				"Blog Comming..."
			</div>
			<div id="pp-main-tab-comments" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px; display:none;">
				<?php print gmc_user_panel_comment_box($uid); ?>
			</div>
			<!--<div id="pp-main-tab-friends" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px; display:none;">
				<?php //print gmc_user_friend_list('center'); ?>
			</div>-->
			<!--<div id="pp-main-tab-settings" class="pp-contentbox-back" style="height: auto; padding: 6px; margin: 0px; display:none;">
				"Settings Comming..."
			</div>-->
			
		</div>
		<!-- / My Stuff -->
		
	<!-- / MAIN TABLE -->
	</td>
	
	<td style="width:210px;" valign="top">
		<div class="borderwrap" style="padding:1px">
			<div class="pp-title">Last Visitors</div>
			<?php print gmc_user_panel_visitors($uid); ?>
		</div>
		<br>
		<div class="borderwrap" style="padding:1px">
			<div class="pp-title">Comments</div>
			<?php
			  $block = module_invoke('user_comment', 'block_view', 'user_comment');
			  print $block['content'];
			?>
		</div>
		<br>
		<!--<div class="borderwrap" style="padding:1px">
			<div class="pp-title">Friends</div>
			<?php //print gmc_user_friend_list('right'); ?>
			<div class="pp-mini-content-entry-noheight" style="text-align:right">
				<a href="#" onclick="ips_personal_portal.tab_load( 'friends' )">View All Friends</a>
			</div>
		</div>-->
		<img src="<?php print $path; ?>blank.gif" width="210" height="1" alt="" style=" height: 1px; ">
	</td>
</tr>
</tbody></table>
