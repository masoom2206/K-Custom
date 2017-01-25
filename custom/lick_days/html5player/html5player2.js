var Klass = (function() {
	var $removeOn = function(string) {
		return string.replace(/^on([A-Z])/, function(full, first) {
			return first.toLowerCase();
		});
	};
	var $tryRemoveOn = function(string) {
		if (/^on([A-Z]\w+)$/.test(string)) {
			return String(RegExp.$1).toLowerCase();
		} else {
			return string;
		}
	};
	var $proxy = function(fn, obj) {
		return function() {
			fn.apply(obj, arguments);
		};
	};
	var $extend = function(obj, properties) {
		for ( var p in properties)
			if (Object.hasOwnProperty.call(properties, p)) {
				if (!Object.hasOwnProperty.call(obj, p)) {
					obj[p] = properties[p];
				}
			}
	};
	if (Object.hasOwnProperty.call(Array.prototype, 'indexOf')) {
		var $include = function(array, item) {
			if (-1 == array.indexOf(item))
				array.push(item);
			return array;
		};
		var $contains = function(array, item) {
			return -1 != array.indexOf(item);
		};
	} else {
		var $include = function(array, item) {
			for ( var i = array.length; i--;) {
				if (array[i] == item)
					return array;
			}
			array.push(item);
			return array;
		};
		var $contains = function(array, item) {
			for ( var i = array.length; i--;) {
				if (array[i] == item)
					return true;
			}
			return false;
		};
	}
	var $erase = function(array, item) {
		for ( var i = array.length; i--;) {
			if (array[i] === item)
				array.splice(i, 1);
		}
		return array;
	};
	var $each_array = function(array, fn, bind) {
		for ( var i = 0; i < array.length; i++) {
			fn.apply(bind || array, [ array[i], i ]);
		}
		;
	};
	var $each_object = function(obj, fn, bind) {
		for ( var p in obj)
			if (Object.hasOwnProperty.call(obj, p)) {
				fn.apply(bind || obj, [ obj[p], p ]);
			}
		return obj;
	};
	var $clone = function(obj) {
		if (obj instanceof Array) {
			var len = obj.length;
			var _obj = new Array(len);
			for ( var i = 0; i < len; i++) {
				_obj[i] = arguments.callee(obj[i]);
			}
			;
			return _obj;
		} else if (typeof obj == 'object') {
			var _obj = new Object;
			for ( var i in obj)
				if (Object.hasOwnProperty.call(obj, i)) {
					_obj[i] = arguments.callee(obj[i]);
				}
			;
			return _obj;
		}
		return obj;
	};

	_Klass.each = function(obj, fn, bind) {
		if (obj instanceof Array) {
			return $each_array(obj, fn, bind);
		} else if (typeof obj == 'object') {
			return $each_object(obj, fn, bind);
		} else {
			throw new Exception('error');
		}
	};

	function _Klass(methods) {
		var binds = {};
		if (Object.hasOwnProperty.call(methods, 'Binds')) {
			$each_array(methods['Binds'], function(p) {
				if (Object.hasOwnProperty.call(methods, p)) {
					binds[p] = methods[p];
					delete methods[p];
				}
			});
			delete methods['Binds'];
		}
		var $options = {};
		if (Object.hasOwnProperty.call(methods, 'options')) {
			$options = methods['options'];
			delete methods['options'];
		}
		var $options_events = {};
		$each_object($options, function(fn, type) {
			var _type = $tryRemoveOn(type);
			if (_type != type) {
				$options_events[_type] = $include($options_events[_type] || [],
						fn);
				delete $options[type];
			}
		});
		if (Object.hasOwnProperty.call($options, 'events')) {
			$each_object($options['events'], function(fn, type) {
				type = $removeOn(type);
				$options_events[type] = $include($options_events[type] || [],
						fn);
			});
			delete $options['events'];
		}

		var klass = function() {

			$each_object(binds, function(fn, property) {
				this[property] = jQuery.proxy(fn, this);
			}, this);

			this.options = $clone($options);
			$options_initialize = null;
			this.setOptions = function(options) {
				if (typeof options != 'object') {
					return this;
				}
				var scope_initialize = null ;
				if (Object.hasOwnProperty.call(options, 'initialize')) {
					if (true === $options_initialize) {
						scope_initialize	=  options['initialize'] ;
					} else {
						$options_initialize = options['initialize'];
					}
					delete options['initialize'];
				}
				for ( var p in options)
					if (Object.hasOwnProperty.call(options, p)) {
						var _type = $tryRemoveOn(p);
						if (p != _type) {
							this.addEvent(_type, options[p]);
						} else if (p == 'events') {
							this.addEvents(options[p]);
						} else {
							this.options[p] = options[p];
						}
					}
				if ( scope_initialize ) {
					scope_initialize.call(this) ;
				}
				return this;
			};

			var $events = $clone($options_events);
			this.addEvent = function(type, fn) {
				if (!(fn instanceof Function)) {
					throw new Exception('add event need Function argument!');
				}
				type = $removeOn(type);
				$events[type] = $include($events[type] || [], fn);
				return this;
			};
			this.addEvents = function(events) {
				for ( var type in events)
					if (Object.hasOwnProperty.call(events, type)) {
						this.addEvent(type, events[type]);
					}
				return this;
			};
			this.removeEvent = function(type, fn) {
				type = $removeOn(type);
				if (Object.hasOwnProperty.call($events, type)) {
					$erase($events[type], fn);
				}
				return this;
			};
			this.removeEvents = function(type) {
				if (!(type instanceof String)) {
					for (_type in type)
						if (Object.hasOwnProperty.call(type, _type)) {
							this.removeEvent(_type, type[_type]);
						}
					return this;
				}
				type = $removeOn(type);
				if (Object.hasOwnProperty.call($events, type)) {
					delete $events[type];
				}
				return this;
			};
			this.fireEvent = function(type, args) {
				type = $removeOn(type);
				if (Object.hasOwnProperty.call($events, type)) {
					var events = $events[type];
					for ( var i = 0; i < events.length; i++) {
						var fn = events[i];
						fn.apply(this, args);
					}
				}
				return this;
			};

			this.initialize.apply(this, arguments);
			if ('function' === typeof $options_initialize) {
				$options_initialize.call(this);
			}
			$options_initialize = true;
		};
		for ( var property in methods)
			if (Object.hasOwnProperty.call(methods, property)) {
				klass.prototype[property] = methods[property];
			}
		if (!klass.prototype.initialize)
			klass.prototype.initialize = function() {
			};
		return klass;
	}
	;
	return _Klass;
})();

