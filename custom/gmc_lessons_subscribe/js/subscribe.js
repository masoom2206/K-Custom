/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

jQuery(document).ready(function() {
	/*Js code for subscribe instructor lessons.*/
	jQuery('.instructor-subscribe-button').live('click', function() {
		var ins_uid = jQuery(this).attr("instructor-uid");
		var ins_name = jQuery(this).attr("instructor-name");
		var log_uid = jQuery(this).attr("login-user-uid");
		var log_email = jQuery(this).attr("login-user-email");
		if(log_email.length < 1){
			log_email = prompt('Please enter your email');
			if(log_email.length < 1){
				return false;
			}
			if(!isValidEmailAddress(log_email)){
				alert('Invalid email');
				return false;
			}
		}
		jQuery.post('/subscribe/lessons', {"ins_uid":ins_uid, "ins_name":ins_name, "log_uid":log_uid, "log_email":log_email}, function(response) {
			if(response){
				alert(response);
			}
			else{
				alert('Unable to subscribe at this time. Please try again later.');
			}
		});
	});
	jQuery('.scroll-top').click(function() {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});
	jQuery('.forum_topic_link').click(function() {
		var myroot = location.protocol +"//"+ location.host + '/';
		var url = myroot + jQuery(this).attr('href');
		prompt('Manually copy the direct link to this post below to store the link in your computer\'s clipboard', url);
		return false;
	});
	//Create array of selected quote id
	var QuoteID = new Array();
	jQuery("[id^='quote-button-']").click(function(e) {
		e.preventDefault();
		var ID = jQuery(this).attr('dataid');
		var img = jQuery(this).find('img').attr('src');
		if(img == '/sites/all/themes/gmc_v2/images/p_mq_add.gif') {
			QuoteID.push(ID);
			jQuery(this).find('img').attr('src', '/sites/all/themes/gmc_v2/images/p_mq_remove.gif');
		}
		else {
			QuoteID.splice(jQuery.inArray(ID, QuoteID), 1 );
			jQuery(this).find('img').attr('src', '/sites/all/themes/gmc_v2/images/p_mq_add.gif');
		}
	});
	//Set session of selected quote id
	jQuery(".add-forum-topic-reply").click(function() {
		var nid = jQuery(".forum-topic-id").text();
		jQuery.post("/quote/message-ids", {"QuoteID":QuoteID, "nid":nid}, function(response) {
			if(response) {
				var myroot = location.protocol +"//"+ location.host + '/';
				window.location = myroot + 'comment/reply/' + nid + '?destination=guitar_forum_topic/' + nid;
			}
		});
	});
	
});
/**
 * Callback function for validate email address;
 */
function isValidEmailAddress(emailAddress){
	var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
}