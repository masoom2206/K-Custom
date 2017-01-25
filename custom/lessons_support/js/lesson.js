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
  /*Js code for lesson detail page.*/
  var ev_name = App.mobile ? 'tap' : 'click';
  jQuery('.guitar-lesson-parts-list li').live(ev_name, function(){
	//jQuery('.guitar-lesson-parts-list li').click(function(){
	var fid = jQuery(this).attr('partid');
	var lpartid = jQuery(this).attr('lpartid');
	var revision = jQuery(this).attr('revision');
	var nid = jQuery('.lesson_node_id').text();
	var type = 'not-free';
    
	if(jQuery(this).hasClass('free')) {
		jQuery(".guitar-lesson-parts-list li").removeClass("current");
		jQuery(this).addClass("current");
		var type = 'free';
	} else {
		jQuery(".guitar-lesson-parts-list li").removeClass("current");
		jQuery(this).addClass("current");
	}
	jQuery('#videoPlayer #videoPlayerId').remove();
    if (jQuery(this).hasClass('mobile')) {
       var videourls = jQuery(this).attr('data-loc');
       //alert(videourls);
      // alert(ev_name);
       if (videourls != '') {
         jQuery('#player_mask img').hide();
         jQuery('#player_mask a').hide();
         jQuery('#mp4_player').show();
       } else {
          videourls = '/';
          jQuery('#player_mask img').show();
          jQuery('#player_mask a').show();
          jQuery('#mp4_player').hide();
       }
       doPlayList("guitar-lesson-parts-list", "player", videourls);
    }
	else if(Drupal.settings.browser_name == 'ie' && Drupal.settings.browser_version == '8'){
		jQuery("#videoPlayer video").remove();
		jQuery("#videoPlayer").append("<video width=\"680\" height=\"463\" controls=\"controls\">\
			<object name=\"videoPlayerName\" id=\"videoPlayerId\" width=\"680\" height=\"463\" allowscriptaccess=\"always\" style=\"vertical-align:text-top;\" type=\"application/x-shockwave-flash\" data=\"/flashvideoplayer/videoPlayer4.swf\">\
				<param name=\"bgcolor\" value=\"#000000\">\
				<param name=\"allowFullscreen\" value=\"true\">\
				<param name=\"wmode\" value=\"opaque\">\
				<param name=\"movie\" value=\"/flashvideoplayer/videoPlayer4.swf\" />\
				<param name=\"flashvars\" id=\"flashvars\" value=\"xml=../admin/icp/lesson/"+nid+"/"+fid+"/xml/"+lpartid+"\">\
				<param name=\"allowscriptaccess\" value=\"always\">\
				<param name=\"allownetworking\" value=\"all\">\
			</object></video>");
	}
	else {
		jQuery('#videoPlayer').append("<object name=\"videoPlayerName\" id=\"videoPlayerId\" width=\"680\" height=\"463\" allowscriptaccess=\"always\" style=\"vertical-align:text-top;\" type=\"application/x-shockwave-flash\" data=\"/flashvideoplayer/videoPlayer4.swf\">        <param name=\"bgcolor\" value=\"#000000\">        <param name=\"allowFullscreen\" value=\"true\">        <param name=\"wmode\" value=\"opaque\">        <param name=\"flashvars\" id=\"flashvars\" value=\"xml=../admin/icp/lesson/"+nid+"/"+fid+"/xml/"+lpartid+"\">        <param name=\"allowscriptaccess\" value=\"always\">		<param name=\"allownetworking\" value=\"all\">		</object>");
    }
		jQuery.post("/lesson/notes/description/", {"nid":nid, "fid":fid, "type":type, "lpartid":lpartid, "revision":revision}, function(response) {
			jQuery('.lessontext #dynamic_lessontext').remove();
			jQuery('.lessontext').append("<div id=\"dynamic_lessontext\">"+response+"</div><script type=\"text/javascript\"> gmc_keyword_add(); </script>");
			jQuery("a.tab-legend").click();
		});
	});
	jQuery('.guitar-lesson-parts-list li').live('mouseover', function(){
		jQuery(this).find('.tooltip').show();
	}).live('mouseout', function(){
		jQuery('.tooltip').hide();
	});

	jQuery('#feedback-lesson').find('textarea, .view').bind('focus click', function(event){
		if (jQuery(this).is('textarea')) {
			if (jQuery('textarea:visible').height() !== 70) {
				jQuery('#lesson-share').hide();
				jQuery('.rec-generator-popup').hide();
				if (jQuery('#ratePopup').is(':visible')) {
					jQuery('#rate-lesson').click();
				}
				jQuery(this).val('');
				jQuery(this).animate({
					'height': 70
				}, 500, function() {
					jQuery(this).parent().find('.submit, .close').fadeIn(500);
				}).css('font-size','11px');
			}
		}
		else {
			jQuery(this).val('');
			jQuery(this).animate({
				'width': 135
			}, 500, function() {
				jQuery(this).parent().find('.submit, .close').fadeIn(500);
			}).css('font-size','11px');
		}
	}).blur(function(event){
		if(jQuery(this).val() == '') {
			var count = jQuery('.lesson_comment_count').text();
			jQuery(this).val('Give feedback on the lesson ('+count+' so far)');
		}
	}).focus(function(event){
		if(jQuery(this).val().match(/feedback on the/i)) {
			jQuery(this).val('');
		}
	}).end().find('.view').click(function(event){
		jQuery('#feedback-lesson textarea').focus();
		return false;
	}).end().find('.submit').click(function(event) {
		if (jQuery.trim(jQuery('#feedback-lesson textarea').val()) && !jQuery('#feedback-lesson textarea').val().match(/feedback on the/i) && !jQuery('#feedback-lesson').is('.submiting')) {
			var nid = jQuery('.lesson_node_id').text();
			var message = jQuery('#feedback-lesson textarea').val();
			jQuery(this).hide();
			jQuery('#feedback-lesson .close').click();
			jQuery.post("/lessons/addcomment/", {"nid":nid, "message":message}, function(response) {
				if(response == 'true') {
					var count = jQuery('.lesson_comment_count').text();
					jQuery('#feedback-lesson textarea').val('Give feedback on the lesson ('+count+' so far)');
					jQuery.post("/lession/comment/list/", {"nid":nid}, function(response) {
						jQuery('.feedbacks ul').remove();
						jQuery('.feedbacks').append(response);
						//jQuery(".feedbacks").hide().fadeIn('fast');
					});
				}
			});
		}
	}).end().find('.close').click(function(event){
		var feedbackTextarea = jQuery('#feedback-lesson').find('textarea, .view');
		if (feedbackTextarea.is('textarea')){
			feedbackTextarea.animate({
				'height': 16
			}, 500,function() {
				jQuery('#lesson-share').show();
				if(jQuery(this).val() == '') {
					var count = jQuery('.lesson_comment_count').text();
					jQuery(this).val('Give feedback on the lesson ('+count+' so far)');
				}
			}).css('font-size','9px');
		}
		else {
			feedbackTextarea.parent().find('.close').hide();
			feedbackTextarea.css('width', 'auto');
		}
		feedbackTextarea.parent().find('.submit, .close').fadeOut(500);
		return false;
	});
	
	jQuery('.tabs li').hover(function(){
		jQuery(this).animate({
			top: '+=2px'
		}, 200);
	},
	function(){
		jQuery(this).animate({
			top: '-=2px'
		}, 200);
	}).click(function(event)
	{
		var _this	= jQuery(this) ;
		_this.addClass('current');
		var siblings	= _this.siblings();
		siblings.removeClass('current');
		var index = jQuery(this).prevAll().length;
		var container = jQuery(this).closest('.content-block');
		try{
			var es	= container.find('.tab-content');
			jQuery.each( es, function(i, el){
				if( i == index ) return ;
				jQuery.each( jQuery(el).find('input'), function(i, input){
					jQuery(input).attr('disabled','disabled') ;
				} );
				jQuery(el).hide();
			});
			var __this	= jQuery(es.get(index)) ;
			jQuery.each( __this.find('input'), function(i, input){
				jQuery(input).removeAttr('disabled','disabled') ;
			} );
			__this.show();
			// $container.find('.tab-content').find(':inputs').attr('disabled','disabled').end().filter(':eq('+index+')').show().find(':inputs').removeAttr('disabled').end().siblings('.tab-content').hide();
		}catch(e){
			throw e ;
		}
		var a = jQuery(this).find('a');
		if (a.length)
		{
			window.location = a.attr('href');
		}
	});
	jQuery('.youtubelink').live('change keyup', function() {
		var value = jQuery('.youtubelink').val();
		//var regExp = /((https?:\/\/)(www.)?(youtube.com\/watch\?v=|youtu.be\/)|<iframe.*youtube.com\/embed\/)([a-z0-9_-]+)/i;
		var regExp = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{10,})/;
		if(value.length && value.match(regExp) && !value.match(/aaBBccDD/)) {
			var tmp = value.match(regExp);
			//alert(tmp[1] || 0);
			jQuery('.rec-generator-popup .youtube-code').val(tmp[1] || 0);
			jQuery('.rec-generator-popup .submit').removeAttr('disabled');
			jQuery('.rec-generator-popup .confirm_bad').hide();
			jQuery('.rec-generator-popup .confirm_ok').show();
		} else {
			jQuery('.rec-generator-popup .confirm_ok').hide();
			jQuery('.rec-generator-popup .confirm_bad').show();
			jQuery('.rec-generator-popup .submit').attr('disabled', 'disabled');
		}
	});
	jQuery('#rec-lesson-trigger').live('click', function(){
		if(jQuery('.rec-generator-popup').css("display") == "none") {
			jQuery('.rec-generator-popup:first').show();
		}
		else {
			jQuery('.rec-generator-popup:first').hide();
		}
	});		
	
	jQuery('#rec-lessons-form .submit').live('click', function(e){
		e.preventDefault();
		var nid = jQuery('.lesson_node_id').text();
		var youtube = jQuery('.youtubelink').val();
		var comment = jQuery('.rec-comment-box').val();
		var youtubefid = jQuery('.rec-generator-popup .youtube-code').val();
		//var regExp = /(http:\/\/(www.)?(youtube.com\/watch\?v=|youtu.be\/)|<iframe.*youtube.com\/embed\/)([a-z0-9_-]+)/i
		var regExp = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{10,})/;
		if(youtube.length && youtube.match(regExp) && !youtube.match(/aaBBccDD/)) {
			jQuery.post("/rec/add-thread", {"nid":nid, "youtube":youtube, "comment":comment, "youtubefid":youtubefid}, function(response) {
				if(response == 'false'){
					alert('You have already submitted this video, please upload a new video instead.');
				}
				else {
					window.location.pathname = jQuery.trim(response);
				}
			});
			jQuery('.rec-generator-popup .confirm_ok').hide();
			jQuery('.rec-generator-popup .confirm_bad').show();
			jQuery('.rec-generator-popup .submit').attr('disabled', 'disabled');
			jQuery('.youtubelink').val('');
			jQuery('.rec-comment-box').val('');
			jQuery('.rec-generator-popup').hide();
		}
	});
	
	jQuery('#mynotes-save').live('click', function() {
		jQuery.ajax(
		{
			url : '/update-mynotes/',
			type : 'POST',
			data : {
				'notes' : jQuery('#mynotes').val(),
				'nid' : jQuery('.lesson_node_id').text()
			},
			success : function(response) {
				if(response == 'OK') {
					alert("Your notes for this lesson have been saved!");
				}
				else {
				alert(response);
					alert("Warning! Your notes have not been saved due to some error!");
				}
			},
			error : function() {
				alert("OUT = Warning! Your notes have not been saved due to some error!");
			}
		});
		return false;
	});
	/*Js code for tab legend popup.*/
	jQuery("a.tab-legend").live("click", function(){
		//tab_legend();
		jQuery(this).facebox();
	}); 
	/*JS code for Related lessons*/
	jQuery('.lesson-list li').live('mouseover', function(event) {
		jQuery(this).find('.hardness-bg, .hardness').show();
	}).live('mouseout', function(event) {
		jQuery(this).find('.hardness-bg, .hardness').hide();

	});
  jQuery('#player_box #full_screen').live("click", function(){
    var playerID = "html5videoplayer";
    var player = document.getElementById(playerID);
    player.requestFullScreen(); 
	}); 

  jQuery('.kikleft').live("click", function() {
    var cpud = jQuery('.toolstable').attr('cpud');
    if(cpud == 0) {
       jQuery('.toolstable').addClass("kikleft1");
       jQuery('.toolstable').attr('cpud', 1);
     } else if(cpud == 1) {
       jQuery('.toolstable').addClass("kikleft2");
       jQuery('.toolstable').attr('cpud', 2);
     } 
  });
    jQuery('.kikright').live("click", function() {
    var cpud = jQuery('.toolstable').attr('cpud');
    if(cpud == 1) {
       jQuery('.toolstable').removeClass("kikleft1");
       jQuery('.toolstable').attr('cpud', 0);
     } else if(cpud == 2) {
       jQuery('.toolstable').removeClass("kikleft2");
       jQuery('.toolstable').attr('cpud', 1);
     } 
  });

});

