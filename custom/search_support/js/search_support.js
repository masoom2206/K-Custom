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
	
	var hash = window.location.hash;
	if(hash) {
		var lessonArray = hash.split('lesson');
		//var forumArray = hash.split('forum');
		if(lessonArray[0] == '#'){
			var data1 = hash.split(';');
			var data2 = data1[0].split('#lesson=');
			var data3 = data1[1].split('forum=');
			var lesson = parseInt(data2[1], 10);
			jQuery('.show-more-lessonss').attr('data-page', lesson);
			if(lesson >= parseInt(jQuery('.show-more-lessonss').attr('data-maxpage'), 10)) {
				jQuery('.show-more-lessonss').hide();
			}
			jQuery.post("/gmc-loadmore-search-session/", {"url":hash}, function(response) {
				if(jQuery.trim(response) != 'false'){
					location.reload();
				}
			});
		}
	}
	
	//remove jQuery autocomplete error alert in search form
	jQuery('#gmc-site-search input[type="submit"]').click(function(){
		window.alert = function(arg) { if (window.console && console.log) { console.log(arg);}};
	});
	jQuery('#advanced-search #edit-submit-advance-search').click(function(){
		window.alert = function(arg) { if (window.console && console.log) { console.log(arg);}};
	});

	/*JS code for display search text and number with load more*/
	count_with_load_more();
	var TotalLessonsCount = jQuery.trim(jQuery('.view-lessons-count').text());
	var LessonsCount = 9;
	var TotalForumCount = jQuery.trim(jQuery('.view-forum-count').text());
	var ForumCount = 9;
	/*if(jQuery('.view-display-id-page .pager-load-more li a').length == 0) {
		jQuery('.show-more-lessons').hide();
	}*/
	if(jQuery('.view-display-id-block_2 .pager-load-more li a').length == 0) {
		jQuery('.show-more-lessons').hide();
	}
	if(jQuery('.view-display-id-block_1 .pager-load-more li a').length == 0) {
		jQuery('.show-more-forum').hide();
	}
	jQuery('.show-more-lessons').click(function(){
		if(window.location.hash) {
			var hash = window.location.hash;
			var data1 = hash.split(';');
			var data2 = data1[0].split('#lesson=');
			var data3 = data1[1].split('forum=');
			var lesson = parseInt(data2[1], 10);
			lesson = lesson + 1;
			var URLhash = '#lesson='+ lesson + ';forum='+ data3[1];
			window.location.hash = URLhash;
		}
		else {
			var URLhash = '#lesson='+ 2 + ';forum='+ 1;
			window.location.hash = URLhash;
		}
		LessonsCount = LessonsCount + 9;
		/*if(jQuery('.view-display-id-page .pager-load-more li a').length == 0 || LessonsCount >= TotalLessonsCount) {
			jQuery('.show-more-lessons').hide();
		}
		jQuery('.view-display-id-page .pager-load-more li a').click();*/
		if(jQuery('.view-display-id-block_2 .pager-load-more li a').length == 0 || LessonsCount >= TotalLessonsCount) {
			jQuery('.show-more-lessons').hide();
		}
		jQuery('.view-display-id-block_2 .pager-load-more li a').click();
    });

