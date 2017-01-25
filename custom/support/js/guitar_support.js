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
	/*Jquery function call for select list*/
	//jQuery("#views-exposed-form-series-lessones-block-2 #edit-field-category-tid").selectify();
	
	var hash = window.location.hash;
	if(hash) {
		var latestArray = hash.split('latest');
		if(latestArray[0] == '#'){
			var pathname = window.location.pathname;
			jQuery.post("/gmc-loadmore-session/", {"url":hash,"pathname":pathname}, function(response) {
				if(jQuery.trim(response) != 'false'){
					//alert(response)
					location.reload();
					//jQuery('.guitar-view-lessons-left .view-display-id-block_1').remove();
					//jQuery('.guitar-view-lessons-left').append(response);
				}
			});
		}
	}
	jQuery('.show-more').click(function(){
    var type = jQuery(this).attr('data-type');
    alert(type);
        if((type == 'rated' || type == 'latest') && (parseInt(jQuery(this).attr('data-offset'), 10) < parseInt(jQuery(this).attr('data-max-lesson'), 10))) {
        if(type == 'rated') {
          var jQuerylessonList = jQuery('#rated-lessons-list');
        }
        else if (type == 'latest')
        {
        var jQuerylessonList = jQuery('#latest-lessons-list');
        }
        var jQuerycloneSourceItem = jQuerylessonList.find('li:last');
        var jQuerycontainer = jQuery('<abbr />');
        jQuerycloneSourceItem.closest('ul').append(jQuerycontainer);
        var exclude = new Array();
        if(type == 'rated')
        {
        jQuerylessonList.find('li').each(function(key, item)
        {
        exclude.push(jQuery(item).attr('exc-id'));
        });
        }
        jQuery.ajax({
        'url' : '/categories/lessons/',
        'type' : 'POST',
        'dataType' : 'json',
        'data' : {
        'category' : jQuery(this).attr('data-category'),
        'val' : jQuery(this).attr('data-val'),
        'offset' : jQuery(this).attr('data-offset'),
        'limit' : jQuery(this).attr('data-limit'),
        'sorttype' : jQuery(this).attr('data-sorttype'),
        'order' : jQuery(this).attr('data-order'),
        'exc[]' : exclude
        },
        'success' : function(msg)
        {
 
           jQuery(this).parent().find('ul').append(msg);
        // update
        if(parseInt(jQuery(this).attr('data-offset'), 10) >= parseInt(jQuery(this).attr('data-max-lesson'), 10))
        {
        jQuery(this).hide();
        }
        } 
        });
        jQuery(this).attr('data-offset', parseInt(jQuery(this).attr('data-offset'), 10) + parseInt(jQuery(this).attr('data-limit'), 10));
    }
	});
	/*JS code for display total videos number with load more*/
	jQuery('.latest-video-lessons-count').hide();
	jQuery('.highest-video-lessons-count').hide();
	var TotalLatestVideosCount = jQuery.trim(jQuery('.latest-video-lessons-count').text());
	var LatestVideosCount = 10;
	var TotalHighestVideoCount = jQuery.trim(jQuery('.highest-video-lessons-count').text());
	var HighestVideoCount = 10;
	if(jQuery('.view-display-id-block_1 .pager-load-more li a').length == 0) {
		jQuery('.show-more-latest-video').hide();
	}
	if(jQuery('.view-display-id-block_2 .pager-load-more li a').length == 0) {
		jQuery('.show-more-highest-video').hide();
	}
	jQuery('.show-more-latest-video').click(function(){
		if(window.location.hash) {
			var hash = window.location.hash;
			var data1 = hash.split(';');
			var data2 = data1[0].split('#latest=');
			var data3 = data1[1].split('rated=');
			var latest = parseInt(data2[1]);
			latest = latest + 1;
			var URLhash = '#latest='+ latest + ';rated='+ data3[1];
			window.location.hash = URLhash;
		}
		else {
			var URLhash = '#latest='+ 2 + ';rated='+ 1;
			window.location.hash = URLhash;
		}
		//window.location.href = location.href.replace("latest=3", "latest=4");
		LatestVideosCount = LatestVideosCount + 10;
		if(jQuery('.view-display-id-block_1 .pager-load-more li a').length == 0 || LatestVideosCount >= TotalLatestVideosCount) {
			jQuery('.show-more-latest-video').hide();
		}
		jQuery('.view-display-id-block_1 .pager-load-more li a').click();
    });
	jQuery('.show-more-highest-video').click(function(){
		if(window.location.hash) {
			var hash = window.location.hash;
			var data1 = hash.split(';');
			var data2 = data1[0].split('#latest=');
			var data3 = data1[1].split('rated=');
			var rated = parseInt(data3[1]);
			rated = rated + 1;
			var URLhash = '#latest='+ data2[1] + ';rated='+ rated;
			window.location.hash = URLhash;
		}
		else {
			var URLhash = '#latest='+ 1 + ';rated='+ 2;
			window.location.hash = URLhash;
		}
		HighestVideoCount = HighestVideoCount + 10;
		if(jQuery('.view-display-id-block_2 .pager-load-more li a').length == 0 || HighestVideoCount >= TotalHighestVideoCount) {
			jQuery('.show-more-highest-video').hide();
		}
		jQuery('.view-display-id-block_2 .pager-load-more li a').click();
    });
	
	jQuery("img.reflected").click(function(){
		var width = jQuery(this).attr("width");
		var url = jQuery(this).parent().parent().find('a').attr("href");
		if(width > 140){
			location = url;
		}
	});
	
	/* END */
	
	/*video-lessons/lesson-series*/
    /*Project.fn('lessonseriesCoverflip', function()
    {*/
	lessonseriesCoverflip()
		
	//var flip = document.id('flip');
	var flip = jQuery('#flip');
	if(flip){
		flip.mouseenter('(img)',function(evt){
			flip.addClass('lesson_series_hover_ul');
		});
		flip.mouseleave('(img)',function(evt){
			flip.removeClass('lesson_series_hover_ul');
		});
		/*flip.click(function(evt){
			var img = evt.target;
			setTimeout(function(){
				if(img.tagName == 'IMG' && img.clientWidth > 140){
					var url = jQuery(this).parent().parent().find('a').attr("href");
					location = url;
				}
			},
			10);
		});*/
		return;
	}
	setTimeout(arguments.callee,300);

    /*});
    Project.lessonseriesCoverflip();*/

	jQuery.noConflict();
	
});


