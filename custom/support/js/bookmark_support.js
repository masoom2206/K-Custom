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
//window.alert = function(arg) { if (window.console && console.log) { console.log(arg);}};
jQuery(document).ready(function() {
	
	//Js code for Bookmarks
	var mouse_is_inside_bookmark = false;
	jQuery('.my-bookmarks').live('click', function(){
		if(jQuery('.lesson-bookmarks').css("display") == "none") {
			jQuery('.lesson-bookmarks').show();
		}
		else {
			jQuery('.lesson-bookmarks').hide();
		}
		var bookmarkLink  = jQuery('.bookmark-link .gmc-flag-link').text();
		if(bookmarkLink == 'no-data') {
			jQuery('.bookmark-link').hide();
			//jQuery("#bookmark_filter").css({"margin-bottom": "-25px"});
			jQuery("#bookmark_filter").css({"padding-top": "0px"});
		}
		jQuery("[id^='post-member-']").removeClass("popmenubutton-new");
		jQuery("[id^='post-member-']").addClass("popmenubutton-new-out");
	}).hover(function(){
		mouse_is_inside_bookmark = true;
	},
	function(){
		mouse_is_inside_bookmark = false;
	});
	
	jQuery(".lesson-bookmarks").hover(function(){
		mouse_is_inside_bookmark = true;
	},
	function(){
		mouse_is_inside_bookmark = false;
	});
	jQuery(document).mouseup(function (e){
		if(! mouse_is_inside_bookmark) {
			jQuery('.lesson-bookmarks').hide();
		}
	});
	jQuery('#clearFilter').live('click', function(){
		jQuery('.lesson-bookmarks').hide();
	});
	
	jQuery("[id^='label-']").click(function(){
		var pathname = window.location.pathname;
		var NewPath = pathname.split('/');
		var url = jQuery(this).attr('href');
		if(url && NewPath[1] != 'user'){
			window.location.href = url;
		}
	});
	jQuery("#bookmarks-search").bind('focus click', function(){
		if(jQuery(this).val() == 'Write to filter bookmarks') {
			jQuery(this).val('');
		}
	}).blur(function(){
		if(jQuery(this).val() == '') {
			jQuery(this).val('Write to filter bookmarks');
		}
	}).keyup(function() {
		var dInput = jQuery(this).val();
		if(dInput != ''){
			jQuery.post("/search-bookmarks/", {"word":dInput}, function(response) {
				jQuery('#block-block-4 #bookmarkorganizer-index-table .result-search-bookmarks').remove();
				jQuery('#block-block-4 #bookmarkorganizer-index-table tbody').hide();
				jQuery('#block-block-4 #bookmarkorganizer-index-table').append(response);
			});
		}
		else {
			jQuery('#block-block-4 #bookmarkorganizer-index-table .result-search-bookmarks').remove();
			jQuery('#block-block-4 #bookmarkorganizer-index-table tbody').show();
		}
	});
	
	//Enable edit mode in bookmarks block
	jQuery("#block-block-4 a.tabledrag-handle").hide()
	jQuery(".gmc-trash").hide();
	jQuery(".gmc-trash").nextAll().hide();
	jQuery("#edit-bookmarks .edit").click(function(){
		if(jQuery('#edit-bookmarks .finish-edit').css("display") == "none") {
			jQuery('#edit-bookmarks .edit').hide();
			jQuery('#edit-bookmarks .finish-edit').show();
			jQuery("#block-block-4 a.tabledrag-handle").show();
			jQuery(".add-folder-link").show();
			jQuery(".gmc-trash").show();
			jQuery(".gmc-trash").nextAll().show();
		}
	});
	jQuery("#edit-bookmarks .finish-edit").click(function(){
		if(jQuery('#edit-bookmarks .edit').css("display") == "none") {
			jQuery('#edit-bookmarks .finish-edit').hide();
			jQuery('#edit-bookmarks .edit').show();
			jQuery("#block-block-4 a.tabledrag-handle").hide();
			jQuery(".add-folder-link").hide();
			jQuery(".gmc-trash").hide();
			jQuery(".gmc-trash").nextAll().hide();
		}
	});
	
	jQuery(".gmc-flag-bookmark a").click(function(){
		if(jQuery(".gmc-choose-folder").length == 0) {
			jQuery(".gmc-flag-bookmark").hide();
			jQuery(".gmc-flag-link").show();
			jQuery(".gmc-flag-link a").click();
			/*var uid = 'uid';
			jQuery.post("/gmc/bookmark/list/", {"uid":uid}, function(response) {
				alert(response.html());
				jQuery('.bookmark-detail .bookmarkorganizer-container').remove();
				//jQuery('.bookmark-detail').append(response);
			});*/
			jQuery(".gmc-trash").hide();
			jQuery(".gmc-trash").nextAll().hide();
			jQuery(".row-label").nextAll().hide();
		}
		else {
			jQuery(".bookmark-detail .bookmarkorganizer-container").hide();
			jQuery(".gmc-user-folder-list").show();
			jQuery(".gmc-flag-bookmark").hide();
			jQuery(".gmc-choose-folder").show();
		}
	});
	jQuery(".gmc-choose-folder").click(function(){
		alert("please pick one folder");
	});
	jQuery("#gmc-folder-select tr .label").click(function(){
		var id = jQuery(this).attr('value');
		//alert("ID = "+id);
		jQuery.post("/gmc/bookmark/parent/folder/", {"parent_id":id}, function(response) {
			jQuery(".bookmark-detail .bookmarkorganizer-container").show();
			jQuery(".gmc-user-folder-list").hide();
			jQuery(".gmc-flag-bookmark").hide();
			jQuery(".gmc-choose-folder").hide();
			jQuery(".gmc-flag-link").show();
			jQuery(".gmc-flag-link a").click();
		});
	});
	/*jQuery(".bookmark-link .flag-wrapper a").click(function(){
		//alert('ssss');
		var uid = 'uid';
		jQuery.post("/gmc/bookmark/list/", {"uid":uid}, function(response) {
			jQuery('.bookmark-detail .bookmarkorganizer-container').remove();
			jQuery('.bookmark-detail').append(response);
		});
	});*/
	
});