/**********************Custom Lessons Block Load More Start************************************/
	jQuery('.show-more-lessonss').click(function(){
		jQuery(this).after("<div class=\"item-list\" id=\"lesson-ajax-progress\"><ul class=\"pager pager-load-more\"><li class=\"pager-next first last\"><div class=\"ajax-progress ajax-progress-throbber\"><div class=\"throbber\">&nbsp;</div></div></li></ul></div>");
		if(window.location.hash) {
			var hash = window.location.hash;
			var data1 = hash.split(';');
			var data2 = data1[0].split('#lesson=');
			var data3 = data1[1].split('forum=');
			var lesson = parseInt(data2[1], 10);
			lesson = lesson + 1;
			var URLhash = '#lesson='+ lesson + ';forum='+ data3[1];
			window.location.hash = URLhash;
		}
		else {
			var URLhash = '#lesson='+ 2 + ';forum='+ 1;
			window.location.hash = URLhash;
		}
		var $this = jQuery(this).addClass('was-clicked');
		var $contentBlock = $this.prevAll('.content-block:first');		
		var $lessonList = $contentBlock.find('.top').next();
		var $cloneSourceList = $lessonList.clone();
		var $cloneSourceItem = $lessonList.find('li:first').clone();
		jQuery.each($cloneSourceList.find('li'), function()
		{
			jQuery(this).remove();
		});
		var type = 'lesson';
		jQuery.ajax({
			'url' : '/gmc/search/list/more/',
			'type' : 'POST',
			'dataType' : 'json',
			'data' : {
			'type': type,
			'pageArguments' : jQuery('#pageArguments').attr('value'),
			'pageArgumentsUID' : jQuery('#pageArgumentsUID').attr('value'),
			'pageArgumentsLevel1' : jQuery('#pageArgumentsLevel1').attr('value'),
			'pageArgumentsLevel2' : jQuery('#pageArgumentsLevel2').attr('value'),
			'pageArgumentsTID1' : jQuery('#pageArgumentsTID1').attr('value'),
			'pageArgumentsTID2' : jQuery('#pageArgumentsTID2').attr('value'),
			'pageArgumentsOrder' : jQuery('#pageArgumentsOrder').attr('value'),
			'pageArgumentsDescending' : jQuery('#pageArgumentsDescending').attr('value'),
			'pageArgumentsSpoken' : jQuery('#pageArgumentsSpoken').attr('value'),
			'page' : $this.attr('data-page')
			},
			'success' : function(json) {
				if(json.items) {
					jQuery.each(json.items, function(key, item) {
						var $newItem = $cloneSourceItem.clone();
						if(type == 'lesson') {
							var lessonsName = item.name;
							if(item.name.length > 20) {
								lessonsName = item.name.substr(0, 23)+'...';
							}
							$newItem.find('span.title').attr('title',item.name);
							$newItem.find('span.title').attr('href', item.url).find('h3:first').html('<a href="'+item.url+'">'+lessonsName+'</a>');
							$newItem.find('div.cover').attr('href', item.url);
							$newItem.find('a.title').attr('href', item.url);
							$newItem.find('img:first').attr('title', item.name).attr('src', item.image);
							$newItem.find('span.by').html(item.creator);
							$newItem.find('div.hardness > span > span').html(item.hardness);
							$newItem.find('span.date').html(item.date_rel);
							
							if(  item.is_free === "1" || item.is_free === true ) {
								//jQuery($newItem.find('a').get(0)) .addClass('free100lesson');
								if(  $newItem.find('.free100bg').length < 1 ) {
									// create new
									jQuery($newItem.find('div.cover')).prepend( jQuery('<div/>').addClass('free100bg') ) ;
								}
							} else {
								//jQuery($newItem.find('a').get(0)) .removeClass('free100lesson');
								if(  $newItem.find('.free100bg').length > 0 ) {
									// remove
									$newItem.find('.free100bg').remove() ;
								}
							}
							
							// $cloneSourceList.append($newItem);
							$lessonList.append($newItem);
						}
					});
					jQuery('#lesson-ajax-progress').remove();
				}

			},
			'error' : function() {
				alert('Error in search');
			}
		});
		$this.attr('data-page', parseInt($this.attr('data-page'), 10) + 1);
		if($this.attr('data-page') >= Math.ceil($this.attr('data-maxpage'))) {
			$this.hide();
		}
		
    });
/**********************Custom Lessons Block Load More End**************************************/