(function() {
	if (App.player_static_tools) {
		return;
	}
	var tools_box = $('#tools');
	var tools = $('#tools>div');
	var offsets = [ -130, -232 ];
	function relayout(is_close) {
		var left = parseInt(tools.css('left'));
		var _left = left;
		if (is_close) {
			if (left >= 0) {
				_left = offsets[0];
			} else if (left >= offsets[0]) {
				_left = offsets[1];
			} else {
				return;
			}
		} else {
			if (left <= offsets[1]) {
				_left = offsets[0];
			} else if (left <= offsets[0]) {
				_left = 0;
			} else {
				return;
			}
		}
		if (_left < 0) {
			tools_box.addClass('tools_show_download_button');
		} else {
			tools_box.removeClass('tools_show_download_button');
		}
		tools.animate({
			left : _left
		}, 200);
	}
	if (App.mobile) {
		$('#tools').swipeleft(function() {
			relayout(true);
		}).swiperight(function() {
			relayout(false);
		});
	}

	// arrows
	$.each($('#tools>div>p>a'), function(i) {
		var _this = $(this);
		_this.bind('vclick', function(evt) {
			relayout(!i);
		});
	});

})();

// tools
(function() {

	// $('#player,#tools1,#controlls,#full_screen, #player_mask').remove(); return ;

	var ev_name = App.mobile ? 'tap' : 'click';
	var MyApp = new Klass({
		initialize : function() {

		}
	});

	var full_screen = $('#full_screen');
	full_screen.bind('vclick', function(evt) {
		if (window.parent && window.parent.toggleGmcHtml5PlayerFullScreeen) {
			evt.stopPropagation();
			evt.preventDefault();
			window.parent.toggleGmcHtml5PlayerFullScreeen();
		}
		jQuery(document.body).toggleClass('GmcHtml5PlayerFullScreen');
	});

	var my_app = App.my_app = new MyApp();
	var gmc_html5player_member_only = jQuery('#gmc_html5player_member_only');
	var gmc_html5player_member_only_mask = jQuery('#gmc_html5player_member_only>div:last-child')  ;
	var gmc_html5player_member_only_text = jQuery('#gmc_html5player_member_only_text');
	jQuery('#gmc_html5player_member_only p').bind('vclick', function(evt) {
			setTimeout(function(){
				gmc_html5player_member_only.addClass('HideClassName');
			}, 400 );
	});
	var just_fired = false;
	function member_only(a, evt, type) {
		if (just_fired)
			return;
		just_fired = true;
		gmc_html5player_member_only_mask.css('display', 'block') ;
		setTimeout(function() {
			just_fired = false;
			gmc_html5player_member_only_mask.css('display', 'none') ;
		}, 900 );
		gmc_html5player_member_only.removeClass('HideClassName');
		var pos = a.position();
		pos.left = 110 - gmc_html5player_member_only.width();
		var types = {
			'guitarpro' : 'This file Requires Guitar Pro software Available for free trail <a href="http://www.guitar-pro.com/en/index.php"  target="_blank">here</a>. Free alternative <a href="http://www.tuxguitar.com.ar/download.html"   target="_blank">here</a>.',
			'member' : 'To access member content login or <a href="/signup/" target="_blank">sign up</a>.',
			'cover' : 'For copyright reasons this lesson does not contain tabs. Instead every note is explained by the instructor.',
			'download' : 'To download this backing track please login or <a href="/signup/" target="_blank">sign up</a>.'
		};
		gmc_html5player_member_only_text.html(types[type]);
		gmc_html5player_member_only.css(pos);
	}

	if (App.lesson_data.hasOwnProperty('tools')) {
		var tools_items = $('#tools_items');

		Klass.each(App.lesson_data.tools, function(o, tool) {
			var src = o[0];
			var a = $('<a/>').css('cursor', 'pointer');
			if (App.lesson_data.coverd_lesson) {
				a.addClass('Question');
			} else {
				a.addClass(tool);
			}
			var not_available = false;
			if (!src || '/' === src) {
				not_available = true;
				a.addClass('not_available');
			} 
			a.append( $('<span/>').text( tool ).css('font-size', 10 ) );
			/*
			if (tool == 'GuitarPro') {
				var _q = $('<i/>').text('(?)');
				a.append(_q);
				_q.bind('vclick', function(evt) {
					member_only(a, evt, 'guitarpro');
				});
			}*/
			tools_items.append(a);
			a.bind('vclick', function(evt) {
				/*
				if (evt.target && evt.target.tagName == 'I') {
					member_only(a, evt, 'guitarpro');
					return;
				}*/
				if (not_available) {
					member_only(a, evt, App.lesson_data.coverd_lesson ? 'cover'
							: 'member');
					return;
				}
				window.open(src);
			});
		});
	}
	if (App.lesson_data.hasOwnProperty('backingtracks')) {
		var tools_songs = $('#tools_songs');
		
		var downloads_list	= [] ;
		Klass.each(App.lesson_data.backingtracks, function(o, i) {
			var src = o.url;
			var a = $('<a/>').css('cursor', 'pointer');

			var not_available = false;
			if (!src || '/' === src) {
				not_available = true;
				a.addClass('not_available');
			} 

			a.append($('<i/>').text(i < 9 ? '0' + (1 + i) : (1 + i)));
			if (o.hasOwnProperty('downloadable')) {
				downloads_list.push( [a, src] ) ;
				a.addClass('tools_song_downloadable');
				if (o.downloadable) {
					a.addClass('tools_song_downloadable_true');
				}
			}
			
			a.append( $('<span/>').text(o.title).css('font-size', 10 ) );
			
			tools_songs.append(a);
			a.bind('vclick', function(evt) {
				if (not_available) {
					member_only(a, evt, 'member');
					return;
				}
				$('#tools_songs a').removeClass('tools_song_now');
				a.addClass('tools_song_now');
				App.mp3_player.load(src);
				App.mp3_player.play();
			});
			if (!i) {
				a.addClass('tools_song_now');
				my_app.addEvent('ready', function() {
					App.mp3_player.load(src);
				});
			}
		});
		
		setTimeout(function() {
			var tools = jQuery('#tools');
			jQuery.each(downloads_list ,
					function(i) {
						var _this = jQuery(this[0]);
						var src 	=   String( this[1] ).replace(/\.mp3$/, '/download/')  ;
						var a = jQuery('<a/>').attr('target', '_blank');
						tools.append(a);
						var pos = _this.position();
						a.css('top', pos.top);
						var is_downloadable = _this.hasClass('tools_song_downloadable_true');
						a.bind('vclick', function(evt) {
							if (!is_downloadable) {
								member_only(_this, evt, 'download');
								return;
							}
							window.open(src);
						});
					});
		}, 100);
	}
})();

