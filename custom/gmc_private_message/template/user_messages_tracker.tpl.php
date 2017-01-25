<?php
	$folder_name = str_replace("-", " ", arg(2));
	$today_date = date('jS F Y - H:i A');
?>
<div id="ucpcontent">
	<div class="maintitle">Welcome to your messenger</div>
	<div class="formsubtitle">Read Messages</div>
	<p>The messages shown here have been read by the person they were sent to.</p>
	<?php $form1 = drupal_get_form('user_messages_read_tracker_list'); print drupal_render($form1);?>
	<br>
	<div class="formsubtitle">Unread Messages<div id="gfooter_time">Time is now: <?php print $today_date; ?></div></div>
	<p>The messages shown here have not been read by the person they were sent to. You may delete them before they are read.</p>
	<?php $form2 = drupal_get_form('user_messages_unread_tracker_list'); print drupal_render($form2);?>
</div>