/**********************Custom Forum Block Load More Start************************************/
	jQuery('.show-more-forums').click(function(){
		jQuery(this).after("<div class=\"item-list\" id=\"lesson-ajax-progress\"><ul class=\"pager pager-load-more\"><li class=\"pager-next first last\"><div class=\"ajax-progress ajax-progress-throbber\"><div class=\"throbber\">&nbsp;</div></div></li></ul></div>");
		if(window.location.hash) {
			var hash = window.location.hash;
			var data1 = hash.split(';');
			var data2 = data1[0].split('#lesson=');
			var data3 = data1[1].split('forum=');
			var forum = parseInt(data3[1], 10);
			forum = forum + 1;
			var URLhash = '#lesson='+ data2[1] + ';forum='+ forum;
			window.location.hash = URLhash;
		}
		else {
			var URLhash = '#lesson='+ 1 + ';forum='+ 2;
			window.location.hash = URLhash;
		}
		var $this = jQuery(this).addClass('was-clicked');
		var $contentBlock = $this.prevAll('.content-block:first');
		var $forumItemList = $contentBlock.find('ul.forum-search-list');
		var $cloneSourceListLeft = $forumItemList.find('li:first > ul:first');
		var $cloneSourceListRight = $forumItemList.find('li:first').next().find('ul:first');
		var $cloneSourceItem = $forumItemList.find('ul:first > li:first').clone();
		var type = 'forum';
		jQuery.ajax({
			'url' : '/gmc/search/list/more/',
			'type' : 'POST',
			'dataType' : 'json',
			'data' : {
			'type': type,
			'pageArguments' : jQuery('#pageArguments').attr('value'),
			'page' : $this.attr('data-page')
			},
			'success' : function(json) {
				if(json.items) {
					jQuery.each(json.items, function(key, item) {
						var $newItem = $cloneSourceItem.clone();
						if(type == 'forum') {
							$newItem
								.find('a.name')
									.attr('href', item.url)
									.html(item.title)
								.parent().find('a.forum')
									.attr('href', item.url)
									.html(item.forum);
							if(parseInt(key, 10) < 5) {
								// not append ?
								$cloneSourceListLeft.append(jQuery('<li>').append($newItem.html()));
							}
							else{
								// not append ?
								$cloneSourceListRight.append(jQuery('<li>').append($newItem.html()));
							}
						}
					});
					jQuery('#lesson-ajax-progress').remove();
				}

			},
			'error' : function() {
				alert('Error in search');
			}
		});
		$this.attr('data-page', parseInt($this.attr('data-page'), 10) + 1);
		if($this.attr('data-page') >= Math.ceil($this.attr('data-maxpage'))) {
			$this.hide();
		}
		
    });
