jQuery(document).ready(function() {
	var ev_name = App.mobile ? 'tap' : 'click';
	jQuery('.word-help').live(ev_name, function(event) {
		var wordElem = jQuery(this).clone();
		wordElem.find('span').remove();
		
		var $this = jQuery(this);
		var word = $this.attr('data-word');
		
		if ($this.data('popup')) {
			$this.data('popup').remove();
			$this.data('popup', null);
		} else if($this.data('help')) {
			handleWordHelp({
				'msg': $this.data('help')
			});
		} else {
			jQuery.ajax({
				'url' : '../key_word/'+word,
				'type' : 'POST',
				'dataType' : 'json',
				'data' : {
					'word': word
				},
				'success': handleWordHelp,
				'error': function() { }
			});
		}
		function handleWordHelp(json) {
			
			if (json.msg) {
				jQuery('.word-help-popup').find('.close-word-help').click();
				var $popup = jQuery('<div class="word-help-popup"></div>').html(json.msg).appendTo('body');
				var x = event.pageX;
				var y = event.pageY;

				var width = $popup.outerWidth();
				var height = $popup.outerHeight();

				$popup.css({
					'top': ((y-height)-20)+'px'
					, 'left': '50%'
					, 'margin-left': '-'+(((jQuery(window).width()/2)-x)+(width/2))+'px'
				});

				jQuery('<div class="close-word-help">Close</div>').appendTo($popup).click(function() {
					$this.click();
					try{
						jQuery('.word-help-popup').remove();
					}catch(e){ 
					}
				});

				$this.data('popup', $popup);
				$this.data('help', json.msg);
			}
		}

		return false;
	});
  //function defined in bottom of this file
  gmc_keyword_add();
  window.findAndReplace	= ( function(){
	
	function myFindAndReplace(self, regs, replace  ) {
		if( self.className == 'word-help' ) {
			return ;
		}
		for(var node = self.firstChild ; node; ){
			if ( node.nodeType === 3 ) {
				var val	 = String(node.data);
				var new_val  = val.replace(regs, replace);
				if ( new_val != val ) {
					var _next	= node.nextSibling ;
					    frag = (function(){
						var  wrap = document.createElement('div'),
						    frag = document.createDocumentFragment();
						wrap.innerHTML = new_val;
						while (wrap.firstChild) {
						    frag.appendChild(wrap.firstChild);
						}
						return frag;
					    })();
					
					self.insertBefore(frag, node);
					self.removeChild(node);
					node	= _next;
					continue ;
				} 
			} else if( node.nodeType === 1 ){
				arguments.callee(node, regs, replace) ;
			}
			node = node.nextSibling ;
		}
	}
	
	var iTimer	= null ;
	var regs	= [] ;
	return function ( self , regs, replace , debug ) {
		if( debug ) {
			myFindAndReplace(self, regs, replace) ;
			return ;
		}
		return jQuery(self).replaceText(regs, replace) ;
    	}
})();

jQuery.fn.replaceText = function( search, replace, text_only ) {
    return this.each(function(){
      var node = this.firstChild,
        val,
        new_val,
        remove = [];
      if ( node ) {
        do {
          if ( node.nodeType === 3 ) {
            val = node.nodeValue;
            new_val = val.replace( search, replace );
            if ( new_val !== val ) {
              if ( !text_only && /</.test( new_val ) ) {
                jQuery(node).before( new_val );
                remove.push( node );
              } else {
                node.nodeValue = new_val;
              }
            }
          }
        } while ( node = node.nextSibling );
      }
      remove.length && jQuery(remove).remove();
    });
}; 
});

/**
 * Callback function to replaced the keywords.
 **/
function gmc_keyword_add(){
	var helpWordsVal = jQuery('#word-helpers').val();

	var wordHelpers = {};
	if (helpWordsVal) {
		// Fetch all the words supplied from the server
		var helpWords = helpWordsVal.split(',');
		var helpRegexes2 = [] ;
		for(var i = helpWords.length;  i-- ; ) {
			var tmpRegex = helpWords[i].replace(/\(/g, '\(').replace(/\(/, '\(');
			if( tmpRegex.charAt(tmpRegex.length - 1).toLowerCase() == 'y' ){
				tmpRegex = tmpRegex.replace(/y$/, 'ies');
			}
			helpRegexes2.push( tmpRegex );
		}
		var helpRegexes2	=new RegExp( '(^|\\W)('+ helpRegexes2.join('|') + ')(|s|es)($|\\W)', 'ig') ;

		// Generate a cache of all the word matches as regexp
		// Loop through all the areas where we want to use word help.
		window.handle_help_word_fn	= function(elements, debug ){ 
			var cache_keys	= {} ;
			jQuery(elements).each( function( index ) {
				window.findAndReplace(this, helpRegexes2, function(ma, p1, p2, p3 ,p4 ) {
					var key	= p2.toLowerCase() ;
					if( cache_keys.hasOwnProperty(key) ) {
						return p1 + p2 + p3 + p4 ;
					}
					cache_keys[key]	= true ;
					return p1 + '<span class="word-help" data-word="'+ p2 +'" title="Click for explanation">' + p2 + p3+ '</span>' + p4 ;
					}, debug ) ; 
			}) ;
		}
		setTimeout(function(){
			window.handle_help_word_fn( jQuery('.tab-content p, .tab-content .lessontext, #bodyContent p, [id*="post-main"] .postcolor, .postcolor p, .lick-of-the-day-v2 .two-thirds p, .lick-of-the-day-v2 .one-third p, #scales-container p')  );
		}, 300);
	}
}