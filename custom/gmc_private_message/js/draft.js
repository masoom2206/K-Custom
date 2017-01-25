/**
 * @file
 * A JavaScript file for gmc private message draft module.
 *
 */
jQuery(document).ready(function() {
	var dateVar = new Date()
	var offset = dateVar.getTimezoneOffset();
	document.cookie = "offset="+offset;
	jQuery("#delete-drafts #select-all").click(function() {
		if(jQuery(this).is(":checked")) {
			jQuery(".check_draft").attr("checked","checked");
		}
		else {
			jQuery(".check_draft").removeAttr('checked');
		}
	});
	jQuery("#edit-friend-list").change(function() {
		var recipient = jQuery(this).val();
		if(recipient != 'other' && recipient != 'dash') {
			jQuery("#edit-recipient").val(recipient);
		}		
	});
	jQuery(".field-name-field-download-files .field-items").click(function() {
		var Dcount = parseInt(jQuery(this).parent().next().children().children().text());
		jQuery(this).parent().next().children().children().text(Dcount + 1);
	});
});
