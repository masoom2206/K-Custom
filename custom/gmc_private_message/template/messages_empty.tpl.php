<div id="ucpcontent">
	<div class="maintitle">Welcome to your messenger</div>
	<div class="formsubtitle">Empty PM Folders</div>
	<p>You may remove your stored personal messages - simply choose which folders you wish to empty and click on the continue button.<br>Note: There is no undo - please double check before continuing.</p>
	<div class="borderwrapm">
		<?php $form = drupal_get_form('empty_folder_mail'); print drupal_render($form);?>
	</div>
</div>