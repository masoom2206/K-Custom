/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
jQuery(document).ready(function() {
/**Code for Signup page Start**/
	jQuery('.tabs li').hover(function() {
		jQuery(this).animate({top:'+=2px'},200);
	},function() {
		jQuery(this).animate({top:'-=2px'},200);
	}).click(function(event) {
		var _this = jQuery(this);
		_this.addClass('current');
		var siblings=_this.siblings();
		siblings.removeClass('current');
		var index = jQuery(this).prevAll().length;
		var container = jQuery(this).closest('.content-block');
		try{
			var es = container.find('.tab-content');
			jQuery.each(es,function(i,el){
				if(i == index)
					return;
				jQuery.each(jQuery(el).find('input'),function(i,input){
					jQuery(input).attr('disabled','disabled');
				});
				jQuery(el).hide();
			});
			var __this = jQuery(es.get(index));
			jQuery.each(__this.find('input'),function(i,input){
				jQuery(input).removeAttr('disabled','disabled');
			});
			__this.show();
		}
		catch(e){
			throw e;
		}
		var a = jQuery(this).find('a');
		if(a.length) {
			window.location = a.attr('href');
		}
	});
	//var referer = get_url_value('referer');
	var referer_num = Drupal.settings.referer_num;
	var uid = Drupal.settings.user_js_uid;
	var free_key = Drupal.settings.free_key;
	if(referer_num != 0 && uid == 0) {
		jQuery("#edit-subscriber-1").after("<strong>$10</strong> <span>then $15 for each month</span>");
		jQuery("#edit-subscriber-6").after("<strong>$10</strong> <span>then $70 for each 6 months (save $20)</span>");
		jQuery("#edit-subscriber-12").after("<strong>$10</strong> <span>then $110 for each 12 months (save $70)</span>");
	}
	else if (free_key != 0) {
		jQuery("#edit-subscriber-1").after("<strong>$0</strong> <span>then $15 for each month</span>");
		jQuery("#edit-subscriber-6").after("<strong>$0</strong> <span>then $70 for each 6 months (save $20)</span>");
		jQuery("#edit-subscriber-12").after("<strong>$0</strong> <span>then $110 for each 12 months (save $70)</span>");
	}
	else {
		jQuery("#edit-subscriber-1").after("<strong>$15</strong>");
		jQuery("#edit-subscriber-6").after("<strong>$70</strong><span>(save $20)</span>");
		jQuery("#edit-subscriber-12").after("<strong>$110</strong><span>(save $70)</span>");
	}
	jQuery("#edit-pay-once-12").after("<strong>$140</strong><span>(save $40)</span>");

	jQuery("[id^='edit-subscriber-']").attr('checked', false);
	jQuery("[id^='edit-pay-once-']").attr('checked', false);
	jQuery("#edit-subscriber-1").attr('checked', true);
	jQuery("[id^='edit-subscriber-']").click(function(){
		jQuery("[id^='edit-pay-once-']").attr('checked', false);
	});
	jQuery("[id^='edit-pay-once-']").click(function(){
		jQuery("[id^='edit-subscriber-']").attr('checked', false);
	});
	//show hide tab data ay user profile panel page
	jQuery("#pp-content-tab-topics").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").show();
		jQuery("#pp-main-tab-posts").hide();
		jQuery("#pp-main-tab-gallery").hide();
		jQuery("#pp-main-tab-blog").hide();
		jQuery("#pp-main-tab-comments").hide();
		jQuery("#pp-main-tab-friends").hide();
		jQuery("#pp-main-tab-settings").hide();
	});
	jQuery("#pp-content-tab-posts").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").hide();
		jQuery("#pp-main-tab-posts").show();
		jQuery("#pp-main-tab-gallery").hide();
		jQuery("#pp-main-tab-blog").hide();
		jQuery("#pp-main-tab-comments").hide();
		jQuery("#pp-main-tab-friends").hide();
		jQuery("#pp-main-tab-settings").hide();
	});
	jQuery("#pp-content-tab-gallery").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").hide();
		jQuery("#pp-main-tab-posts").hide();
		jQuery("#pp-main-tab-gallery").show();
		jQuery("#pp-main-tab-blog").hide();
		jQuery("#pp-main-tab-comments").hide();
		jQuery("#pp-main-tab-friends").hide();
		jQuery("#pp-main-tab-settings").hide();
	});
	jQuery("#pp-content-tab-blog").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").hide();
		jQuery("#pp-main-tab-posts").hide();
		jQuery("#pp-main-tab-gallery").hide();
		jQuery("#pp-main-tab-blog").show();
		jQuery("#pp-main-tab-comments").hide();
		jQuery("#pp-main-tab-friends").hide();
		jQuery("#pp-main-tab-settings").hide();
	});
	jQuery("#pp-content-tab-comments").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").hide();
		jQuery("#pp-main-tab-posts").hide();
		jQuery("#pp-main-tab-gallery").hide();
		jQuery("#pp-main-tab-blog").hide();
		jQuery("#pp-main-tab-comments").show();
		jQuery("#pp-main-tab-friends").hide();
		jQuery("#pp-main-tab-settings").hide();
	});
	jQuery("#pp-content-tab-friends").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").hide();
		jQuery("#pp-main-tab-posts").hide();
		jQuery("#pp-main-tab-gallery").hide();
		jQuery("#pp-main-tab-blog").hide();
		jQuery("#pp-main-tab-comments").hide();
		jQuery("#pp-main-tab-friends").show();
		jQuery("#pp-main-tab-settings").hide();
	});
	jQuery("#pp-content-tab-settings").click(function(){
		jQuery('.pp-tabwrap div').removeClass('pp-tabon');
		jQuery('.pp-tabwrap div').removeClass('pp-taboff');
		jQuery('.pp-tabwrap div').addClass("pp-taboff");
		jQuery(this).removeClass('pp-taboff');
		jQuery(this).addClass("pp-tabon");
		jQuery("#pp-main-tab-topics").hide();
		jQuery("#pp-main-tab-posts").hide();
		jQuery("#pp-main-tab-gallery").hide();
		jQuery("#pp-main-tab-blog").hide();
		jQuery("#pp-main-tab-comments").hide();
		jQuery("#pp-main-tab-friends").hide();
		jQuery("#pp-main-tab-settings").show();
	});
/**Code for Signup page END**/

});