/**********************************************************/
/*************Video Play on Number key press**************/

jQuery(document).keydown(function(event) {
	var $this = jQuery(this);
	var part, keyCodes = [0, 32, 88, 37, 39, 70, 77];;
	var focused = document.activeElement;
	//var videoPlayer = document.getElementById('videoPlayer');
	$this.thisMovie = function(movieName) {
		if (navigator.appName.indexOf("Microsoft") !== -1) {
			return window[movieName];
		}
		else {
			return document[movieName];
		}
	};
	$this.videoPlayer = $this.thisMovie("videoPlayerId");
	if( window['is_bookmark_visiable'] ) {
		return ;
	}
	if(document.activeElement && document.activeElement == $this.videoPlayer) {
		if ((event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode >= 48 && event.keyCode <= 57)) {
			if (event.keyCode < 96) {
				part = event.keyCode - 48;
			}
			else {
				part = event.keyCode - 96;
			}
			jQuery('.guitar-lesson-parts-list li.part-'+part).click();
		}
		else {
			return true;
		}
	}
	if (!focused || focused == document.body) {
		if ((event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode >= 48 && event.keyCode <= 57)) {
			if (event.keyCode < 96) {
				part = event.keyCode - 48;
			}
			else {
				part = event.keyCode - 96;
			}
			jQuery('.guitar-lesson-parts-list li.part-'+part).click();
		}
		else if (jQuery.inArray(event.keyCode, keyCodes) > 0) {
			if(event.keyCode === 70){
				window.blur();
				window.focus();
			}
			$this.videoPlayer.focus();
			if (navigator.appName !== "Microsoft Internet Explorer") {
				$this.videoPlayer.sendToActionScript(event.keyCode); 
			}
			return false;
		}
	}
});



