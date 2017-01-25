/*jQuery(document).ready(function() {
	var current = new Date();
	//var ts = (new Date(current.getFullYear(), current.getMonth(), current.getDate(), 24, 00)).getTime();
	var ts = jQuery('#next-lick-date').text();
	ts = parseInt(ts, 10)
	jQuery('#countdown').countdown({
		timestamp	: ts
	});
});*/

jQuery(document).ready(function() {
	var date = new Date(); 
	date = new Date(date.getDay() + 1, 1 - 1, 1);
	//var html = jQuery('#countdown strong').html();
	jQuery('#countdown strong').countdown({
		until: parseInt(jQuery('#next-lick-date').text(), 10),
		layout: '{hn} hours, {mn} minutes,<br> {sn} seconds away!',
		format: 'HMS',
		callback: function(html) {
			var values = html.match(/([0-9]+)/g);
			if (values[0] == '1') {
				html = html.replace('hours','hour');
			}
			if (values[1] == '1') {
				html = html.replace('minutes','minute');
			}
			if (values[2] == '1') {
				html = html.replace('seconds','second');
			}
			return html;
		},
		onExpiry: function()
		{
			jQuery('#time-to-next-lick').html('<br /><strong>Refresh the page and get a new lick!</strong>');
		}
	});
});
