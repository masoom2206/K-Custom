
(function(o, properties) {
    for(var i in properties) if ( properties.hasOwnProperty(i) ) {
        o[i]    = properties[i] ;
    }
})( Element.NativeEvents , {
    loadstart: 2,
    progress: 2,
    suspend: 2,
    abort: 2,
    error: 2,
    emptied: 2,
    stalled: 2,
    play: 2,
    pause: 2,
    loadedmetadata: 2,
    loadeddata: 2,
    waiting: 2,
    playing: 2,
    canplay: 2,
    canplaythrough: 2,
    seeking: 2,
    seeked: 2,
    timeupdate: 2,
    ended: 2,
    ratechange: 2,
    durationchange: 2,
    volumechange: 2,
    touchstart:2 ,
    touchmove:2 ,
    touchend:2 ,
    readystatechange: 2 ,
    orientationchange: 2
} );
 
var GmcTap	=  function() {
	if( ! GmcAppBrowser.mobile ) return function(){};
	return new Class({
		
		Implements : [Options, Events],
		
		Binds: ['onTouchStart', 'onTouchMove' , 'cancelTouch', 'onTouchEnd' ] ,
		
		options: {
			//onSwipeleft: $empty,
			//onSwiperight: $empty,
			refire: 0 ,
			timeout: 800 ,
			tolerance: 20 ,
			preventDefaults: true
		},
		
		element: null,
		position: {
			x: 0 , y: 0
		},
		isMoving: false ,
		isEnded: false ,
		iTimer: null ,
		
		initialize: function(el, options) {
			this.setOptions(options);
			this.element = document.id(el);
			this.element.addEvent('touchstart', this.onTouchStart);
		},
		
		cancelTouch: function() {
			this.element.removeEvent('touchmove', this.onTouchMove);
			this.element.removeEvent('touchend', this.onTouchEnd);
			this.position.x 	= 0 ;
			this.position.y 	= 0 ;
			this.isMoving 	= false;
			if( this.iTimer ) {
				clearTimeout(this.iTimer) ;
			}
			this.iTimer	= null ;
			if( !this.isEnded ) {
				this.fireEvent('onEnd', [ false ] );
			}
			this.isEnded	= false ;
		} ,
		
		onTouchEnd: function( evt ) {
			this.isEnded	= true ;
			this.cancelTouch() ;
			if( !evt ) return ;
			if( this.options.preventDefaults ) {
				evt.preventDefault();
				evt.stopPropagation();
			}
			this.fireEvent('onEnd', [ evt, true ] ) ;
		} ,
		
		onTouchMove: function(e) {
			if ( e.touches.length > 1 ) {
				this.cancelTouch() ;
				return ;					
			}
			
			if ( this.isMoving ) {
                /*
                if( this.options.preventDefaults ) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                */
                
				var dx = this.position.x - e.touches[0].pageX ;
				var dy = this.position.y - e.touches[0].pageY ;
				var dz	= Math.sqrt( dx * dx + dy * dy ) ;
				if ( dz > this.options.tolerance ) {
					this.cancelTouch() ;
				} else {
					if( this.use_refire ) {
						if( !this.already_refire  && dz > this.options.refire ) {
							this.fireEvent('onEnd', [ evt, false ] ) ;
							this.already_refire = true ;
						}
					} 
				}
			}
		},
		
		onTouchStart: function(e) {
			if (e.touches.length == 1) {
                /*
                if( this.options.preventDefaults ) {
                    e.preventDefault();
                    e.stopPropagation();
                }*/
                
				this.position.x = e.touches[0].pageX;
				this.position.y = e.touches[0].pageY;
				this.isEnded	= false ;
				this.use_refire		= this.options.refire	> 0 ;
				this.already_refire	= false  ;
				this.isMoving = true;
				this.fireEvent('onStart');
				this.element.addEvent('touchmove', this.onTouchMove);
				this.element.addEvent('touchend', this.onTouchEnd);
				this.iTimer	= setTimeout( this.cancelTouch,  this.options.timeout );
			}
		}
	});
} ;