/********************************************************/

function doPlayList(listID, playerID, videourls) {
  	//var audio = jQuery('#mp3_box audio').get(0);
   // alert(audio);
   // audio.pause();
    var ev_name = App.mobile ? 'tap' : 'click';
   // alert(ev_name);
    var player = document.getElementById(playerID);
    var video = player.getElementsByTagName("video")[0];
    video.src = videourls;
   // alert(video.src);
    video.setAttribute("data-count", 0);
    video.addEventListener("ended", function (e) {
        e.preventDefault();
        var s = this.getElementsByTagName("source")[0];
        var c = parseInt(this.getAttribute("data-count")) + 1;
        var item = document.getElementById("video" + c);
        if (item === null) {
            item = document.getElementById("video0");
            c = 0;
        }
        s.src = item.getAttribute("data-loc");
        s.type = item.getAttribute("data-type");
        this.setAttribute("data-count", c);
        this.setAttribute("autoplay", "autoplay");
        this.load();
        this.play();
    });
    var list = document.getElementById(listID);
    var items = list.getElementsByTagName("li");
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.id = "video" + i;
        item.addEventListener(ev_name, function (e) {
            e.preventDefault();
            var p = document.getElementById("player");
            var v = p.getElementsByTagName("video")[0];
            var s = p.getElementsByTagName("source")[0];
            s.src = this.getAttribute("data-loc");
            v.src = this.getAttribute("data-loc");
            s.setAttribute("type", 'video/mp4');
            v.setAttribute("data-count", this.id.substr(5));
            v.setAttribute("autoplay", "autoplay");
            v.load();
            v.play();
        });
    }
}


