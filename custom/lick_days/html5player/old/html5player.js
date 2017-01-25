
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
    var is_load_first_part  = false ;
	var is_mobile	= GmcAppBrowser.mobile ;
	var is_ipad	= GmcAppBrowser.is_ipad ;
	var is_iphone	= GmcAppBrowser.is_iphone ;
	var is_ipod	= GmcAppBrowser.is_ipod ;
	var is_android	= GmcAppBrowser.is_android  ;
	var cookie_options	= { duration: 111111111111111, secure:false };
	var left_right_position_cache	= {} ;
	var flag_timer , flag_handle ;
	var flag_hide = flag_show = function(){}; 
	var body_mask	= (function(){
		var _mask	= null ;
		var iTimer	= null ;
		function doHide(){
			iTimer	= null ;
			_mask.setStyle( 'display', 'none' ) ;
		};
		return function() {
			if( !_mask ) {
				_mask = new Element('div', {
					'styles' : {
						'width': '100%' ,
						'height': '100%' ,
						'background': '#fff' ,
						'display': 'block' ,
						'position': 'absolute', 
						'top': 0 ,
						'left': 0 ,
						'z-index': 999 ,
						'opacity': 0.8
					} ,						
				} ) ;
				document.id( document.body ) .adopt( _mask ) ;
			}
			_mask.setStyle( 'display', 'block' ) ;
			if( iTimer ) clearTimeout(iTimer);
			iTimer	= setTimeout( doHide, 300 ) ;
		};
	});
	 
	var GmcSwipe	=  function(){
		if( !is_mobile ) return function(){};
		return new Class({
			
			Implements : [Options, Events],
			
			Binds: ['onTouchStart', 'onTouchMove',  'onTouchEnd',  'cancelTouch' ],
		 
			options: {
				//onSwipeleft: $empty,
				//onSwiperight: $empty,
				refire: 0 , 
				tolerance: 20 ,
				preventDefaults: true
			},
			
			element: null,
			startX: null,
			isMoving: false,
			
			initialize: function(el, options) {
				this.setOptions(options);
				this.element = document.id(el);
				
				this.element.addEvent('touchstart', this.onTouchStart);
			},
			
			cancelTouch: function() {
				this.element.removeEvent('touchmove', this.onTouchMove);
				this.startX = null;
				this.isMoving = false;
				this.element.removeClass('gmc_html5_player_on_touch' );
				// console.log('touch cancel ');
			},
			
			onTouchEnd: function(e) {
				
			} ,
			
			onTouchMove: function(e) {
				this.options.preventDefaults && e.preventDefault();
				if (this.isMoving) {
					var x = e.touches[0].pageX;
					var dx = this.startX - x;
					var _dx	= Math.abs(dx) ;
					if (  _dx >= this.options.tolerance ) {
						var event	= dx > 0 ? 'swipeleft' : 'swiperight' ;
						if( this.use_refire ) {
							if( this.already_refire ) {
								if ( _dx > this.options.refire ) {
									this.cancelTouch();
									this.fireEvent( event, [e, true] );
								}
							} else {
								this.fireEvent( event, [e, false ] );
								this.already_refire	= true ;
							}								
						} else {
							this.cancelTouch();
							this.fireEvent( event, [e] );
						}
					}
				}
			},
			
			onTouchStart: function(e) {
				if (e.touches.length == 1) {
					this.use_refire		= this.options.refire	> 0 ;
					this.already_refire	= false  ;
					this.startX = e.touches[0].pageX;
					this.isMoving = true ;
					this.element.addClass('gmc_html5_player_on_touch' );
					this.element.addEvent('touchmove', this.onTouchMove );
				}
			}
		});
	} ;
    
	var GmcSlider = new Class({

		Implements: [Events, Options],

		Binds: ['getValue', 'setPercentageValue', 'whenTouchStart', 'whenTouchMove', 'whenTouchEnd'],

		options: {/*
			onTick: function(intPosition){},
			onChange: function(intStep){},
			onComplete: function(strStep){},*/
			maxValue: 0 ,
			snap: false,
			wheel: true,
			offset: 0,
			mode: 'horizontal'
		},

		initialize: function(element, knob, options){
			this.setOptions(options);
			options = this.options;
			this.element = document.id(element);
			knob = this.knob = document.id(knob);
			this.previousChange = this.previousEnd = this.step = -1;
			
			var limit = {},
				modifiers = {x: false, y: false};
				
			switch (options.mode) {
				case 'vertical':
					this.axis = 'y';
					this.property = 'top';
					this.offset = 'offsetHeight';
					break;
				case 'horizontal':
					this.axis = 'x';
					this.property = 'left';
					this.offset = 'offsetWidth';
			}
			
			
			this.minValue	= 0 ;
			this.maxValue	= this.options.maxValue || this.element.getWidth() ;
			var value	= knob.getPosition(this.element)[ this.axis  ]  - parseInt( knob.getStyle('margin-' + this.property ) ) ;
			knob.setStyle(this.property, value) ;
			
			modifiers[this.axis] = this.property ;
			limit[this.axis] = [ this.minValue -options.offset , this.maxValue - options.offset ] ;
			
			this.isDragging = false;
			
			if( is_mobile ) {  
				return ;
			}
			
			var dragOptions = {
				snap: 0,
				limit: limit,
				modifiers: modifiers,
				preventDefault: true ,
				onDrag: (function(el, evt){
					var value	= parseInt( el.getStyle( this.property ) ) || 0  ;
					this.fireEvent('drag', [ value , evt] ) ;
				}).bind(this),
				onStart: (function(){
					var value	= parseInt( this.knob.getStyle( this.property )  ) || 0 ;
					this.startValue	= value ;
					this.fireEvent('start') ;
				}).bind(this),
				onBeforeStart: (function(){
					this.isDragging = true;
					this.fireEvent('beforeStart');
				}).bind(this),
				onCancel: function(){
					this.isDragging = false;
				}.bind(this),
				onComplete: function(){
					this.isDragging = false ;
					this.fireEvent('complete',  [ this ] );
				}.bind(this)
			};
			
			this.drag = new Drag(knob, dragOptions);
		} ,
		
		whenTouchStart: function(evt) {
			if ( evt.touches.length != 1) {
				return ;
			}
			var t = evt.targetTouches[0];
			this.touchPosition  = {
				x: t.pageX ,
				y:  t.pageY
			};
			var value	= parseInt( this.knob.getStyle( this.property )  ) || 0 ;
			this.touchPosition.value	=  value ; 
			//console.log( ['start', this.touchPosition[ this.axis],   value  ] ) ;
			this.isDragging	= true ;
			// this.fireEvent('beforeStart');
			this.fireEvent('start', [ value , evt] ) ;
		} ,
		whenTouchMove: function(evt){
			if( !this.isDragging ) {
				return ;
			}
			evt.preventDefault();
			evt.stopPropagation();
			var t = event.targetTouches[0];
			if(t == null){
				return;
			}
			var lastTouchPosition	= {
				x: 	 t.pageX ,
				y :  t.pageY
			};
			var delta	=  lastTouchPosition[this.axis] - this.touchPosition [this.axis] ;
			var _value	=  this.touchPosition.value	+ delta ;
			this.lastTouchPosition	= lastTouchPosition ;
			if( _value < this.minValue ) { 
				_value	= this.minValue ;
			} else if( _value > this.maxValue ) {
				
			}
			this.knob.setStyle( this.property , _value ) ;
			//console.log( ['move', lastTouchPosition[ this.axis],  this.setPercentageValue() ] );
			this.fireEvent('drag', [ _value , evt] ) ;
		} ,
		whenTouchEnd: function(evt){
			if( !this.isDragging ) {
				return ;
			}
			this.isDragging	= false  ;
			//console.log( ['end'] );
			this.fireEvent('complete', [ this , evt] ) ;
		} ,
		
		setValue: function( value ) {
			if( value < this.minValue ) value = this.minValue ;
			else if( value > this.maxValue ) value = this.maxValue ;
			this.knob.setStyle(this.property, value) ;
			return this ;
		} ,
		
		getValue: function(){
			var value	= parseInt( this.knob.getStyle( this.property )  ) || 0 ;
			return value ;
		},
		
		setPercentageValue: function( value ) {
			var _value	= value * this.maxValue ;
			return this.setValue(_value) ;
		} ,
		
		getPercentageValue: function() {
			var value	= this.getValue() ;
			return ( value / this.maxValue )  ;
		} ,
		
		getPercentageValueByValue: function( value ) {
			return ( value / this.maxValue )  ;
		} ,
		
		detach: function(){
			if( is_mobile ) { 
				// console.log('detach');
				this.knob.removeEvent("touchstart", this.whenTouchStart  );
				this.knob.removeEvent("touchmove", this.whenTouchMove  );
				this.knob.removeEvent("touchend", this.whenTouchEnd  );
			} else {
				this.drag.detach();
			}
		} ,
		attach: function(){
			if( is_mobile ) { 
				this.knob.addEvent("touchstart", this.whenTouchStart  );
				this.knob.addEvent("touchmove", this.whenTouchMove );
				this.knob.addEvent("touchend", this.whenTouchEnd  );
			} else {
				this.drag.attach();
			}
		} ,
	});
	
	var VoiceBar	= is_mobile ? null : new Class({
		
		Implements : [Options, Events],
		
		options : {
			elements: [] ,
		} ,
		
		initialize: function( parent, options) {
			this.setOptions(options);
			this.build(parent);
			this.setValue( 1 ) ;
			this.drag.setPercentageValue(1) ;
		} ,
	
		build: function(parent) {
			
			this.box_voice_bar_box	= new Element('div', {
				'class': 'gmc_html5player_voice_bar_box' 
			});
			parent.adopt( this.box_voice_bar_box) ;
			
			this.box_voice_bar_speaker_bg	= new Element('div', {
				'class': 'gmc_html5player_voice_bar_speaker_bg' 
			});
			this.box_voice_bar_box.adopt( this.box_voice_bar_speaker_bg) ;
			
			this.box_voice_bar_speaker_bar	= new Element('div', {
				'class': 'gmc_html5player_voice_bar_speaker_bar' 
			});
			this.box_voice_bar_speaker_bg.adopt( this.box_voice_bar_speaker_bar) ;
			
			this.box_voice_bg	= new Element('div', {
				'class': 'gmc_html5player_voice_bg' 
			});
			this.box_voice_bar_box.adopt( this.box_voice_bg) ;
			
			
			this.box_bar_container	= new Element('div', {
				'class': 'gmc_html5player_voice_bar_container' 
			});
			this.box_voice_bar_box.adopt(this.box_bar_container);
			
			this.box_bar_inner_container	= new Element('div', {
				'class': 'gmc_html5player_voice_bar_inner_container' 
			});
			this.box_bar_container.adopt(this.box_bar_inner_container);
			
			this.box_position	= new Element('a', {
				'class': 'gmc_html5player_voice_position' , 
				styles:{
					'cursor': 'pointer',
					left: '0%'
				}
			});
			this.box_bar_inner_container.adopt(this.box_position);
			
			
			this.box_voice_bar_speaker	= new Element('div', {
				'class': 'gmc_html5player_voice_bar_speaker' 
			});
			this.box_voice_bar_box.adopt(this.box_voice_bar_speaker);
			
			this.setValue	= function( value, with_progress_bar ) {
				this.box_voice_bar_speaker_bar.setStyle( 'width', value * 100 + '%' ) ;
				this.options.elements.each(function(o) {
					o.volume	= value ;
				});
				if( with_progress_bar ) {
					this.drag.setPercentageValue( value ) ;
				}
			} ;
			
			var is_muted	= false;
			var muted_volume	= 0 ;
				
			this.box_voice_bar_speaker.addEvent('click', function(evt){
				if( is_muted  ) {
					is_muted	= false ;
					this.options.elements.each(function(o) {
						o.muted	= false ;
					});
					this.setValue(muted_volume, true ) ;
				} else {
					if( this.options.elements.length ) {
						muted_volume	= this.options.elements[0].volume   ;
					}
					is_muted	= true ;
					this.options.elements.each(function(o) {
						o.muted	= true ;
					});
					this.setValue(0, true ) ;
				}
			}.bind(this) );
			
			var drag_options	= {
				onDrag : function() {
					var value	= this.drag.getPercentageValue() ;
					if( is_muted ) {
						is_muted	= false ;
						this.options.elements.each(function(o) {
							o.muted	= false ;
						});
					}
					// console.log(value, ' this.media.volume=', this.media.volume);
					this.setValue( value ) ;
				}.bind(this) ,
				onComplete: function() {
					var value	= this.drag.getPercentageValue() ;
					this.options.elements.each(function(o) {
						o.volume	= value ;
					});
					// setCookie cache
				}.bind(this) 
			} ;
			var drag	= this.drag =  new GmcSlider( this.box_bar_inner_container, this.box_position , drag_options ); 
		} 
		
	}) ;
	
	var ProgressBar	= new Class({
		
		Implements : [Options, Events],
		
		Binds: ['updateProgress', 'load' , 'onDragProgressBar' , 'load', 'onDragStart' ],
		
		options : {
			is_mp4: false ,
			is_mp3: false ,
			is_metronome: false
		} ,
		
		initialize: function(player, parent, media, options){
			this.player = player ;
			this.setOptions(options);
			
			this.parent		=  parent ;
			this.media		= document.id(media) ;
			this.source		= null ;
			this.isFocus		= false ;
			this.loaded		= false ;
			this.duration		= 0 ;
			this.autoplay		= false ;
			this.rounded		= false ;
			this.try_play		= false ;
			this.try_autostop 	= false ;
			this.try_stop		= false ;
			
			if( this.options.is_mp4 || this.options.is_mp3  ) {
				this.buildProgressBar( parent ) ;
			} else { 
				this.buildMetronome( parent ) ;
			} 
		}  ,
		
		buildProgressBar: function( parent ) {
			this.box_timer	= new Element('div', {
				text: '00:00 / 00:00',
				'class': 'gmc_html5player_time'
			}) ;
			parent.adopt( this.box_timer );
			
			this.box	= new Element('div', {
				'class': 'gmc_html5player_progress_box'
			});
			parent.adopt(this.box);
			
			this.use_play_or_pause	= !( is_mobile && this.options.is_mp4 ) ;
			
			if( this.use_play_or_pause ) {
				this.play_or_pause	= new Element('div', {
					'class': 'gmc_html5player_play_or_pause' 
				});
				parent.adopt(this.play_or_pause);
				this.play_or_pause.adopt(new Element('div', {
					styles:{
						opacity: 0.5
					}
				}));
				this.play_or_pause.adopt(new Element('a', {
					styles:{
						'cursor': 'pointer'
					}
				}));
			}
			
			this.box_bar_container	= new Element('div', {
				'class': 'gmc_html5player_progress_bar_container' 
			});
			this.box.adopt(this.box_bar_container);
			
			this.box_bar_inner_container	= new Element('div', {
				'class': 'gmc_html5player_progress_bar_inner_container' 
			});
			this.box_bar_container.adopt(this.box_bar_inner_container);
			
			this.box_bg_bar	= new Element('div', {
				'class': 'gmc_html5player_progress_bg_bar' 
			});
			this.box_bar_inner_container.adopt(this.box_bg_bar);
			
			this.box_buffer_bar	= new Element('div', {
				'class': 'gmc_html5player_progress_buffer_bar' ,
				styles:{
					opacity: 0.7,
					width: '0%'
				}
			});
			this.box_bar_inner_container.adopt(this.box_buffer_bar);
			
			this.box_bar	= new Element('div', {
				'class': 'gmc_html5player_progress_bar' ,
				styles:{
					opacity: 0.7,
					width: '0%'
				}
			});
			this.box_bar_inner_container.adopt(this.box_bar);
			
			this.box_left_flag	= new Element('div', {
				'class': 'gmc_html5player_progress_flag' ,
				'html': '&nbsp;'
			});
			this.box.adopt(this.box_left_flag);
			
			this.box_right_flag	= new Element('div', {
				'class': 'gmc_html5player_progress_flag' , 
				'html': '&nbsp;' ,
				styles:{
					left: '100%'
				}
			});
			this.box.adopt(this.box_right_flag);
			
			( function(flag){
				flag.setStyle('display', 'none');
				var bg	= new Element('a', {
					styles: {
						opacity: 0 ,
						'dispkay': 'block',
						'width':'100%',
						'height': '100%' ,
						'background-color': '#fff' ,
						'position': 'absolute', 
						'top': 0,
						'left': 0
					}
				});
				flag.adopt(bg); 
				flag.adopt( new Element('div', {
					styles: {
						'dispkay': 'block',
						'width':'100%',
						'height': '100%' ,
						'position': 'absolute', 
						'top': 0,
						'left': 0
					}
				}) );
				return arguments.callee;
			})(this.box_right_flag)(this.box_left_flag);
			
			
			this.box_position	= new Element('div', {
				'class': 'gmc_html5player_progress_position' , 
				styles:{
					left: '0%'
				}
			});
			this.box_bar_inner_container.adopt(this.box_position);
			
			var drag	=  this.drag = new GmcSlider( this.box_bar_container, this.box_position , {
				    	onComplete:  this.onDragProgressBar ,
					    onStart:  this.onDragStart
				});
			var left_drag	=  this.left_drag  = new GmcSlider( this.box_bar_container, this.box_left_flag , {
				    onDrag: function(value ){
					var _value	= right_drag.getValue()  ;
					if( value > _value) {
						right_drag.setValue(value) ;
					}
				    },
				    onStart: flag_hide
				});
			var right_drag	=  this.right_drag  =  new GmcSlider( this.box_bar_container, this.box_right_flag, {
				     onDrag: function(value ){
					var _value	= left_drag.getValue()  ;
					if( value < _value ) {
						left_drag.setValue(value)
					}
				    },
				    onStart: flag_hide
				});
			var flag_events	= {
				mouseenter: function(evt) {
					if( left_drag.isDragging || right_drag.isDragging ) {
						return ;
					}
					flag_show(evt.target);
				} ,
				mouseleave: flag_hide
			} ;
			
			this.box_left_flag.addEvents(flag_events);
			this.box_right_flag.addEvents(flag_events);
			 
			// bind events 
			if( this.use_play_or_pause )  {
				this.play_or_pause.addEvent('click', function(){
					// console.log( [ 'play_or_pause click ,  ', this.media.className , 'this.loaded =', this.loaded  , ' duration=',  this.media.duration] )
					// if( !this.loaded )  return ; 
					if( this.play_or_pause.hasClass('gmc_html5player_play_or_pause_true') ) {
						this.media.pause() ;
					} else {
						this.isFocus	= true ;
						this.play() ;
					}
				}.bind(this) );
			}
			
			this.box_bg_bar.addEvent('click', function(evt){
				if( !this.loaded ) {
					return ;
				}
				var value	= evt.event.offsetX ;
				var _value	= drag.getPercentageValueByValue(value) ; 
				var time	= _value * this.duration ;
				if( !this.media.paused ) {
					this.play() ;
				}
				this.media.currentTime	= time ;
			}.bind(this) );
			this.box_buffer_bar.addEvent('click', function(evt){
				if( !this.loaded ) {
					return ;
				}
				var value	= evt.event.offsetX ;
				var _value	= drag.getPercentageValueByValue(value) ; 
				var time	= _value * this.duration ;
				if( ! this.media.paused ) {
					this.play() ;
				}
				this.media.currentTime	= time ;
			}.bind(this) );
			this.box_bar.addEvent('click', function(evt){
				if( !this.loaded ) {
					return ;
				}
				var value	= evt.event.offsetX ;
				var _value	= drag.getPercentageValueByValue(value) ; 
				var time	= _value * this.duration ;
				if( ! this.isPlay() ) {
					this.play() ;
				}
				this.media.currentTime	= time ;
			}.bind(this) );
			
			this.media.addEvents({
				canplay: function(){
					// console.log([ 'canplay', this.media.className])
				}.bind(this) ,
				play: function(){
					if( this.use_play_or_pause )
						this.play_or_pause.addClass('gmc_html5player_play_or_pause_true');
					this.isFocus	= true ;
					if( !this.try_play ) {
						this.fireEvent('play' , [ this.media ] );
					} else {
						this.try_play	= false ;
					}
					
					if( this.options.is_mp4 ) {
						console.log(['play',   this.getStatus() ] )
					}
				}.bind(this) ,
				playing: function(){
					if( this.options.is_mp4 ) {
						console.log(['playing',  this.getStatus()  ] )
					}
					this.fireEvent('play' , [ this.media ] );
				}.bind(this) ,
				waiting: function(){
					if( this.options.is_mp4 ) {
						console.log(['waiting',  this.getStatus(), this.media.get('html') ] )
					}
					this.fireEvent('stop');
				}.bind(this) ,
				seeking: function(){
					if( this.options.is_mp4 ) {
						console.log(['seeking',  this.getStatus()  ] )
					}
					// this.fireEvent('stop');
				}.bind(this) ,
				pause: function(){
					if( this.use_play_or_pause )
						this.play_or_pause.removeClass('gmc_html5player_play_or_pause_true');
					if( !this.try_stop ) {
						this.fireEvent('stop');
						if( this.options.is_mp4 ) {
							console.log(['pause',  'not with try stoped',    this.getStatus()  ] )
						}
					} else {
						this.try_stop	= false ;
						if( this.options.is_mp4 ) {
                            this.options.box_container.addClass('gmc_html5player_mp4_stoped') ;
							console.log(['pause',  ' with try stoped' ,  this.getStatus() , this.options.box_container.className ] )
						}
					}
				}.bind(this) ,
				durationchange: function(evt){
					//console.log([ 'durationchange', this.media.className ])
					this.duration	= this.media.duration ;
					this.updateTime(  this.media.currentTime , this.duration );
				}.bind(this) ,
				readystatechange: function(){
					//console.log([ 'readystatechange' , this.media.className ])
				}.bind(this) , 
				loadstart: function(){
					//console.log([ 'loadstart' , this.media.className ])
				}.bind(this) , 
				loadedmetadata: function(evt){
					//console.log( 'loadedmetadata this.loaded=true, media=' ,  this.media.className  );
					// v.currentTime , v.defaultMuted , v.duration ,  v.initialTime , v.muted ,  v.ended , v.paused , v.seeking , v.volume, v.accessKey
					// console.log([ 'loadedmetadata', this.media.className ])
					this.loaded	= true ;
					this.duration	= this.media.duration ;
					this.drag.attach() ;
					this.left_drag.attach() ;
					this.right_drag.attach() ;
					
					this.updateProgress();
					if( this.autoplay ) {
						this.media.play();
					}
				}.bind(this) ,
				loadeddata: function(evt){
					//console.log( 'loadeddata' );
					var time	= this.media.buffered.end(0)  ;
					var value	= this.duration ? time / this.duration : 0  ;
					this.box_buffer_bar.setStyle('width', value * 100 + '%' );
				}.bind(this) ,
				timeupdate:  function(evt){
                    if( this.options.is_mp4 && this.options.box_container ) {
					    this.options.box_container.removeClass('gmc_html5player_mp4_stoped') ;
                    }
                    this.updateProgress(evt);
                }.bind(this)  ,
				progress:  this.updateProgress ,
				suspend: function(evt){
				    	// console.log( ['suspend', this.media.className,  this.media.networkState, this.media.error, evt] );
					if( this.options.is_mp4 ) {
				    		console.log(['suspend',   this.getStatus()  ] )
					}
					this.fireEvent('stop');
				}.bind(this) ,
				abort: function(evt){
					if( this.options.is_mp4 ) {
				    		console.log(['abort',   this.getStatus()  ] )
					}
					this.fireEvent('stop');
				}.bind(this) ,
				error: function(){
					if( this.options.is_mp4 ) {
				    		console.log(['error',   this.getStatus()  ] )
					}
					this.fireEvent('stop');
				}.bind(this) ,
				emptied: function(){
					if( this.options.is_mp4 ) {
				    		console.log(['emptied',  this.getStatus() ] )
					}
					this.fireEvent('stop');
				}.bind(this) 
			});
		} ,
		
		getStatus : function () {
			return ' {' + this.getNetwordStatus() + ', '  +  this.getReadyStatus()  + ', ' + this.getError()  + ' } ';
		} ,
		
		getNetwordStatus: function(){
			switch( this.media.networkState ) {
				case this.media.NETWORK_EMPTY:
					return 'NETWORK_EMPTY';
				case this.media.NETWORK_IDLE:
					return 'NETWORK_IDLE';
				case this.media.NETWORK_LOADING:
					return 'NETWORK_LOADING';
				case this.media.NETWORK_NO_SOURCE:
					return 'NETWORK_NO_SOURCE';
				default:
					return 'NETWORK_' + this.media.networkState  ;
			};				
		} ,
		getReadyStatus: function(){
			switch( this.media.readyState ) {
				case this.media.HAVE_NOTHING:
					return 'HAVE_NOTHING';
				case this.media.HAVE_METADATA :
					return 'HAVE_METADATA';
				case this.media.HAVE_CURRENT_DATA:
					return 'HAVE_CURRENT_DATA';
				case this.media.HAVE_FUTURE_DATA:
					return 'HAVE_FUTURE_DATA';
				case this.media.HAVE_ENOUGH_DATA:
					return 'HAVE_ENOUGH_DATA';
				default:
					return 'READY_' + this.media.networkState  ;
			};				
		} ,
		
		getError: function(){
			if( ! this.media.error ) {
				return 0 ;
			}
			switch( this.media.error.code ) {
				case this.media.error.MEDIE_ERR_ABORTED :
					return 'MEDIE_ERR_ABORTED';
				case this.media.error.MEDIE_ERR_NETWORK :
					return 'MEDIE_ERR_NETWORD';
				case this.media.error.MEDIE_ERR_DECODE :
					return 'HAVE_CURRENT_DATA';
				case this.media.error.MEDIE_ERR_SRC_NOT_SUPPORTED:
					return 'MEDIE_ERR_SRC_NOT_SUPPORTED';
				default:
					return 'ERROR_' +  this.media.error.code   ;
			};				
		} ,
		buildMetronome: function( parent ) {
			
			var play_or_pause	= new Element('div', {
				'class': 'gmc_html5player_mp3_play_or_pause'
			});
			
			play_or_pause.adopt(new Element('div', {
				'styles':{
					'position': 'absolute' , 'top': 0 , left: 0 , 
					width:'100%', height:'100%', opacity: 0.4 ,
					'background':'#fff', 'font-size': 12 ,
					'border': '2px solid #fff' 
				}
			}) );
			
			this.play_or_pause	= new Element('a', {
				styles:{
					'cursor': 'pointer'
				},
				'text': 'start'
			}) ;
			play_or_pause.adopt(this.play_or_pause);
			
			parent.adopt(play_or_pause);
			
			this.mp3_box	= new Element('a', {
				'class': 'gmc_html5player_voice_mp3_box' 
			});
			parent.adopt(this.mp3_box);
			
			this.box_left_number	=  new Element('a', {
				'class': 'gmc_html5player_voice_btn_box gmc_html5player_voice_btn_left_box' , 
				styles:{
					'cursor': 'pointer',
					left: '0%'
				}
			});
			this.box_left_number.adopt(new Element('div', {
				'styles':{
					opacity: 0.6
				}
			}) );
			this.box_left_number.adopt(new Element('span', {
				
			}) );
			this.mp3_box.adopt(this.box_left_number);
			this.box_right_number	=  new Element('a', {
				'class': 'gmc_html5player_voice_btn_box gmc_html5player_voice_btn_right_box' , 
				styles:{
					'cursor': 'pointer',
					left: '100%' , 'margin-left': -16
				}
			});
			this.box_right_number.adopt(new Element('div', {
				'styles':{
					opacity: 0.6
				}
			}) );
			this.box_right_number.adopt(new Element('span', {
				
			}) );
			this.mp3_box.adopt(this.box_right_number);
			
			this.box_input_box	= (new Element('input', {
				'max-length': 3
			}) );
			this.mp3_box.adopt(this.box_input_box);
			
			var value_range	= [30, 120, 230 ];
			var cookie_key	= '$gh5m' ;
			this.getMetronomeValue	= function ( load_from_cookie ) {
				var _value	= null  ;
				if( load_from_cookie ) {
					_value	= Cookie.read(cookie_key);
				} else {
					_value	= this.box_input_box.get('value') ;
				}
				if( _value && _value.trim() != '' ) {
					_value	= parseInt(_value) ;
					if( _value < value_range[0]  || _value > value_range[2] ) {
						_value	= value_range [1] ;
					}
				} else {
					_value	= value_range[1] ;
				}
				return _value ;
			};
			this.setMetronomeValue	= function ( value, autoplay ) {
				Cookie.write(cookie_key, value, cookie_options) ;
				this.box_input_box.set('value', value ) ;
				// load url
				var url	= '/test/bpm-new/' + value + '.mp3' ;
				this.load( url , autoplay ) ;
			};
			this.setMetronomeValue( this.getMetronomeValue(true) );
			
			this.box_input_box.addEvent( 'blur', function(evt){
				var value	= this.box_input_box.get('value') ;
				var _value ;
				if( value && value.trim() != '' ) {
					_value	= parseInt(value) ;
				}
				if( _value < value_range[0] ) {
					_value	= value_range [0] ;
				} else if( _value > value_range[2]  ) {
					_value	= value_range [2] ;
				}
				this.setMetronomeValue(_value) ;
			}.bind(this) );
			
			if( is_mobile ) {
				new GmcTap( this.box_left_number, {
					refire: 1 ,
					onEnd: function(evt, refire){
						if( !evt || !refire ) return ;
						var value	= this.getMetronomeValue() ;
						value--;
						if( value < value_range[0] ) {
							value = value_range[0] ;
						};
						this.setMetronomeValue(value);
					}.bind(this)
				});
				new GmcTap( this.box_right_number, {
					refire: 1 ,
					onEnd: function(evt, refire){
						if( !evt || !refire ) return ;
						var value	= this.getMetronomeValue() ;
						value++;
						if( value < value_range[0] ) {
							value = value_range[0] ;
						};
						this.setMetronomeValue(value);
					}.bind(this)
				});
				var is_just_fire_this	= false ;
				new GmcTap( this.play_or_pause, {
					refire: 1 ,
					onEnd: function(evt, refire) {
						if( !evt || !refire || is_just_fire_this ) return ;
						if( this.media.paused ) {
							this.isFocus	= true ;
							this.fireEvent('play' , [ this.media ] );
							this.play() ;
						} else {
							this.fireEvent('stop' , [ this.media ] );
							this.stop() ;
						}
						is_just_fire_this	= true ;
						setTimeout(function() {
							is_just_fire_this	= false ;
						}, 400) ;
					}.bind(this)
				});
				
			} else {
				this.box_left_number.addEvent('click', function(evt){
					var value	= this.getMetronomeValue() ;
					value--;
					if( value < value_range[0] ) {
						value = value_range[0] ;
					};
					this.setMetronomeValue(value);
				}.bind(this) );
				
				this.box_right_number.addEvent('click', function(evt){
					var value	= this.getMetronomeValue() ;
					value++;
					if( value < value_range[0] ) {
						value = value_range[0] ;
					};
					this.setMetronomeValue(value);
				}.bind(this)  );
				
				this.play_or_pause.addEvent('click', function(evt){
					if( this.media.paused ) {
						this.isFocus	= true ;
						this.fireEvent('play' , [ this.media ] );
						this.play() ;
					} else {
						this.fireEvent('stop' , [ this.media ] );
						this.stop() ;
					}
				}.bind(this)  ) ;
			}
			
			this.addEvents({
				'play': function(){
					this.play_or_pause.set('text', 'stop');
				},
				'stop': function(){
					this.play_or_pause.set('text', 'start') ;
				}
			});
			
			this.media.addEvents({
				play: function(){
					this.isFocus	= true ;
					if( !this.try_play )  {
						this.fireEvent('play' , [ this.media ] );
					} else {
						this.try_play	= false ;
					}
					console.log(['metronome play',   this.getStatus() ] )
				}.bind(this) ,
				pause: function(){
					if( !this.try_stop ) {
						this.fireEvent('stop');
					} else {
						this.try_stop  = false ;
					}
					console.log(['metronome pause',   this.getStatus() ] )
				}.bind(this) ,
				loadedmetadata: function(evt){
					this.duration	= this.media.duration ;
					this.loaded	= true ;
				}.bind(this) ,
				loadeddata: function(evt) {
					this.loaded	= true ;
					console.log(['metronome loadeddata',  this.getStatus() ] )
				}.bind(this) ,
				timeupdate: function() {
					var duration =  this.duration ;
				}.bind(this) ,
				playing: function(){
					console.log(['metronome playing',  this.getStatus()  ] )
				}.bind(this) ,
				waiting: function(){
					console.log(['metronome waiting',  this.getStatus() ] )
				}.bind(this) ,
				seeking: function(){
					console.log(['metronome seeking',  this.getStatus() ] )
				}.bind(this) ,
				loadedmetadata: function(evt){
					console.log(['metronome loadedmetadata',  this.getStatus() ] )
				}.bind(this) ,
				suspend: function(evt){
					console.log(['metronome suspend',  this.getStatus() ] )
				}.bind(this) ,
				abort: function(evt){
					console.log(['metronome abort',  this.getStatus() ] )
				}.bind(this) ,
				error: function(){
					console.log(['metronome error',  this.getStatus() ] )
				}.bind(this) ,
				emptied: function(){
					console.log(['metronome emptied',  this.getStatus() ] )
				}.bind(this) 
			});
		} ,
		
		onDragStart: function ( drag ) {
            this.box_bar_container.addClass('gmc_html5_player_on_touch');
			if( !this.loaded ) {
				if( !this.try_play ) {
					this.play() ;
					this.try_autostop	= true ;
				}
				setTimeout( this.onDragStart, 100) ;
				return ;
			}
			if( this.try_autostop  ) {
				this.media.pause() ;
				this.try_autostop	= false ;
			}
		} ,
		
		isPlay: function() {
			if( this.try_play ) {
				return true ;
			}
			if(  this.try_stop || !this.loaded || this.media.paused || this.media.ended ) {
				return false ;
			}
			return true ;
		} ,
		
		play: function() {
			this.try_play		= true ;
			this.try_stop		= false ;
			this.try_autostop	= false ;
			if( this.options.is_mp4 ) {
				if( is_android && this.media.webkitEnterFullScreen ) {
					this.media.webkitEnterFullScreen();
				}
			}
			this.media.play() ;
			this.fireEvent( 'play' , [ this.media ] ) ;
		} ,
		
		stop: function() {
			this.try_play		= false ;
			this.try_stop		= true ;
			this.try_autostop	= false ;
			this.media.pause() ;
			this.fireEvent( 'stop' , [ this.media ] ) ;
		} ,
		
		onDragProgressBar: function( drag ) {
            this.box_bar_container.removeClass('gmc_html5_player_on_touch');
			if( this.media.paused ) {
				this.media.play() ;
			}
			this.try_stop	= false ;
			var value	= this.drag.getPercentageValue()  ;
			var time	= value * this.media.duration  ;
			var buffered_time = this.media.buffered.end(0)  ;
			if( time > buffered_time ) {
				
			}
			try{
				// console.log(['cahneg to ', time, ' duration=',   this.media.duration , ' value=',  value ]);
				this.media.currentTime	= time ; 
			}catch(e){
				// throw e;
			}
		} ,
		
		updateProgress: function(){
			if( !this.loaded ) {
				return ;
			}
			
			var time	= this.media.currentTime ;
			if (  this.duration  > 0 && !this.left_drag.isDragging &&  !this.right_drag.isDragging ) {
				var _left_value	= this.left_drag.getPercentageValue() ;
				var _right_value	= this.right_drag.getPercentageValue()  ;
				if( _left_value > 0 || _right_value < 1 ) {
					var left_value	= _left_value *  this.duration ;
					var right_value	= _right_value *  this.duration ;
					if( time < left_value || time >  right_value ) {
						time	= left_value ;
						this.media.currentTime	= time ;
					}
				}
			}
			var value	=   this.duration ? time / this.duration : 0  ;
			if ( !this.drag.isDragging ) {
				this.drag.setPercentageValue( value ) ;
			}
			this.box_bar.setStyle('width', value * 100 + '%' );
			if( ! this.duration ) {
				 this.duration	= this.media.duration ;
			}
			this.updateTime( time, this.duration );
	
			time	= this.media.buffered.end(0)  ;
			value	=   this.duration ? time / this.duration : 0  ;
			this.box_buffer_bar.setStyle('width', value * 100 + '%' );
		} , 
		
		updateTime: (function() {
			function format(time){
				var m	= Math.floor( time / 60 ) ;
				var s		= Math.floor( time % 60 ) ;
				if( m < 10 ) m	= '0' + m ;
				if( s < 10 ) s	= '0' + s ;
				return m + ':' + s ;
			}
			return function(time, duration ) {
				this.box_timer.set('text', format(time) + ' / ' + format(duration) ) ;
			};
		} )() ,
		
		load: function(src, autoplay , rounded ) {
			var source = this.media.getElement('source') ;
			if( source ) {
				var _src	= source.getAttribute('src') ;
				if ( _src === src ) {
					if( autoplay !== false && autoplay ) {
						if( this.media.paused ) {
							this.media.play() ;
						} else {
							this.media.pause() ;
						}
					}
					return ;
				}
				if( this.options.is_metronome ) {
					
				} else {
					if( left_right_position_cache.hasOwnProperty(_src) ) {
						left_right_position_cache[_src].left	=  this.left_drag.getPercentageValue()  ;
						left_right_position_cache[_src].right	=  this.right_drag.getPercentageValue()  ;
					} else {
						left_right_position_cache[_src] =  {
								left: this.left_drag.getPercentageValue() , 
								right: this.right_drag.getPercentageValue()   
							} ;
					}
				}
			}
			
			this.loaded		= false ;
			this.duration	= 0 ;
			this.autoplay	= !!autoplay ;
			this.try_play	= false ;
			this.try_autostop = false ;
			this.try_stop	= false ;
			
			if( 'boolean' === typeof rounded ){
				this.rounded	= rounded ;	
			} else {
				this.rounded	= false ;
			}
			
			if( this.options.is_metronome ) {
				
			} else {
				
				if( is_mobile ) {
					this.drag.attach() ;
					this.left_drag.attach() ;
					this.right_drag.attach() ;
				} else {
					this.drag.detach() ;
					this.left_drag.detach() ;
					this.right_drag.detach() ;
				}
			
				this.drag.setValue(0) ;
				this.updateTime(0, 0) ;
				this.box_buffer_bar.setStyle('width',  0 );
				this.box_bar.setStyle('width',  0 );
				
				if( left_right_position_cache.hasOwnProperty(src) ) {
					this.left_drag.setPercentageValue( left_right_position_cache[src].left ) ;
					this.right_drag.setPercentageValue(  left_right_position_cache[src].right ) ;
				} else {
					this.left_drag.setPercentageValue( 0 ) ;
					this.right_drag.setPercentageValue( 1 ) ;
				}
			}
			
			this.media.empty();
			
			if( !src ) {
				return ;
			}
			
			if( this.options.is_mp4 ) {
				var source	= new Element('source', {
						type: 'video/mp4' ,
						src: src
					});
			} else {
				var source	= new Element('source', {
						type: 'audio/mpeg' ,
						src: src
					}) ;
			}
			source.addEvents({
				error: function(evt) {
					// this.media.NETWORK_NO_SOURCE ==  this.media.error
					// console.log( 'error', evt, this.media.error  )
				}.bind(this) 
			});
			this.media.adopt( source ) ;
			
			if( autoplay ) {
				this.play() ;
			}
		}

	}) ;		
	
	return new Class({
		
		Implements : [Options, Events],
		
		options : {
			lesson_id: null ,
			lesson_part: null ,
			lesson_lotd: null 
			
		} ,
		
		try_skip_load: false ,
		
		initialize: function(target, options) {
			
			body_mask	= body_mask() ;
			
			if( is_mobile ) {
				GmcSwipe	= GmcSwipe() ;
				GmcTap	= GmcTap() ;
			}
			if( !is_mobile) {
				flag_hide	= function(){
					if( flag_timer ) {
						clearTimeout(flag_timer) ;
					}
					flag_timer	= setTimeout(function() {
						flag_timer	= null ;
						document.id('gmc_html5player_flag_handle').addClass('gmc_html5player_hide');
					} , 100) ;
				};
				flag_show	= function( el ){
					if( flag_timer ) {
						clearTimeout(flag_timer) ;
						flag_timer	= null ;
					}
					var parent	= el.getParent('.GmcHTML5PlayerContainer') ;
					if( !flag_handle ) {
						flag_handle	= new Element('div', {
							'id': 'gmc_html5player_flag_handle' ,
							'class': 'gmc_html5player_hide' ,
							'text': ' Move handles to set loop' ,
							'styles': {
								'height': 16 ,
								'width': 152 ,
								'opacity': 0.8
							}
						});
						parent.adopt( flag_handle ) ;
					}
					flag_handle.removeClass('gmc_html5player_hide');
					var pos	= document.id(el).getPosition( parent ) ;
					var _pos	= {
						top: ( pos.y + 6 ) ,
						left: (  pos.x + 12 )
					} ;
					var width	= parent.getWidth() - 4 ;
					var _width	= flag_handle.getWidth() ;
					if( _width + _pos.left > width ) {
						_pos.left	= width	- _width ;
					}
					flag_handle.setStyles(_pos);
				};
			}
			var _target	= document.id(target) ;
			if( !_target) {
				throw new Exception('target is null');
			}
			this.box_container	= new Element('p', {
				
			});
            
			this.docBody = document.id(this.box_container.getDocument().body);
			this.setOptions(options);
			this.build() ;
			this.rounded	= false ;
            
            
            this.rePosition = (function( _this, _target, _container , box_video ) {
                var _target_parent  = _target.getParent() ;
                var _body   = document.id('gmc-body')  ;
                var width   = _target.getWidth() ;
                var height   = 462 ;
                var use_lotd_player = false ;
                if( _target_parent.hasClass('lotd-wrap') ) {
                    document.id(document.body).addClass('GmcHTML5PlayerFillParent') ;
                    _this.use_lotd_player	= true ;
                    use_lotd_player = true ;
                    width   = _target_parent.getWidth() - 18 ;
                    height  = _target_parent.getHeight() - 5 ;
                } else {
                    _this.use_lotd_player	= false ;
                }
                var box   = _container.getElement('.GmcHTML5Player');
        
                return function( is_fullscreen ) {
                    var _top    =  _target.getTop() ;
                    var _pos    = _target.getPosition( _body ) ;
                    var _left   =  _pos.x   - _body.getWidth()  / 2  ;
                    if( use_lotd_player ) {
                        _top    += 30 ;
                    }
                    _container.setStyles( {
                        'width': width ,
                        'height': height ,
                        'top' : _top ,
                        'left': '50%' ,
                        'margin-left': _left
                    }); 
                    box_video.setStyles( {
                        'width': (width - 42 ),
                        'height': (height - 63 ) 
                    });
                };
            })(this ,  _target,  this.box_container, this.box_video );
            
            this.rePosition() ;
            this.box_container.inject(document.body, 'top');
            
			if( !is_mobile ) {
				var parts	= $$('.guitar-lesson-parts-list>li') ;
				var parts_key_maps	= parts.map(function(el, i){
					return String(i) ;
				});
				document.id(document.body).getParent().addEvents({
					'keydown' : function( evt ) {
						var tag	= document.id(evt.target).get('tag') ;
						
						if(  [ 'input', 'textarea' ].contains( tag ) ) {
							return ;
						}
						if( 'space' == evt.key  ) {
							var media	= null ;
							if(  this.mp3_bar.isFocus ) {
								media	= this.mp3_bar.media ;
							} else {
								media	= this.mp4_bar.media  ;
							}
							if( media ) {
								if( media.paused ) {
									media.play() ;
								} else {
									media.pause() ;
								}
							}
						} else if( 'f' ==  evt.key  ){
							if( this.isFullscreen() ) {
								this.exitFullscreen() ;
							} else {
								this.requestFullscreen();
							}
						} else if( 'm' ==  evt.key  ) {
							if( this.metronome_bar.media.paused ) {
								this.metronome_bar.media.play() ;
							} else {
								this.metronome_bar.media.pause();
							}
						} else if( parts_key_maps. contains( evt.key ) ) {
							var _part	= parts[ parseInt(evt.key) ];
							jQuery(_part).click() ;
						}  else if( 'up' == evt.key  ) {
							var media	= null ;
							if( this.mp3_bar.isFocus  ) {
								media	= this.mp3_bar.media ;
							} else {
								media	= this.mp4_bar.media ;
							}
							if( media ) {
								media.currentTime	= 0 ;
							}
						}  else if( 'down' == evt.key  ) {var media	= null ;
							var media	= null ;
							if( this.mp3_bar.isFocus  ) {
								media	= this.mp3_bar.media ;
							} else {
								media	= this.mp4_bar.media ;
							}
							if( media ) {
								media.currentTime	= media.duration ;
							}
						}   else if( 'left' == evt.key  ) {
							var media	= null ;
							if( this.mp3_bar.isFocus  ) {
								media	= this.mp3_bar.media ;
							} else {
								media	= this.mp4_bar.media ;
							}
							if( media ) {
								var time	=media.currentTime ;
								media.currentTime	= time - 3 ;
							}
						}   else if( 'right' == evt.key  ) {
							var media	= null ;
							if( this.mp3_bar.isFocus  ) {
								media	= this.mp3_bar.media ;
							} else {
								media	= this.mp4_bar.media ;
							}
							if( media ) {
								var time	=media.currentTime ;
								media.currentTime	= time + 3 ;
							} 
						} else if( 'esc' == evt.key  ) {
							if( !this.box_heler.hasClass('gmc_html5player_hide') ) {
								this.box_heler.addClass('gmc_html5player_hide') 
							}
						} else {
							return ;
						}
						evt.stop() ;
					}.bind(this) 
				});
			}
			
			
		} , 
		
		build: function() {
			
			var preload_type	= 'metadata' ;
			
			this.box_container.addClass('GmcHTML5PlayerContainer').addClass('gmc_html5player_mp4_stoped') ;
			
			if( is_iphone || is_ipod ) {
				this.box_container.addClass('GmcHTML5PlayerStaticTools');
			}
			
			this.box	= new Element('div', {
				'class': 'GmcHTML5Player' 
			});
			
			this.box_container.adopt(this.box) ;
			
			this.audio	= new Element('audio', {
				'class': 'gmc_html5player_mp3_audio_element' ,
				'preload': preload_type
			});
			this.box_container.adopt(this.audio) ;
			
			this.metronome_audio	= new Element('audio', {
				'loop' : 'loop' ,
				'class': 'gmc_html5player_metronome_audio_element' ,
				'preload': preload_type
			});
			this.box_container.adopt(this.metronome_audio) ;
			
			
			this.video	= new Element('video', {
				'class': 'gmc_html5player_mp4_video_element' ,
                // controls:'controls',
				'preload': preload_type 
			});
			
			this.box_video	= new Element('div', {
				'class': 'gmc_html5player_box_video_container' 
			});
			
			setTimeout( this.buildMask.bind(this), 100 );
			
            /*
			var html	= '<table class="GmcPlayerTable" cellspacing="0" cellpadding="0">'
				+ '<tr><td id="gmc_html5player_box_video" valign="top" align="center"></td><td id="gmc_html5player_box_tools_empty"></td></tr>' 
				+ '<tr><td id="gmc_html5player_box_controls_empty" colspan="2"></td></tr>' 
			 + '</table>';
			this.box.set('html', html);
            */
			
			// this.box.getElement('#gmc_html5player_box_video').adopt(this.box_video) ;
            this.box_container.adopt(this.box_video) ;
			
			this.buildTools() ;
			
			this.box_controls	= new Element('div', {
				'id': 'gmc_html5player_box_controls' 
			});
			this.box.adopt(this.box_controls);
			this.buildControlls() ;
			
			this.bindFullScreen() ;
		} ,
		
		buildMask: function() {
			this.box_video.adopt(this.video) ;
			var _options	= {
					'class': 'gmc_html5player_memeber_only_mask gmc_html5player_hide' ,
					'id': 'gmc_html5player_memeber_only_mask' ,
					'styles': {
						'opacity': 1 
					}
				} ;
			var member_only_mask	= this.member_only_mask =  new Element('div', _options);
			this.box_video.adopt( member_only_mask ) ;
			var member_only_image	= new Element('img', {
				src: '/html5player/images/memberonly.jpg' ,
			});
			member_only_mask.adopt(member_only_image);
			var member_only_link	= new Element('a', {
				href: '/signup/' ,
				styles:{
					cursor: 'pointer'
				}
			});
			member_only_mask.adopt(member_only_link);
			
			var _options	= {
					'class': 'gmc_html5player_box_video_mask' ,
					'id': 'gmc_html5player_box_video_mask' ,
					'styles': {
						'opacity': 0.6
					}
				} ;
			var mask	= new Element('div', _options);
			this.box_video.adopt( mask ) ;
			if( is_ipad ) {
				var __this	= this ;
				new GmcTap( mask , {
					onEnd : function( evt ){
						if( evt ) {
							if( __this.mp4_bar.isPlay() ) {
								__this.mp4_bar.stop();
							} else {
								__this.mp4_bar.play();
							}
						}
					}
				} ) ;
				
				var parts	= document.id($$('.guitar-lesson-parts-list')[0] ) ;
				var es	= parts.getElements('li');
				this.check_mobile_playing	=  (function(_this){
					var iTimer	= null ;
					return function(){
						if( iTimer )  clearTimeout(iTimer);
						iTimer	= setTimeout(function(){
							iTimer	= null ;
							if( _this.mp4_bar.isPlay() ) {
								// alert('play')
							} else {
								// alert('not play')
							}
						}, 600 );
					}  ;
				})( this ); 
				
				var __try_play	= function (i,  do_play){
					if( do_play ) {
						this.mp4_bar.play() ;
						console.log(' do play it');
						return ;
					}
					if( i >= 0 && i < es.length ) {
						var _el	= document.id(es[i]) ;
						try{
							if( ! _el.getElement('span') ) {
								this.loadLessonPart( i ) ;
								this.check_mobile_playing() ;
								this.try_skip_load	= true ;
							}
						}catch(e){
							alert(["Assert Error 0xasdg345adfs!", e]);
						}
						jQuery( es[i] ).click() ;
					}
				}.bind(this) ;
				
				new GmcSwipe(  mask , {
						refire: 60 ,
						tolerance: 30 ,
						'onSwipeleft':  function( evt, refire ){
							if( !refire ) {
								var el	= parts.getElement('li.current') ;
								var i	= es.indexOf (el) +1 ;
								__try_play(i);
							} else {
								__try_play(null, true);
							}
						} ,
						'onSwiperight':  function(evt, refire ){
							if( !refire ) {
								var el	= parts.getElement('li.current') ;
								var i	= es.indexOf (el) -1 ;
								__try_play(i);
							} else {
								__try_play(null, true);
							}
						}
					});
					
			} else if( is_mobile ) {
				var __this	= this ;
				new GmcTap( mask , {
					onEnd : function() {
						if( __this.mp4_bar.isPlay() ) {
							__this.mp4_bar.stop();
						} else {
							__this.mp4_bar.play();
						}
					}
				} ) ;
			} else {
				mask.addEvent('dblclick', function(evt) {
					if( this.mp4_bar.isPlay() ) {
						this.mp4_bar.stop();
					} else {
						this.mp4_bar.play();
					}
				}.bind(this) ) ;
			}
		} ,
		
		buildControlls: function(){
			//  box_mp4_bar
			this.box_mp4_bar	= new Element('div', {
				'id': 'gmc_html5player_box_mp4_bar' 
			});
			this.box_controls.adopt(this.box_mp4_bar);
			this.box_mp4_bar.adopt(new Element('div', {
				text: 'VIDEO PLAYER',
				'class': 'gmc_html5player_box_controls_title',
				styles:{
					left: 130
				}
			}));
			
			//  box_mp4_voice
			if( !is_mobile ) {
				this.box_voice_bar	= new Element('div', {
					'id': 'gmc_html5player_box_voice' 
				});
				this.box_controls.adopt(this.box_voice_bar);
				this.box_voice_bar.adopt(new Element('div', {
					text: 'VOLUME',
					'class': 'gmc_html5player_box_controls_title',
					styles:{
						left: 10
					}
				}));
			}
			//  box_metronome
			this.buildMetronome();
			
			//  box_mp3_bar
			this.box_mp3_bar	= new Element('div', {
				'id': 'gmc_html5player_box_mp3_bar' 
			});
			this.box_controls.adopt(this.box_mp3_bar);
			this.box_mp3_bar.adopt(new Element('div', {
				text: 'BACKING TRACKS',
				'class': 'gmc_html5player_box_controls_title',
				styles:{
					left: 40
				}
			}));
			
			if( !is_mobile ) {
				var voice_bar	=  new VoiceBar(this.box_voice_bar, {
					elements: [  this.video, this.audio, this.metronome_audio ] 
				});
			}
			
			var mp4_bar	= this.mp4_bar	= new ProgressBar(this, this.box_mp4_bar, this.video, {
				is_mp4: true ,
                box_container: this.box_container ,
				onPlay: function() {
					if( !mp3_bar.media.paused ) {
						mp3_bar.media.pause() ;
					}
					mp3_bar.isFocus	= false ;
					if( !metronome_bar.media.paused ) {
						metronome_bar.media.pause();
					}
					metronome_bar.isFocus	= false;
					this.box_container.removeClass('gmc_html5player_mp4_stoped') ;
				}.bind(this) ,
				onStop: function(){
					this.box_container.addClass('gmc_html5player_mp4_stoped') ;
				}.bind(this)
			}) ;
			
			var mp3_bar	= this.mp3_bar	= new ProgressBar(this, this.box_mp3_bar, this.audio, {
				is_mp3: true ,
				onPlay: function(){
					if( !mp4_bar.media.paused ) {
						mp4_bar.media.pause();
					}
					mp4_bar.isFocus	= false;
					if( !metronome_bar.media.paused ) {
						metronome_bar.media.pause();
					}
					metronome_bar.isFocus	= false;
				}
			}) ;
			
			var metronome_bar	= this.metronome_bar	= new ProgressBar(this, this.box_metronome , this.metronome_audio, {
				is_metronome: true ,
				onPlay: function() {
					if( !mp4_bar.media.paused ) {
						mp4_bar.media.pause();
					}
					mp4_bar.isFocus	= false;
					if( !mp3_bar.media.paused ) {
						mp3_bar.media.pause() ;
					}
					mp3_bar.isFocus	= false ;
				}
			}) ;
			
			// add btn quality
			this.buildQuality();
			
			// add btn controlls
			if( !is_mobile  ) {
				this.mp4_btn_controls	= new Element('div', {
					'id': 'gmc_html5player_mp4_btn_controls' 
				});
				this.box_controls.adopt(this.mp4_btn_controls);
				this.box_heler	= new Element('div', {
					'id': 'gmc_html5player_box_gmc_heler' , 'class': 'gmc_html5player_hide'
				});
				this.box_heler.adopt( new Element('div', {
					'id': 'gmc_html5player_box_gmc_heler_close' 
				}) .addEvent('click', function(){
					this.box_heler.addClass('gmc_html5player_hide');
				}.bind(this)) );
				this.box.adopt(this.box_heler);
				this.mp4_btn_controls.addEvent('click', function(){
					this.box_heler.removeClass('gmc_html5player_hide');
				}.bind(this) );
			}
			
			
		} ,
		
		buildMetronome: function() {
			this.box_metronome	= new Element('div', {
				'id': 'gmc_html5player_box_metronome' 
			});
			this.box_controls.adopt(this.box_metronome);
			this.box_metronome.adopt(new Element('div', {
				text: 'METRONOME',
				'class': 'gmc_html5player_box_controls_title',
				styles:{
					left: 10
				}
			}));
		},
		
		buildQuality: function(){
			
			if( this.use_lotd_player || 1 ) {
				this.getQualityValue	= this.use_lotd_player ? function() {
					return 0 ;
				} :  function() {
					return 1 ;
				} ;
				this.setQualityValue	= function( value ){
					
				} ;
				return ;
			}
			
			this.box_mp4_btn_quality	= new Element('div', {
				'id': 'gmc_html5player_box_mp4_btn_quality' 
			});
			var do_element	= document.id( document.body ) ;
			var do_check	= function (evt){
				var parent	= document.id(evt.target).getParent('#gmc_html5player_quality_box') ;
				if(  parent ) {
					return false ;
				}
				evt.stop();
				do_hide();
				return false ;
			}.bind(this);
			var do_timer	= function(){
				do_element.addEvent('click', do_check);
			}.bind(this) ;
			
			var do_disply	= function (){
				this.box_quality_box.removeClass('gmc_html5player_hide');
				setTimeout(do_timer, 10);
			}.bind(this);
			
			var do_hide	= function (){
				this.box_quality_box.addClass('gmc_html5player_hide');
				do_element.removeEvent('click', do_check);
			}.bind(this);
			
			this.box_mp4_btn_quality.addEvent('click', function(){
				if( this.box_quality_box.hasClass('gmc_html5player_hide') ) {
					do_disply();
				} else {
					do_hide();
				}
			}.bind(this) )
				
			this.box_controls.adopt(this.box_mp4_btn_quality);
			
			this.box_quality_box	= new Element('div', {
				'id': 'gmc_html5player_quality_box' ,
				'class': 'gmc_html5player_hide'
			});
			this.box.adopt(this.box_quality_box);
			this.box_quality_box.adopt(new Element('div', {
				'class': 'gmc_html5player_quality_box_bg' ,
				styles:{
					opacity: 0.9
				}
			}));
			
			this.box_quality_box_body	=new Element('div', {
				'class': 'gmc_html5player_quality_box_body' 
			}) ;
			this.box_quality_box.adopt( this.box_quality_box_body );
			
			this.box_quality_box_remember	=new Element('div', {
				'class': 'gmc_html5player_quality_box_remember' 
			}) .addEvent('click', function(){
					if( this.getRememberQuality() ) {
						this.setRememberQuality(false);
					} else {
						this.setRememberQuality(true);
					}
				}.bind(this) )  ;
			this.box_quality_box.adopt(this.box_quality_box_remember)
			.adopt( 
				new Element('div', {
					'class': 'gmc_html5player_quality_box_remember_bar' 
				}) .addEvent('click', function(){
					if( this.getRememberQuality() ) {
						this.setRememberQuality(false);
					} else {
						this.setRememberQuality(true);
					}
				}.bind(this) ) 
			);
			
			var should_remember_key	= '$gh5pr' ;
			this.getRememberQuality	= function( load_from_cookie ){
				if( load_from_cookie ) {
					return ! Cookie.read(should_remember_key) ;
				}
				return this.box_quality_box_remember.hasClass('gmc_html5player_quality_box_remember_true');
			}.bind(this) ;
			this.setRememberQuality	= function( is_valid ){
				if( is_valid ) {
					this.box_quality_box_remember.addClass('gmc_html5player_quality_box_remember_true');
					Cookie.dispose(should_remember_key);
				} else {
					this.box_quality_box_remember.removeClass('gmc_html5player_quality_box_remember_true');
					Cookie.write(should_remember_key, 1, cookie_options ) ;
				}
			}.bind(this) ;
			
			if(  this.getRememberQuality(true) ) {
				this.setRememberQuality(true);
			} else {
				this.setRememberQuality(false);
			}
			
			this.box_quality_box_type	=new Element('div', {
				'class': 'gmc_html5player_quality_box_type' 
			}) ;
			this.box_quality_box.adopt(this.box_quality_box_type);
			
			this.quality_list	= [0, 1, 2].map(function(i){
				var type	= new Element('div', {
					'class': ('gmc_html5player_quality_box_type_value_' + i )
				}) ;
				type.addEvent('click', function(evt){
					this.setQualityValue(i) ;
					if( this.mp4_src_list instanceof Array && this.mp4_src_list.length > i ) {
						this.load( this.mp4_src_list[i].url, true );
					} else {
						alert([ 'assert error 0xfsday45dsfhgs', JSON.enocde(this.mp4_src_list) ] ) ;
					}
				}.bind(this) );
				this.box_quality_box_type.adopt(type);
				return type ;
			}.bind(this) ) ;
			
			
			
			var quality_cache_key	= '$gh5pv' ;
			this.getQualityValue	= function( load_from_cookie ) {
				if( load_from_cookie ) {
					var quality_type	= 1 ;
					if(  this.getRememberQuality() ) {
						quality_type	= Cookie.read(quality_cache_key) ;
						if( !quality_type || quality_type.trim() == '' ) {
							quality_type	= 1 ;
						} else {
							quality_type	= parseInt( quality_type )  || 0 ;
						}
					}
					return quality_type ;
				}
				return this.quality_list.indexOf( this.box_quality_box_type.getElement('.gmc_html5player_quality_box_type_value') );
			}.bind(this) ;
			
			this.setQualityValue	= function( value ){
				this.quality_list.each(function(li, i){
					if( value == i ) {
						li.addClass('gmc_html5player_quality_box_type_value');
						Cookie.write(quality_cache_key, i ,  cookie_options ) ;
					} else {
						li.removeClass('gmc_html5player_quality_box_type_value');
					}
				});
			}.bind(this) ;
			this.setQualityValue( this.getQualityValue(true) ) ;
			
			this.box_quality_box.adopt(
				new Element('div', {
					'class': 'gmc_html5player_quality_box_closer' 
				})
				.addEvent('click', do_hide )
			);
		} ,
		
		buildTools: function(){
			
			this.box_tools	= new Element('div', {
				'id': 'gmc_html5player_box_tools' 
			});
			(function(){
				var parent	= new Element('div', {
					'class': 'gmc_html5player_box_tools_container' 
				});
				parent.adopt(this.box_tools);
				this.box.adopt(parent);
			}).call(this);
			
			// build top tools
			(function(_this) {
				var tools = _this.tools_element	= new Element( 'div', {
					id: 'gmc_html5player_box_tools_tools'
				});
				_this.box_tools.adopt(tools);
				tools.adopt( new Element('div', {
						styles:{
							height: 69
						}
					}) );
					
				if( !_this.use_lotd_player ) {
					tools.adopt( new Element('div', {
						'class': 'gmc_html5player_box_tools_title' ,
					}) );
					
					tools.adopt( new Element('div', {
						'class': 'gmc_html5player_box_tools_list' ,
					}) );
					
					tools.adopt( new Element('div', {
						'class': 'gmc_html5player_box_tools_line' ,
					}) );
				}
				
				tools.adopt( new Element('div', {
					'class': 'gmc_html5player_box_tools_music' ,
				}) );
				
				_this.download_tools	=  new Element('div', {
					'class': 'gmc_html5player_download_tools' ,
				}) ;
				tools.adopt( _this.download_tools ) ;
				
				var iTimer	= null ;
				var list	= new Element('div', {
						'class': 'gmc_html5player_box_tools_song_list' ,
					}) ;
				tools.adopt( list ) ;
				
					
				var show_memeber_alert	= (function () {
					var message	= null ;
					function on_click(evt){
						var _target	= document.id(evt.target);
						if( _target.hasClass('gmc_html5player_member_only_closer') || !_target.getParent('.gmc_html5player_member_only') ) {
							evt.stop();
							message.addClass('gmc_html5player_hide');
							document.id( document.body).removeEvent('click', on_click); 
						}
					}
					return function( li , evt ) {
						if( !message ) {
							message	= new Element('div', {
								'class': 'gmc_html5player_member_only gmc_html5player_hide',
							});
							_this.box_tools.adopt( message ) ;
							message.adopt( new Element('div', {
								styles:{
									'background':'#fff',
									'opacity': 0.88
								}
							}) );
							var _message	=  new Element('div', {
								html: '<div>To access memeber content login or <a href="/signup/">sign up</a></div>' ,
								styles:{
									'border':'1px solid #000' ,
								}
							}) ;
							message.adopt(_message);
							var _closer	= new Element('p', {
								'class': 'gmc_html5player_member_only_closer',
								'text': 'click to close' ,
								'styles': {
									'opacity': 0.8
								}
							});
							if( is_mobile ) {
								_closer.set('text', 'touch to close') ;
								new GmcTap( _closer, {
									onEnd: function(evt, refire){
										if( evt ) {
											message.addClass('gmc_html5player_hide');
										}
									}
								});
							} 								
							_message.adopt(_closer);
						}
						var _pos	= document.id(li).getPosition( _this.box_tools ) ;
						var _left	= _pos.x - 200  ;
						if( is_mobile && !is_ipad ) {
							_left	= 60 ;
						}
						message.setStyles({
							top: ( _pos.y + li.getHeight() ), 
							left: _left
						});
						if( !message.hasClass('gmc_html5player_hide') ) {
							return ;	
						}
						message.removeClass('gmc_html5player_hide');
						if( !is_mobile )  setTimeout(function(){
							document.id( document.body).addEvent('click', on_click);
						}, 100);
					};
				})();
					
					
				if( is_mobile ) {
					new GmcTap( list, {
						refire: 3 ,
						onEnd: function(evt, refire ){
							if( evt ) {
								var target	= document.id( evt.target ) ;

								if( !target.hasClass('gmc_html5player_box_tools_song') ) {
									target	= target.getParent('.gmc_html5player_box_tools_song') ;
								}
								if( !target ) {
									return ;
								}
								if( refire ) {
									var url = target.getAttribute('src');
									if( !url ) {
										show_memeber_alert(target, evt );
										return ;
									}
									_this.mp4_bar.media.pause() ; 
									_this.mp3_bar.load(url, true ) ; 
									var es	= list.getElements('.gmc_html5player_box_tools_song');
									es.removeClass('gmc_html5player_box_tools_song_selected');
									document.id(target).addClass('gmc_html5player_box_tools_song_selected');
								}
							}
						}
					});
					new GmcTap( tools, {
						refire: 3 ,
						onEnd: function(evt, refire ){
							if( evt ) {
								var target	= document.id( evt.target ) ;

								if( refire ) {
									var tools_item = null ;
									if(  target.hasClass('gmc_html5player_box_tools_item') ) {
										tools_item = target ;
									} else {
										tools_item =  target.getParent('.gmc_html5player_box_tools_item') ;
									}
									if( tools_item ) {
										var url = target.getAttribute('src');
										if( !url || url == '/' ) {
											show_memeber_alert(target, evt );
											return ;
										}
										window.open( url ) ;
										return ;
									}
								} 
							}
						}
					});
				} else {
					list.addEvent('click:relay(.gmc_html5player_box_tools_song)', function(evt, target){
							// evt.preventDefault();
							var url = target.getAttribute('src');
							if( !url ) {
								show_memeber_alert(target, evt);
								return ;
							}
							_this.mp4_bar.media.pause() ; 
							_this.mp3_bar.load(url, true ); 
							var es	= list.getElements('.gmc_html5player_box_tools_song');
							es.removeClass('gmc_html5player_box_tools_song_selected');
							document.id(target).addClass('gmc_html5player_box_tools_song_selected');
					});
					tools.addEvent('click:relay(.gmc_html5player_box_tools_item)', function(evt, target){
							// evt.preventDefault();
							var url = target.getAttribute('src');
							if( !url || url == '/' ) {
								show_memeber_alert(target, evt);
								return ;
							}
							window.open( url ) ;
					});
						/*
						list.addEvent('click:relay(.gmc_html5player_box_tools_song_download_btn)', function(evt, target){
							evt.preventDefault();
							var url = document.id(target).getParent().getAttribute('src').replace(/\.mp3$/, '/');
							window.open(url, '_blank');
						});*/
				}
				
			})(this);
			
			// build arrows
			(function(_this) {
				
				var offsets	= [ 0, -136,  -232 ] ;
				
				var _get_left = function( is_closing ) {
					var left	= parseInt( _this.box_tools.getStyle('left')  ) ;
					if( !is_closing ) {
						if( left > offsets[1] ) {
							return  [left,  offsets[1] ] ;	
						} 
						return [left, offsets[2] ] ;
					} else {
						if( left < offsets[1] ) {
							return [left,  offsets[1]  ];	
						} 
						return [left,  offsets[0] ] ;
					}
				} ;
				
				if( is_mobile && !is_ipad ) {
					var o	= _get_left(false) ;
					if( o[0] < 0 ) {
						return ;
					}
					_this.box_tools.setStyle('left', o[1]) ;
					
					return ;
				}
				
				_this.box_tools_arrow	= new Element('div', {
					'id': 'gmc_html5player_box_tools_arrow' 
				});
				_this.box_tools.adopt(_this.box_tools_arrow);
				
				if( is_ipad ) {
					var open_tools	= function(){
						var o	= _get_left(false) ;
						if( o[0] < 0 ) {
							return ;
						}
						_this.box_tools.setStyle('left', o[1]) ;
					};
					var close_tools	= function(){
						var o	= _get_left(true) ;
						if( o[0] > offsets[1]  ) {
							return ;
						}
						_this.box_tools.setStyle('left', o[1]) ;
					};
					
					(new Element('a')).addEvents({
						click:   open_tools		
					}).inject(_this.box_tools_arrow) ;
					
					(new Element('a')).addEvents({
						click:	 close_tools		
					}).inject(_this.box_tools_arrow) ;
				
					setTimeout( function(){
						new GmcSwipe(  _this.box_tools , {
							tolerance: 30 ,
							'onSwipeleft':  open_tools ,
							'onSwiperight': close_tools
						});
					}, 300) ;
					return ;
				}
				
				var fx	= new Fx.Morph( _this.box_tools , {
					duration: 234 ,
    					transition: Fx.Transitions.Sine.easeOut ,
					onComplete: function() {
						var left	= parseInt( _this.box_tools.getStyle('left')  ) ;
						if( left < 0 ) {
							_this.box_tools.addClass('gmc_html5player_box_tools_song_downloadable') ;
						} else {
							_this.box_tools.removeClass('gmc_html5player_box_tools_song_downloadable') ;
						}
					}.bind(_this)
				}); 
				
				
				(new Element('a')).addEvents({
					click:function() {
						if( fx.isRunning() ) {
							return ;
						}
						var o	= _get_left(false) ;
						if( o[0] < offsets[1]  ) {
							return ;
						}
						fx.start({
								'left':  o[1] 
							}) ;
					}				
				}).inject(_this.box_tools_arrow) ;
				
				(new Element('a')).addEvents({
					click:function(){
						if( fx.isRunning() ) {
							return ;
						}
						var o	= _get_left(true) ;
						if( o[0] > offsets[1]  ) {
							return ;
						}
						fx.start({
								'left':  o[1] 
							}) ;
						
					}					
				}).inject(_this.box_tools_arrow) ;
				
			})(this);
			
			this.loadLessonParts() ;
			
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
					this.setup(o);
				}.bind(this)
			});
			req.send();
		} ,
		
		loadLessonPart :  function(part ) {
			
			if( this.try_skip_load ) {
				this.try_skip_load	= false ;
				return ;
			}
			if( 'access_denied' == part ) {
				this.mp4_bar.stop() ;
				this.mp3_bar.stop() ;
				this.metronome_bar.stop() ;
				this.video.empty() ;
				this.audio.empty() ;
				this.metronome_audio.empty() ;
				this.member_only_mask.removeClass('gmc_html5player_hide');
				this.box_container.addClass('GmcHtml5Player_Member_Only_True');
				return ;
			}
			this.member_only_mask.addClass('gmc_html5player_hide');
			this.box_container.removeClass('GmcHtml5Player_Member_Only_True');
			
			this.mp4_src_list	= this.lesson_parts_list.length > part && part >= 0 ? this.lesson_parts_list[part] : this.lesson_parts_list[0] ;
			
            try{
                var left_right_position_cache_valye	= { left:0, right: 1} ;
                if( this.mp4_src_list.length > 0 && !left_right_position_cache.hasOwnProperty( this.mp4_src_list[0] ) ) {
                    this.mp4_src_list.each(function(url) {
                        left_right_position_cache[ url ] = left_right_position_cache_valye ;
                    });
                }
            }catch(e){}
            
			var quality_value = this.getQualityValue() ;
			this.mp4_bar.load( this.mp4_src_list[quality_value] , true ) ;
			
		} ,
		
		bindFullScreen: function(){
            var is_force_view   = false ;
			if( is_mobile) {
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
			this.box_fullscreen	= new Element('div', {
				'id': 'gmc_html5player_box_fullscreen' 
			});
			this.box_container.adopt(this.box_fullscreen);
			
			this.box_fullscreen.adopt(  new Element('div', {
				'styles':{
					'opacity': 0
				}
			}) ) ;
			
			this.box_fullscreen.adopt(  new Element('p') ) ;
			
			var  whenFullscreen = function(){
				if( this.isFullscreen() ) {
					this.box_container.addClass('GmcHTML5PlayerFullScreen');
				} else {
					this.box_container.removeClass('GmcHTML5PlayerFullScreen');
				}
			}.bind(this) ; 
			
			if(  0 &&  !is_mobile && this.box.requestFullscreen  ) {
				this.requestFullscreen = function(){
					this.box_container.requestFullscreen();
					return true;
				}.bind(this) ;
				this.exitFullscreen = function(){
					document.exitFullscreen();
					return true;
				}.bind(this) ;
				this.isFullscreen = function(){
					return  document.fullscreen ;
				}.bind(this) ;
				document.addEventListener("fullscreenchange", whenFullscreen  , false);
			} else if(  0 &&  !is_mobile &&  this.box.mozRequestFullScreen  ){
				this.requestFullscreen = function(){
					this.box_container.mozRequestFullScreen();
					return true;
				}.bind(this) ;
				this.exitFullscreen = function(){
					document.mozCancelFullScreen();
					return true;
				}.bind(this) ;
				this.isFullscreen = function(){
					return  document.mozFullScreen ;
				}.bind(this) ;
				document.addEventListener("mozfullscreenchange", whenFullscreen  , false);
			} else if(   0 &&  !is_mobile &&  this.box.webkitRequestFullScreen  ){
				this.requestFullscreen = function(){
					this.box_container.webkitRequestFullScreen();	
					return true;
				}.bind(this) ;
				this.exitFullscreen = function(){
					document.webkitCancelFullScreen();
					return true;
				}.bind(this) ;
				this.isFullscreen = function(){
					return  document.webkitIsFullScreen ;
				}.bind(this) ;
				document.addEventListener("webkitfullscreenchange", whenFullscreen , false);
			} else if( 1 || is_mobile ){
				var _old_parent	= null ;
				var _body_parent	= document.id( document.body) ;
				this.requestFullscreen = function() {
					if( !this.isFullscreen() ) {
                        if( is_force_view ) 
                           jQuery('meta[name="viewport"]' ).attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no') ;
						 //  _old_parent	= this.box_container.getParent() ;
						  _body_parent.addClass('GmcHTML5PlayerFakeFullScreen').addClass('GmcHTML5PlayerFullScreen') ;
                        this.box_container.setStyles({
                            'left': 0 ,
                            'top': 0 ,
                            'margin-left': 0
                        });
						 // _body_parent.adopt( this.box_container ) ;
					}
					return true ;
				}.bind(this) ;
				this.exitFullscreen = function(){
                    
					_body_parent.removeClass('GmcHTML5PlayerFakeFullScreen').removeClass('GmcHTML5PlayerFullScreen');
                    /*
					_old_parent.adopt(   this.box_container ) ;
					_old_parent	= null ;
                        */
                    if( is_force_view )
                        jQuery('meta[name="viewport"]' ).attr('content', 'user-scalable=yes') ;
                    
                    this.mp4_bar.stop();
                    this.mp3_bar.stop();
                    this.metronome_bar.stop();
                    this.video.setAttribute( 'width', 10);
                    this.video.setAttribute( 'height', 10);
                    setTimeout( this.rePosition, 10 ) ;
                    
					return true ;
				}.bind(this) ;
				this.isFullscreen = function(){
					return  _body_parent.hasClass('GmcHTML5PlayerFakeFullScreen') ;
				}.bind(this)  ;
			} else {
                alert(['error fullscreen for: ', JSON.encode(GmcAppBrowser) ])
            }
			
			var callback	= function( evt ){
					try {
						evt.preventDefault();
						stopPropagation();
					}catch(e){}
					if( this.isFullscreen() ) {
						setTimeout(this.exitFullscreen, 300 ); 
					} else {
						if( this.requestFullscreen() ) {
							this.box_container.addClass('GmcHTML5PlayerFullScreen');
						} else {
							
						}
					}
				}.bind(this) ;
			
			if( is_mobile ) {
				new GmcTap( this.box_fullscreen, {
					onStart : function(){
						
					},
					onEnd : function( is_done ){
						if( is_done ) callback() ;
					}
				} ) ;
				// jQuery( this.box_fullscreen) .tap( callback ) ;
                var check_orientation   = function  (){
                    var orientation = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait'; 
                    if( orientation != 'landscape' ) {
                        document.id(document.body).addClass('GmcHTML5PlayerPortraitView').removeClass('GmcHTML5PlayerLandscapeView');
                    }  else {
                        document.id(document.body).removeClass('GmcHTML5PlayerPortraitView').addClass('GmcHTML5PlayerLandscapeView');
                    };
                    console.log( ['window.orientation=', window.orientation ] ) ;
                }.bind(this) ;
                setTimeout(check_orientation, 100 ) ;
                window.addEvent('orientationchange',  check_orientation );
                
                /*
                    var mobile_fullscreen_mask    = new Element('div', {
                        'class': 'gmc_html5_player_fullscreen_mask_for_mobile',
                        'styles': {
                            'opacity': 0.3
                        }
                    });
                    this.box_container.adopt(mobile_fullscreen_mask);
				new GmcTap( mobile_fullscreen_mask , {
					onStart : function(){
						
					},
					onEnd : function( is_done ){
						if( is_done ) {
                            if( !is_load_first_part && is_mobile ) {
                                this.try_skip_load  = false ;
                                this.loadLessonPart(0);
                                is_load_first_part  = true ;
                            }
                            callback();
                            check_orientation();
                            if( is_mobile ) {
                                this.mp4_bar.play();
                            }
                            // this.mp4_bar.play();
                        }
					}.bind(this)
				} ) ;
                    */
                
                var mobile_message_mask    = new Element('div', {
                    'class': 'gmc_html5_player_message_for_mobile',
                    'html': "<p>Please turn your device to landscape orientation - for a better viewing experience</p>", 
                    'styles': {
                        'opacity': 1
                    }
                });
                this.box_container.adopt(mobile_message_mask);
				new GmcTap( mobile_message_mask , {
					onStart : function(){
						
					},
					onEnd : function( is_done ){
						if( is_done ) {
                            document.id(document.body).removeClass('GmcHTML5PlayerPortraitView').addClass('GmcHTML5PlayerLandscapeView');
                        }
					}.bind(this)
				} ) ;
                
			} else {
				
				this.box_fullscreen.addEvents({
					click:  callback ,
					mouseenter: function(){
						document.id(this).setStyle('opacity',  0.9);
					} ,
					mouseleave: function(){
						document.id(this).setStyle('opacity',  0.5);
					}
				});
			}
			this.box_fullscreen.setStyle('opacity',  0.5);
			
		} ,
		
		setup: function( o ) { 
			
			var tools_list	=  this.tools_element.getElement('.gmc_html5player_box_tools_list') ;
			 
			if( tools_list ) {
				tools_list.empty() ;
				if( o.tools ) Object.each(o.tools, function( _o, tool){ 
					var class_name	= 'gmc_html5player_box_tools_' + tool.toLowerCase() ;
					var _a	= {
						'text': tool ,
						'class': 'gmc_html5player_box_tools_item '  + class_name ,
						'styles': {
							'cursor': 'pointer' 
						}
					} ;
					
					if( 1 ) {
						_a['src']	= _o[0]  ;
						// _a['target']	= '_blank' ;
					}
					
					tools_list.adopt( new Element('a', _a) ) ;
				});
			}
			
			var song_list	= this.tools_element.getElement('.gmc_html5player_box_tools_song_list') ;
			song_list.empty() ;
			var _song_list	= [] ;
			if( o.backingtracks  ) o.backingtracks.each( function(_o, i ){ 
				_song_list.push( _o.url ) ;
				var _a	= {
					'class': 'gmc_html5player_box_tools_song' ,
					text: _o.title
				};
				if( _o.url && _o.url	!= '' ) {
					_a['src']	= _o.url ;
				}
				var song = new Element('div', _a) ;
				if( i++ < 9 ) i = '0' + i ;
				song.adopt( new Element('span', {
					'text': i 
				}) );
				song.setStyles({
					cursor: 'pointer' 
				});
				if( _o.downloadable ) {
					var download_url	=  _o.url .replace(/\.mp3$/, '/download/');
					song.adopt( new Element( 'a', {
						'class': 'gmc_html5player_box_tools_song_download_btn' ,
						'href': download_url ,
						'target': '_blank' ,
						'styles': {
							'cursor': 'pointer'
						}
					}) ) ;
				}
				song_list.adopt( song ) ;
			});
			
			song_list.getElements('.gmc_html5player_box_tools_song_download_btn').each( function( _el, i){
				var el	= document.id(_el);
				var li		= el.getParent('.gmc_html5player_box_tools_song');
				var _pos	= li.getPosition(this.box_tools);
				this.box_tools.adopt(el) ;
				var _fix 	= ( el.getHeight() - li.getHeight() ) / 2 ;
				el.setStyles({
					top: ( _pos.y - _fix )
				});
			}.bind(this) );
			
			
			var default_part 	= 0 ; // this.options.lesson_part 
			
			this.mp4_src_list	=  o.parts[ default_part ]  ;
			
			this.lesson_parts_list	= o.parts ;
			
			var left_right_position_cache_valye	= { left:0, right: 1} ;
			if( this.mp4_src_list.length > 0 && !left_right_position_cache.hasOwnProperty( this.mp4_src_list[0] ) ) {
				this.mp4_src_list.each(function(url) {
					left_right_position_cache[ url ] = left_right_position_cache_valye ;
				});
			}
			
			if( _song_list.length ) {
				this.mp3_bar.load( _song_list[0], false ) ;
				song_list.getElement('.gmc_html5player_box_tools_song').addClass('gmc_html5player_box_tools_song_selected');
			} else {
				this.mp3_bar.load() ;
			}
            
            if( is_mobile) {
                var quality_value = this.getQualityValue() ;
                this.mp4_bar.load( this.mp4_src_list[quality_value] ,  this.use_lotd_player  ) ;
            } else {
                var quality_value = this.getQualityValue() ;
                this.mp4_bar.load( this.mp4_src_list[quality_value] ,  this.use_lotd_player  ) ;
            }
			
		}
		
	});
})();




 