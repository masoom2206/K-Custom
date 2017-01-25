jQuery(document).ready(function() {
	var tz = 0 - (new Date()).getTimezoneOffset() * 60;
	var max_items	= 12 ;
	var req = new Request({
		url : '/sites/all/modules/custom/gmc_chats/chat-calender-list/chat_calendar.php?tz=' + tz,
		onComplete : function(txt) {

			var o = null;
			try {
				o = JSON.decode(txt);
			} catch (e) {
				alert(e);
				throw e;
			}

			var box = document.id('Google_Event_Box');
            box.setStyle('display', 'block');
			var list = box.getElement('.Google_Event_List');
			list.empty() ;
			
			o.events.some(function(e, i) {
				var title = e.content || e.title
				var p = new Element('p', {
					'title' : title
				});
				var a = new Element('a', {
					// href: e.id ,
					// target: '_blank'
				});
				var b = new Element('b', {});
				var c = new Element('i', {});
				a.adopt(new Element('span', {
					'text' : e.title
				}));
				b.adopt(new Element('span', {
					'text' : e.date ,
					'local_date': ( e._date + ' ' + e._time )
				}));
				
				c.adopt(new Element('span', {
					'text' : e.time 
				}));

				e.start = e.startTime * 1000;
				e.end = e.endTime * 1000;
				var from = new Date();
				from.setTime(e.start);
				var to = new Date();
				to.setTime(e.end);
				var span = new Element('span', {
					styles : {
						'text-align' : 'right'
					},
					'text' : e.startDate + ' -- ' + e.endDate
				});

				p.adopt(a);
				p.adopt(b);
				p.adopt(c);
				list.adopt(p);
				e.li = p;
				if (!i) {
					p.addClass('Google_Event_First');
				} else if( i > max_items ) {
					p.setStyle('display', 'none');
				}
				return 0;
			});

			(function(div, events, clock) {
				(function() {
					var d = new Date;
					var _time = d.getTime();
					var find_first = false;
					var _show_items	= 0 ;
					for ( var i = 0; i < events.length; i++) {
						var e = events[i];
						if (_time > e.end) {
							e.li.setStyle('display', 'none');
						} else {
							if (!find_first) {
								if (_time > e.start) {
									find_first = true;
								} else {
									find_first = e.start;
								}
								e.li.addClass('Google_Event_First');
							} else if (true === find_first) {
								find_first = e.start;
							}
							if( ++_show_items > max_items ) {
								e.li.setStyle('display', 'none');
							}  else {
								e.li.setStyle('display', 'block');
							}
						}
					}
					var left_time = Math.floor((find_first - _time) / 1000);
					var left_date = [];
					function number(n, u) {
						if (n > 1) {
							return n + ' ' + u + 's ';
						} else {
							return n + ' ' + u + ' ';
						}
					}
					// left_date.unshift(number(left_time % 60, 'second'));
					left_time = Math.floor(left_time / 60);
					if (left_time > 0) {
						left_date.unshift(number(left_time % 60, 'minute'));
						left_time = Math.floor(left_time / 60);
						if (left_time > 0) {
							left_date.unshift(number(left_time, 'hour'));
							/*
							        left_date.unshift(   number(left_time % 60 , 'hour') ) ;
							        left_time   = Math.floor( left_time / 24 ) ;
							        if( left_time > 0 ) {
							        left_date.unshift(   number(left_time, 'day') ) ;
							 */
						}
					}
					div.set('text', left_date.join(''));
					// clock.set('text', d.format("%Y/%m/%d %H:%M:%S"));
					setTimeout(arguments.callee, 999);
				})();
			})(box.getElement('.Google_Event_Timer span'), o.events, box
					.getElement('.Google_Event_List_Clock span'));
			
			return;
		}
	});
	req.send();
	
	setTimeout( arguments.callee, 1000 * 60 * 5 ) ;
});