Drupal.behaviors.support = {
  attach: function(context, settings) {
    (function ($) {
		jQuery(".gmc-flag-link a.unflag-action").click(function(){
			jQuery(".gmc-flag-link").hide();
			jQuery(".gmc-flag-bookmark").show();
		});
		//change/refresh bookmarks list after bookmark any lessons
		jQuery(".bookmark-link .flag-wrapper a").click(function(){
			setTimeout(function () {
				var uid = 'uid';
				jQuery.post("/gmc/bookmark/list/", {"uid":uid}, function(response) {
					jQuery('.bookmark-detail .bookmarkorganizer-container').remove();
					jQuery('.bookmark-detail').append(response);

					jQuery(".gmc-trash").hide();
					jQuery(".gmc-trash").nextAll().hide();
					jQuery(".row-label").nextAll().hide();
				});
			}, 3000);
		});
		//Delete User Bookmark lessons from Bookmarks
		jQuery(".gmc-remove-link").click(function(){
			var label = jQuery(this).attr('label');
			var id = jQuery(this).attr('value');
			var checkstr =  confirm('Do you really want to remove "'+label+'"?');
			if(checkstr == true){
				jQuery.post("/bookmarkorganizer/delete/ajax/"+id, {"id":id}, function(response) {
					jQuery('tr.item-'+id).remove();
				});
			}else{
				return false;
			}
		});
		//Delete User folder and lessons from Bookmarks
		jQuery(".gmc-remove-folder").click(function(){
			var label = jQuery(this).attr('label');
			var id = jQuery(this).attr('value');
			var bookmark_labels = jQuery(this).attr('bookmark_labels');
			var bookmark_ids = jQuery(this).attr('bookmark_ids');
			bookmark_labels  = bookmark_labels.replace(new RegExp("@@@", 'g'),"\n");
			var checkstr =  confirm('Do you really want to remove "'+label+'"?\n\nRemoving the folder will delete ALL the bookmarks inside it.\n\nThe bookmarks that will be removed are:\n'+bookmark_labels);
			if(checkstr == true){
				jQuery.post("/bookmarkorganizer/delete/ajax/"+id, {"id":id}, function(response) {
					jQuery('tr.item-'+id).remove();
					var ids = bookmark_ids.split("@@@");
					jQuery.each( ids, function( key, value ) {
						if(value != '') {
							jQuery('tr.item-'+value).remove();
						}
					});
				});
			}else{
				return false;
			}
		});
		//Add User folders in Bookmarks
		jQuery(".gmc-add-bookmarks-folder").click(function(){
			var name = prompt("What should the new folder be called?","");
			if (name != null) {
				var uid = Drupal.settings.user_js_uid;
				jQuery.post("/bookmarkorganizer/add/folder/ajax/"+uid, {"name":name}, function(response) {
					if(response) {
						jQuery.each( response, function( key, value ) {
							if(key == 'bookmarks') {
								jQuery('.bookmark-detail .bookmarkorganizer-index #bookmarkorganizer-user-bookmarks-form').remove();
								jQuery('.bookmark-detail .bookmarkorganizer-index').append(value);
								jQuery(".row-label").nextAll().hide();
							}
						});
					}
				});
			}else{
				return false;
			}
		});
		
    })(jQuery);
  }
};