function lessonseriesCoverflip(){
        jQuery('#coverflip').show();
        jQuery(".reflection img").reflect();
        jQuery( '#flip' ).jcoverflip({
            current: 3,
            beforeCss: function( el, container, offset ){
                return [
                jQuery.jcoverflip.animationElement( el.find( 'canvas' ), {
                    width: Math.max(10,100-10*offset*offset) + 'px',
                    height: '53px'
                }, {} ),
                jQuery.jcoverflip.animationElement( el, {
                    left: ( container.width( )/2 - 160 - 60*offset + 20*offset )+'px', 
                    bottom: '0px'
                }, { } ),
                jQuery.jcoverflip.animationElement( el.find( 'img' ), {
                    width: Math.max(10,100-10*offset*offset) + 'px'
                }, {} )
                ];
            },
            afterCss: function( el, container, offset ){
                return [
                jQuery.jcoverflip.animationElement( el.find( 'canvas' ), {
                    width: Math.max(10,100-10*offset*offset) + 'px',
                    height: '53px'
                }, {} ),
                jQuery.jcoverflip.animationElement( el, {
                    left: ( container.width( )/2 + 70 + 60*offset )+'px', 
                    bottom: '0px'
                }, { } ),
                jQuery.jcoverflip.animationElement( el.find( 'img' ), {
                    width: Math.max(10,100-10*offset*offset) + 'px'
                }, {} )

                ];
            },
            currentCss: function( el, container ){
                return [
                jQuery.jcoverflip.animationElement( el.find( 'canvas' ), {
                    width: '145px'
                }, { } ),
                jQuery.jcoverflip.animationElement( el, {
                    left: ( container.width( )/2 - 69 )+'px', 
                    bottom: '0px'
                }, { } ),
                jQuery.jcoverflip.animationElement( el.find( 'img' ), {
                    width: '145px'
                }, { } )
                ];
            }
        });
}


Drupal.behaviors.lessonscontent = {
  attach: function(context, settings) {
    (function ($) {
		jQuery("#views-exposed-form-series-lessones-block-2 #edit-field-category-tid").selectify();
		//Show/Hide in categories list
		jQuery(".view-series-lessones td").mouseenter(function(){
			jQuery(this).find('.heading').show();
			jQuery(this).find('.categories_shadow img').addClass("opacityElement");
		});
		jQuery(".view-series-lessones td").mouseleave(function(){
			jQuery(this).find('.heading').hide();
			jQuery(this).find('.categories_shadow img').removeClass("opacityElement");
		});
    })(jQuery);
  }
};