var GmcPlayer	=( function() {
    
	return new Class({
		
		Implements : [Options, Events],
		
		options : {
			lesson_id: null ,
			lesson_part: null ,
			lesson_lotd: null 
		} ,
		
		try_skip_load: false ,
		
		initialize: function(target, options) {
			var _target	= document.id(target) ;
			if( !_target) {
				throw new Exception('target is null');
			}
			this.setOptions(options);
            ( function() {
                var lesson_data = String(  _target.className ) ;
                /lessonId\:\s*(\d+)/.test(lesson_data) ;
                this.options.lesson_id  = RegExp.$1  ; 
                var url = '/html5player/html5player2.php?id=' + this.options.lesson_id + '&app_version=' + GmcAppBrowser.app_version  ;
				if(  GmcAppBrowser.is_gmc_admin ) {
						url	+= "&app_admin=1" ;
				}
                this.options.lesson_lotd  = false  ; 
                if( /lotd/.test(lesson_data) ) {
                    this.options.lesson_lotd  = true  ; 
                    url +=  '&lotd';
                }
                this.box_container	= new Element('iframe', {
                    'frameborder': 0 ,
                    'marginheight': 0 ,
                    'marginwidth': 0 ,
                    'scrolling': 'no',
                    'src': url 
                });
            }).call(this);
            
            var body    = document.id( document.body ) ;
			this.build() ;
            
            var reLayout    = ( function( body, target, container , use_lesson_lotd ) {
			var width   = target.getWidth() ;
			var height   = target.getHeight() ;
			var gmc_content = document.id('gmc-content');
			var content_half_width   = gmc_content.getWidth() / 2  ;
			
			var is_force_view   = false ;
			if( GmcAppBrowser.mobile ) {
			    var w = screen.width ;
			    var h = screen.height ;
			    if( w > h ) {
				w   = h ;
				h   = screen.width ;
			    }
			    if( w >= 460 && h >= 590 ) {
				is_force_view   = true ;
			    }
			    // return ;
			}
				var viewport_width	= 'device-width' ;
				
				
				window['GmcHtml5PlayerReLayout'] = ( function(){
						var win	= window ;
						var view	= jQuery('meta[name="viewport"]' ) ;
						return  function( i ) {
								(function(){
										if( is_force_view ) {
												jQuery('meta[name="viewport"]' ).attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no') ;
										} else {
												jQuery('meta[name="viewport"]' ).attr('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no') ;
										}
								}).call(win, i) ;
						};
				})();
			/*
			jQuery('body').bind('vclick', function(){
				alert([  window.innerWidth, window.outerWidth, jQuery('html').width(), jQuery('body').width(), screen.width , jQuery(gmc_content).width()  ])
			});
			*/
			// alert([  window.innerWidth, window.outerWidth, jQuery('html').width(), jQuery('body').width(), screen.width , jQuery(gmc_content).width()  ])
				 
                return function( is_debug ){
						if( body.hasClass('GmcHtml5PlayerFullScreeen') ) {
								container.setStyles({
										'top': 0 , 
										'left': 0 ,
										'width': '100%',
										'height': '100%',
										'margin-left': 0 
								});
								if( is_force_view ) {
									jQuery('meta[name="viewport"]' ).attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no') ;
								} else {
									jQuery('meta[name="viewport"]' ).attr('content', 'width=device-width, initial-scale=0.5, maximum-scale=5, minimum-scale=0.5, user-scalable=no') ;
								}
								return ;
						}
				   		 
						var _left 	= target.getPosition( gmc_content ) ;
						var left   	= _left.x    - content_half_width ; 
						var _top 	= target.getPosition( body ) ;
						var top  	= _top.y ;
						var _css	= {
							'top': top , 
							'margin-left': left ,
							'left': '50%' ,
							'width':  width ,
							'height': height 
						} ;  
						_css.left	= _top.x  ;
						_css['margin-left']	= 0 ;
						// alert([ JSON.stringify( jQuery(target).position() ) , JSON.stringify( _css ) ]);
						if( GmcAppBrowser.mobile  ) {
							if( GmcAppBrowser.name == 'safari'  ) {
								
							}
						} else {
							if( use_lesson_lotd && 0 ) {
								_css.top  += 14 ;
							}
						}
						//alert([  GmcAppBrowser.name, window.innerWidth, window.outerWidth, jQuery('html').width(), jQuery('body').width(), screen.width , jQuery(gmc_content).width()  ]) 
						container.setStyles( _css ) ;
						
						if( is_force_view ) {
								jQuery('meta[name="viewport"]' ).attr('content', 'user-scalable=yes') ;
						} else {
								jQuery('meta[name="viewport"]' ).attr('content', 'width=device-width, initial-scale=0.5, maximum-scale=2, minimum-scale=0.1, user-scalable=yes') ;
						}
                } ;
            })( body, _target,  this.box_container, this.options.lesson_lotd ) ;
	    	
		(function(){
			reLayout() ;
			var counter	= 4 ;
			var timer	= setTimeout(function(){
				if( --counter > 0 ) {
					reLayout() ;	
				} else {
					timer	= null ;
				}
			} , 200 ) ;
			jQuery(window).bind('load', function(){
				if( timer )  clearTimeout(timer);
				reLayout();
			} ).bind('resize', reLayout) ;
		})();
		    
            this.box_container.inject( body , 'top');
            this.win    = this.box_container.contentWindow || this.box_container.contentDocument ;
            
            window['GmcHtml5PlayerTryLoadPart'] = function(i) {
					var es	= jQuery('.guitar-lesson-parts-list>li');
					if( i >= 0 && i < es.length ) {
						jQuery(es[i]).click() ;
					}
			};
            window['toggleGmcHtml5PlayerFullScreeen']   =  ( function(){
					var win	= window ;
					return function() {
						if( 1 || GmcAppBrowser.mobile  ) {
								body.toggleClass('GmcHtml5PlayerFullScreeen') ;
								reLayout.call(win, 1) ;
								// setTimeout( reLayout, 10 ) ;
						} else {
							
						}
					}; 
			})();
		} , 
		
		build: function() {
			this.box_container.addClass('GmcHTML5PlayerContainer') ;
		} ,
        
		loadLessonParts: function() {
			var url	= '/actions/getlessonpartslist/' + this.options.lesson_id ;
			if(  this.use_lotd_player ) {
				url	+= '?lotd=1'
			}
			var req	= new Request({
				url: url ,
				onComplete: function( txt ) {
					var  o ;
					try{
						o	= JSON.decode(txt) ;
					}catch(e){
						console.log(txt);	
						return ;
					}
					alert( JSON.encode(o) )
				}.bind(this)
			});
			req.send();
		} ,
		
		loadLessonPart :  function( i ) {
             this.win.LoadLessonPart(i, true ) ;
		} 
	});
})();




 