// HQ/LQ
(function(){
		var Quality	= new Klass( {

				Binds : [ 'getValue', 'setValue', 'toggleQuality' ] ,

				options : {
						cookie_key: '$gmc_player_quality' ,
						cookie_options: {
								expires: 77
						},
						values: [0, 1, 2] ,
						defaule_value_index: 0 
				},

				initialize : function(element, options) {
						this.setOptions(options);
						this.element = jQuery(element) ;
						this.text_element = jQuery(element + ' span') ;
						
						this.element.bind( 'vclick', this.toggleQuality ) ;
						
						this.fireEvent('write', [ this.getValue() ] );
				} ,
				
				getIndex: function(val) {
						var values	= this.options.values ;
						for(var i = 0; i < values.length; i++ ) {
							if( val === values[i] ) {
									return i ;
							}
						}
						return -1 ;
				} ,
				
				getValue: function () {
						var val	= jQuery.cookie( this.options.cookie_key ) ;
						if( null === val ) {
								val	= this.options.values[ this.options.defaule_value_index ] ;
						} else {
								val	= parseInt( val ) ;
						}
						return val ;
				} ,
				
				setValue: function ( val ){
						if(  this.getIndex( val ) < 0 ) {
								val	= this.options.values [ this.options.defaule_value_index ] ;
						}
						jQuery.cookie( this.options.cookie_key, val,   this.options.cookie_options ) ;
						this.fireEvent('write', [ val ] );
						return this ;
				} ,
				
				toggleQuality: function( evt ) {
						var val	= this.getValue() ;
						var i	= this.getIndex( val ) + 1 ;
						if( i >= this.options.values.length ) {
								i	= 0 ;
						}
						var _val	= this.options.values[i] ;
						this.setValue( _val );
				}
		}) ;
		
		window["QualityInstance"]	= new Quality( '#quality_btn', {
				values: [0, 2] ,
				onWrite: function( val ) {
						if( 0 === val ) {
								this.text_element.text('LQ') ;
						} else {
								this.text_element.text('HQ') ;
						}
				}
		} ) ;
})();

