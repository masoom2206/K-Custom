<div id="ucpcontent">
	<div class="maintitle">Welcome to your messenger</div>
	<div class="formsubtitle">Current Virtual Directories</div>
	<p>You may edit the names, or delete the name to delete this virtual directory. Please note, you will be unable to remove a directory if it contains messages.<br><strong>Alpha-numerics and spaces only, please.</strong></p>
	<?php $form = drupal_get_form('gmc_user_storage'); print drupal_render($form);?>
</div>

<!--

		<p><input type="text" name="in" value="Inbox">&nbsp;&nbsp;( Inbox - Cannot Remove )</p>
		<p><input type="text" name="sent" value="Sent Items">&nbsp;&nbsp;( Sent Items - Cannot Remove )</p>
		<p><input type="text" name="dir_2" value="Mas">&nbsp;&nbsp;( Mas - Cannot Remove )<input type="hidden" name="noremove[dir_2]" value="1"></p>
		<div class="formsubtitle">Add New Virtual Directories</div>
		<p>You may add extra directories. You do not have to use all the input boxes.</p>
		<p><input type="text" name="dir_4" value=""></p>
		<p><input type="text" name="dir_5" value=""></p>
		<p><input type="text" name="dir_6" value=""></p>
		<div class="formsubtitle" align="center">
			<input class="button" type="submit" value="Submit Changes">
			<div id="gfooter_time">Time is now: 16th September 2013 - 07:30 AM</div>
		</div>

-->