function auidoinit(url) {
   // alert(url);
		var audio = jQuery('#mp3_box audio').get(0);
    var p = document.getElementById("html5videoplayer");
    var v = p.getElementsByTagName("video")[0];
    audio.setAttribute("src", url);
    audio.play();
    v.pause();
		loadingIndicator = jQuery('#mp3_box .progress_buffer_bar');
		positionIndicator = jQuery('#mp3_box .progress_bar');
		timeleft = jQuery('#mp3_box .progress_time');
		if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
			jQuery(audio).bind('progress', function() {
				var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
				loadingIndicator.css({width: loaded + '%'});
			});
		}
		else {
			loadingIndicator.remove();
		}
		
		jQuery(audio).bind('timeupdate', function() {
			var cnt = parseInt(audio.duration, 10),
          minst = Math.floor(cnt/60,10),
          secst = cnt - minst*60;
			var rem = parseInt(audio.currentTime, 10),
					pos = (audio.currentTime / audio.duration) * 100,
					mins = Math.floor(rem/60,10),
					secs = rem - mins*60;
      var loaded = false;
			var manualSeek = false;
			timeleft.text(minst +':'+(secst < 10 ? '0' + secst : secst) + ' / ' + mins + ':' + (secs < 10 ? '0' + secs : secs));
			if (!manualSeek) { positionIndicator.css({left: pos + '%'}); }
       
			if (!loaded) {
				loaded = true;
				
				jQuery('#mp3_box .progress_bar').slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: audio.duration,
						animate: true,					
						slide: function(){							
							manualSeek = true;
						},
						stop:function(e,ui){
							manualSeek = false;					
							audio.currentTime = ui.value;
						}
					});
			}
			
		}).bind('play',function(){
			jQuery(".play_or_pause div").addClass('playing');		
      v.pause();
		}).bind('pause ended', function() {
			jQuery(".play_or_pause div").removeClass('playing');		
		});		
		
		jQuery(".play_or_pause div").click(function() {			
			if (audio.paused) {	audio.play();	} 
			else { audio.pause(); }			
		});

}
