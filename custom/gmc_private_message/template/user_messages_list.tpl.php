<?php
	$folder_name = str_replace("-", " ", arg(2));
	$today_date = date('jS F Y - H:i A');
?>
<div id="ucpcontent">
	<div class="maintitle">Welcome to your messenger</div>
	<div class="formsubtitle"><? print $folder_name; ?><div id="gfooter_time">Time is now: <?php print $today_date; ?></div></div>
	<?php $form = drupal_get_form('user_messages_folder_list'); print drupal_render($form);?>
</div>