// tools
(function() {
	var $ = jQuery;

	// $('#player,#tools,#controlls,#full_screen').remove() ;  return ;

	var parts = [];
	if (App.lesson_data.hasOwnProperty('parts')) {
		parts = App.lesson_data.parts;
	}

	var GmcSlider = new Klass(
			{

				Binds : [ 'getValue', 'whenTouchStart', 'whenTouchMove', 'whenTouchEnd', 'whenResize' ],

				options : {/*
						onTick: function(intPosition){},
						onChange: function(intStep){},
						onComplete: function(strStep){},*/
						maxValue : 0,
						snap : false,
						wheel : true,
						offset : 0
				},

				initialize : function(element, knob, options) {
						this.setOptions(options);
						this.element = jQuery(element);
						knob = this.knob = jQuery(knob);
						options = this.options;

						this.minValue = 0;
						this.maxValue = this.element.width() ;
						this.property = 'left';
						this.axis = 'x';
						knob.css(this.property, knob.css(this.property)) ;
						this.isDragging = false;
						
						jQuery(window).resize( this.whenResize ) ;
				},
				
				whenResize: function() {
						// console.log( [ this.maxValue ,  this.element.width(), this.last_percentage_value  ] );
						this.maxValue	=  this.element.width() ;
						this.setPercentageValue( this.last_percentage_value ) ;
				} , 
				
				whenTouchStart : function(_evt) {
					var evt = _evt.originalEvent;
					if (evt.touches.length != 1) {
						return;
					}
					this.maxValue = this.element.width();
					var t = evt.targetTouches[0];
					this.touchPosition = {
						x : t.pageX,
						y : t.pageY
					};
					var value = parseInt(this.knob.css(this.property)) || 0;
					this.touchPosition.value = value;
					this.isDragging = true;
					this.last_percentage_value	= 0 ;
					this.fireEvent('start', [ value, evt ]);
					
				},

				whenTouchMove : function(_evt) {
					if (!this.isDragging) {
						return;
					}
					var evt = _evt.originalEvent;
					evt.preventDefault();
					evt.stopPropagation();
					var t = event.targetTouches[0];
					if (t == null) {
						return;
					}
					var lastTouchPosition = {
						x : t.pageX,
						y : t.pageY
					};
					var delta = lastTouchPosition[this.axis]
							- this.touchPosition[this.axis];
					var _value = this.touchPosition.value + delta;
					this.lastTouchPosition = lastTouchPosition;
					if (_value < this.minValue) {
						_value = this.minValue;
					} else if (_value > this.maxValue) {
						_value = this.maxValue;
					}
					this.knob.css(this.property, _value);
					// console.log( ['move', lastTouchPosition[ this.axis],  this.getPercentageValue() ] );
					this.fireEvent('drag', [ _value, evt ]);
					
				},
				whenTouchEnd : function(_evt) {
					if (!this.isDragging) {
						return;
					}
					var evt = _evt.originalEvent;
					this.isDragging = false;
					this.fireEvent('stop', [ this, evt ]);
				},

				setValue : function(value) {
					if (value < this.minValue)
						value = this.minValue;
					else if (value > this.maxValue)
						value = this.maxValue;
					this.knob.css(this.property, value);
					return this;
				},

				getValue : function() {
					var value = parseInt(this.knob.css(this.property)) || 0;
					return value;
				},

				setPercentageValue : function(value) {
					this.last_percentage_value	= value ;
					var _value = value * this.maxValue;
					return this.setValue(_value);
				},

				getPercentageValue : function() {
					var value = this.getValue();
					return (value / this.maxValue);
				},

				getPercentageValueByValue : function(value) {
					return (value / this.maxValue);
				},

				detach : function() {
					this.knob.unbind("touchstart", this.whenTouchStart);
					this.knob.unbind("touchmove", this.whenTouchMove);
					this.knob.unbind("touchend", this.whenTouchEnd);
				},

				attach : function() {
					this.knob.bind("touchstart", this.whenTouchStart);
					this.knob.bind("touchmove", this.whenTouchMove);
					this.knob.bind("touchend", this.whenTouchEnd);
				},
			});

	var Player = new Klass({

		Binds : [ 'tryPlayOrPause', 'whenPlay', 'whenStop', 'updateProgress', 'updateDuration'  , 'whenResize' ],

		initialize : function(media, type, options) {

			this.setOptions(options);
			this.body = jQuery(document.body);
			this.media = media;
			this.type = type;
			var types = {
				mp4 : 'video/mp4',
				mp3 : 'audio/mpeg',
				metronome : 'audio/mpeg'
			};
			if (Object.hasOwnProperty.call(types, type)) {
				this.media_type = types[type];
				for ( var _type in types)
					if (Object.hasOwnProperty.call(types, _type)) {
						this['is_' + _type] = false;
					}
				this['is_' + type] = true;
			} else {
				throw new Exception('unsupport media type `' + type + '`');
			}

			this.player = media.get(0);
			this.progess_bar = $('#' + type + '_box .progress_box');
			this.progress_time = $('#' + type + '_box .progress_time');
			this.play_or_pause = $('#' + type + '_box .play_or_pause');

			this.progess_buffer_bar = $('#' + type
					+ '_box .progress_buffer_bar');
			this.progess_current_bar = $('#' + type + '_box .progress_bar');
			this.progess_position = $('#' + type + '_box .progress_position');

			this.bindEvents();
		},
		
		bindEvents : function() {
			this.addEvent('play', this.whenPlay);
			this.addEvent('stop', this.whenStop);

			if (this.is_metronome) {
				return;
			}

			var ev_name = App.mobile ? 'tap' : 'click';
			this.play_or_pause[ev_name](this.tryPlayOrPause);

			this.slider = new GmcSlider(this.progess_bar,
					this.progess_position, {
						player : this,
						onStop : function() {
							if (this.loadEmpty) {
								return;
							}
							var value = this.getPercentageValue();
							var duration = this.options.player.duration;
							if (duration) {
								var time = duration * value;
								this.options.player.player.currentTime = time;
								if (!this.options.player.onPlay) {
									this.options.player.play();
								}
								// console.log( ['onComplate', value , time , this.options.player.onPlay ] ) ;
							}
						}
					});

			this.media.bind('loadedmetadata', this.updateDuration);
			this.media.bind('durationchange', this.updateDuration);
			this.media.bind('timeupdate', this.updateProgress);
			this.media.bind('loadeddata', this.updateProgress);
			this.media.bind('progress', this.updateProgress);

		},

		updateDuration : function() {
			this.duration = this.player.duration;
			this.updateTime(0, this.duration);
		},

		updateProgress : function() {
			if (this.loadEmpty || this.is_metronome) {
				return;
			}
			var time = this.player.currentTime;
			var value = this.duration ? time / this.duration : 0;

			this.progess_current_bar.css('width', value * 100 + '%');

			if (!this.slider.isDragging) {
				this.slider.setPercentageValue(value);
			}

			if (!this.duration) {
				this.duration = this.player.duration || 0;
			}
			this.updateTime(time, this.duration);
			if (this.player.buffered.length) {
				time = this.player.buffered.end(0);
				value = this.duration ? time / this.duration : 0;
			} else {
				value = 0;
			}
			this.progess_buffer_bar.css('width', value * 100 + '%');
		},

		updateTime : (function() {
			function format(time) {
				var m = Math.floor(time / 60);
				var s = Math.floor(time % 60);
				if (m < 10)
					m = '0' + m;
				if (s < 10)
					s = '0' + s;
				return m + ':' + s;
			}
			return function(time, duration) {
				this.progress_time
						.text(format(time) + ' / ' + format(duration));
			};
		})(),

		whenPlay : function() {
			this.play_or_pause.addClass('onPlaying');
		},

		whenStop : function() {
			this.play_or_pause.removeClass('onPlaying');
		},

		play : function() {
			this.player.play();
			this.onPlay = 1;
			this.fireEvent('play');
		},

		stop : function() {
			this.player.pause();
			this.onPlay = 0;
			this.fireEvent('stop');
		},

		empty : function() {
			this.load('');
			this.player.load();
		},

		tryPlayOrPause : function() {
			if (this.loadEmpty) {
				return;
			}
			if (this.player.paused) {
				this.play();
			} else {
				this.stop();
			}
		},

		load : function(src, autostart) {
			this.stop();
			this.media.empty();

			this.duration = 0;
			this.onPlay = 0;
			this.loadEmpty = !src || src == '';

			if (!this.is_metronome) {
				this.progess_buffer_bar.css('width', '0%');
				this.progess_current_bar.css('width', '0%');
				if (!this.slider.isDragging) {
					this.slider.setPercentageValue(0);
				}
			}

			var source = $('<source/>').attr('type', this.media_type).attr(
					'src', src);
			this.media.append(source);

			if (!this.is_metronome) {
				this.updateTime(0, 0);
				if (!this.loadEmpty) {
					this.slider.attach();
				} else {
					this.slider.detach();
				}
			}

			if (autostart && !this.loadEmpty) {
				this.play();
			}
		}
	});

	var ev_name = App.mobile ? 'tap' : 'click';

	var player = App.mp4_player = new Player($('#player>div>*'), 'mp4', {
		onPlay : function() {
			this.body.addClass('GmcMp4Playing');
			mp3_player.stop();
			metronome_player.stop();
		},
		onStop : function() {
			this.body.removeClass('GmcMp4Playing');
		}
	});
	(function() {
		jQuery('#player_mask div')[ev_name](player.tryPlayOrPause);
	})();
	var mp3_player = App.mp3_player = new Player($('#mp3_player'), 'mp3', {
		onPlay : function() {
			player.stop();
			metronome_player.stop();
		},
		onStop : function() {

		}
	});
	var metronome_player = App.metronome_player = new Player(
			$('#metronome_player'), 'metronome', {
				onPlay : function() {
					player.stop();
					mp3_player.stop();
					jQuery('#metronome_status span').text('stop');
				},
				onStop : function() {
					jQuery('#metronome_status span').text('start');
				}
			});
	(function() {
		jQuery('#metronome_status').bind('vclick', metronome_player.tryPlayOrPause);
		var input = jQuery('#metronome_box input') ;
			(function( input ){
			var allowedSpecialCharKeyCodes = [46,8,37,39,35,36,9];  
				var numberKeyCodes = [44, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];  
				var commaKeyCode = [188];  
				var decimalKeyCode = [190,110];  
					var 	last_value = input.val() ;
					var last_check_value	= last_value ;
					var check	= (function( input ){
						var timer	= null ;
							function do_check( now_check ) {
								timer	= null ;
								var val	= input.val() ;
								if( /\D/.test(val) ) {
										input.val( last_value ) ;
										val	= last_value ;
								} else {
										var _val	= parseInt(val) ;
										if( _val < 30 || _val > 230 ) {
												input.val( last_value ) ;
												val	= last_value ;
										}
								}
								if( last_check_value != val  ) {
										last_check_value	= val ;
										loadValue() ;
								}
							};
						return function( delay, now_check ){
							if( timer ) clearTimeout(timer);
							timer	= setTimeout( function(){
								do_check( now_check )
							} ,  delay || 6000 );
						};								
					})( input ) ;
					
					input.bind('paste', function(event){
							check(1) ;
					});
					input.bind('blur', function(event) {
							check(1, 1) ;
					});
					
					input.keydown(function(event){
							last_value	= this.value ;
							var legalKeyCode =  
								(!event.shiftKey && !event.ctrlKey && !event.altKey)  
									&&  
								(jQuery.inArray(event.keyCode, allowedSpecialCharKeyCodes) >= 0  
									||  
								jQuery.inArray(event.keyCode, numberKeyCodes) >= 0);  
						  
							if (legalKeyCode === false)  
								event.preventDefault(); 
							check();
					});
			})( input ) ;
			
		var value_range = [ 30, 120, 230 ];
		function loadValue(autoplay) {
			var value = parseInt(input.val());
			if (value < value_range[0]) {
				value = value_range[0];
				input.val(value);
			} else if (value > value_range[2]) {
				value = value_range[2];
				input.val(value);
			}
			var url = '/test/bpm-new/' + value + '.mp3';
			metronome_player.load(url, autoplay);
		}
		function setValue(is_more) {
			var value = parseInt(input.val());
			if (is_more)
				value++;
			else
				value--;
			if (value < value_range[0] || value > value_range[2]) {
				return;
			}
			input.val(value);
			loadValue(true);
		}

		jQuery('#metronome_left').bind('vclick', function() {
			setValue(false);
		});
		jQuery('#metronome_right').bind('vclick', function() {
			setValue(true);
		});
		loadValue();
	})();

	window.LoadLessonPart = (function() {

		var last_part_index = -1;
		var just_loaded = false;
		if (App.mobile) {
			$('#player_mask div').swipeleft(function() {
				if (just_loaded) {
					return;
				}
				var i = last_part_index + 1;
				if (i < 0 || i >= parts.length) {
					return;
				}
				window.LoadLessonPart(i, true);
				if (window.parent && window.parent.GmcHtml5PlayerTryLoadPart) {
					window.parent.GmcHtml5PlayerTryLoadPart(i);
				}
			}).swiperight(function() {
				if (just_loaded) {
					return;
				}
				var i = last_part_index - 1;
				if (i < 0 || i >= parts.length) {
					return;
				}
				window.LoadLessonPart(i, true);
				if (window.parent && window.parent.GmcHtml5PlayerTryLoadPart) {
					window.parent.GmcHtml5PlayerTryLoadPart(i);
				}
			});
		}
		var QualityInstance	= window["QualityInstance"] ;
		delete window["QualityInstance"] ;
		QualityInstance.addEvent('write', function(val) {
				if( last_part_index >=0 && last_part_index < parts.length ) {
						var o	= parts[ last_part_index ] ;
						var src	= o [val] ;
						if (!src) {
								return;
						}
						player.load(src, true );
				}
		});
		return function(i, autostart) {
			if (just_loaded) {
				return;
			}
			just_loaded = true;
			setTimeout(function() {
				just_loaded = false;
			}, 400); 
			if (!/^\d+$/.test(i)) {
				player.empty();
				jQuery(document.body).addClass('app_member_only');
				return;
			}
			i = parseInt(i);
			jQuery(document.body).removeClass('app_member_only');
			if (i < 0 || i >= parts.length) {
				i = 0;
			}
			if (parts.length < 1)
				return;
			last_part_index = i;
			var o = parts[i];
			var src = o[ QualityInstance.getValue() ] ;
			if (!src) {
				player.empty();
				jQuery(document.body).addClass('app_member_only');
				return;
			}
			player.load(src, autostart);
		};
	})();
	window.LoadLessonPart(0);
	App.my_app.fireEvent('ready');

	setTimeout(
			function() {
				var es = jQuery('#full_screen, .play_or_pause, #metronome_status , #metronome_left , #metronome_right, .progress_position, #quality_btn');
				
				es.bind('vmouseover', function() {
					jQuery(this).addClass('vHover');
				});
				es.bind('vmouseout', function() {
					jQuery(this).removeClass('vHover');
				});
			}, 400);

	if (App.mobile) {
		(function() {
			var win = window.parent || window;
			var body = jQuery(document.body);
			var check_orientation = jQuery.proxy(function() {
				var value = this.orientation;
				var orientation = Math.abs(value) == 90 ? 'landscape'
						: 'portrait';
				if (orientation != 'landscape') {
					body.addClass('GmcHTML5PlayerPortraitView').removeClass(
							'GmcHTML5PlayerLandscapeView');
						
				} else {
					body.removeClass('GmcHTML5PlayerPortraitView').addClass(
							'GmcHTML5PlayerLandscapeView');
				}
				;
				if( body.hasClass('GmcHtml5PlayerFullScreen' ) ) {
						if( win && win.GmcHtml5PlayerReLayout ) {
								win.GmcHtml5PlayerReLayout() ;
						}
				}
				// console.log( ['window.orientation=', value ] ) ;
			}, win);
			setTimeout(check_orientation, 100);
			jQuery(win).bind('orientationchange', check_orientation);
			jQuery('#portrait_orientation').bind('vclick', function() {
				body.removeClass('GmcHTML5PlayerPortraitView');
			});
		})();
		(function(){
				var right	= parseInt(  jQuery('#player').css('padding-right') ) ;
				var bottom	= parseInt(  jQuery('#player').css('padding-bottom') ) ;
				var player_box	=  jQuery('#player_box') ;
				var mp4_player	=  jQuery('#mp4_player') ;
				jQuery(window).resize( function() {
						var _pos	= {
								width: ( player_box.width() - right ) ,
								height: ( player_box.height() - bottom ) ,
						}
						mp4_player.css( _pos );
				} ) ;
				// alert( [ screen.width, screen.height] )
		})();
	}
})();