/**********************Custom Forum Block Load More End**************************************/




	jQuery('.show-more-forum').click(function(){
		if(window.location.hash) {
			var hash = window.location.hash;
			var data1 = hash.split(';');
			var data2 = data1[0].split('#lesson=');
			var data3 = data1[1].split('forum=');
			var forum = parseInt(data3[1], 10);
			forum = forum + 1;
			var URLhash = '#lesson='+ data2[1] + ';forum='+ forum;
			window.location.hash = URLhash;
		}
		else {
			var URLhash = '#lesson='+ 1 + ';forum='+ 2;
			window.location.hash = URLhash;
		}
		ForumCount = ForumCount + 9;
		if(jQuery('.view-display-id-block_1 .pager-load-more li a').length == 0 || ForumCount >= TotalForumCount) {
			jQuery('.show-more-forum').hide();
		}
		jQuery('.view-display-id-block_1 .pager-load-more li a').click();
		jQuery("ul.forum-search-list").hide().fadeIn('fast');
    });
	jQuery('.view-display-id-page .pager-load-more li a').click(function(){
		//jQuery("ul.lesson-list").hide().fadeIn('fast');
		//alert(document.body.innerHTML = ajax_response);
	});
	
	/* END */
	
	if (jQuery("#stumble").length > 0) {
		jQuery("#toolbar").css({"margin-top": "25px"});
	}
	else {
		jQuery("#toolbar").css({"margin-top": "0px"});
	}
	jQuery("#views-exposed-form-site-search-page").hide();
	jQuery("#views-exposed-form-site-search-block-1").hide();
	jQuery("#edit-gmc-search-field").bind('focus click', function(){
		if(jQuery(this).val() == 'Search for anything on the site...') {
			jQuery(this).val('');
		}
	}).blur(function(){
		if(jQuery(this).val() == '') {
			jQuery(this).val('Search for anything on the site...');
		}
	});

	//Click submit button after enter key press in search form
	jQuery("#edit-gmc-search-field").keyup(function(event) {
		if(event.keyCode == '13') {
			jQuery('#gmc-site-search input[type="submit"]').click();
		}
	});
	jQuery("#edit-search-term").keyup(function(event) {
		if(event.keyCode == '13') {
			jQuery('#advanced-search #edit-submit-advance-search').click();
		}
	});
	//submit search form
	jQuery("#autocomplete ul li").live("click", function(){
    if(jQuery('#edit-gmc-search-field').val() != 'Search for anything on the site...') {
		  jQuery('#gmc-site-search input[type="submit"]').trigger( "click" );
      //alert(jQuery('#edit-gmc-search-field').val());
    }
  });
	jQuery(".view-id-site_search .lesson-list li").live("mouseenter",function(){
		jQuery(this).find('.hardness').show();
		jQuery(this).find('.hardness-bg').show();
    });
	jQuery(".view-id-site_search .lesson-list li").live("mouseleave",function(){
		jQuery(this).find('.hardness').hide();
		jQuery(this).find('.hardness-bg').hide();
    });
	//redirect to lesson detail page if tap by mobile.
	jQuery(".page-search .lesson-list li").live('tap', function(e){
		var l_url = jQuery(this).find('.cover a').attr('href');
		var url = window.location.protocol + "//" + window.location.host + l_url;
		window.location.href = l_url;
	});
	jQuery(".page-search .lesson-list li").live("mouseenter",function(){
		jQuery(this).find('.hardness').show();
		jQuery(this).find('.hardness-bg').show();
    });
	jQuery(".page-search .lesson-list li").live("mouseleave",function(){
		jQuery(this).find('.hardness').hide();
		jQuery(this).find('.hardness-bg').hide();
    });
	//Reset advance search form
	jQuery("#edit-clear-advance-search").click(function(){
		jQuery('#edit-instructor').val("any");
		jQuery('#edit-difficulty-level-from').val("1");
		jQuery('#edit-difficulty-level-to').val("10");
		jQuery('#edit-lesson-type').val("any");
		jQuery('#edit-lesson-category').val("any");
		jQuery('#edit-order-by').val("0");
		jQuery('#edit-search-term').val("");
    });
	
	
});


/**
 * Callback function to get $_GET value
 */
function get_url_value( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
/**
 * Callback function to replace text in add more button
 */
function count_with_load_more() {
	var SearchTitle = get_url_value('title');
	SearchTitle = SearchTitle.replace(/\%20/g,' ');
	var SearchUser = get_url_value('uid');
	SearchUser = SearchUser.replace(/\%20/g,' ');
	jQuery('.view-lessons-count').hide();
	jQuery('.view-forum-count').hide();
	var ViewLessonsCount = jQuery.trim(jQuery('.view-lessons-count').text());
	var ViewForumCount = jQuery.trim(jQuery('.view-forum-count').text());
	if(SearchTitle != ''){
		jQuery('.show-more-lessons').text('Click to see more lessons about '+SearchTitle+' ('+ViewLessonsCount+' matches in total).');
		jQuery('.show-more-forum').text('Click to see more about '+SearchTitle+' from the forums ('+ViewForumCount+' matches in total).');		
	}
	else if(SearchUser != ''){
		jQuery('.show-more-lessons').text('Click to see more lessons about '+SearchUser+' ('+ViewLessonsCount+' matches in total).');
		jQuery('.show-more-forum').text('Click to see more about '+SearchUser+' from the forums ('+ViewForumCount+' matches in total).');		
	}
	else {
		jQuery('.show-more-lessons').text('Click to see more lessons about ('+ViewLessonsCount+' matches in total).');
		jQuery('.show-more-forum').text('Click to see more forums about ('+ViewForumCount+' matches in total).');		
	}
}


