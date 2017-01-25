jQuery(document).ready(function() {
	alert('MAS MAS MAS');

	
	/*
	 * Project initiation.
	 */

	jQuery.fn.setupPageLotd = function(){
	//jQuery.fn('setupPageLotd', function()	{
		var date = new Date(); 
		date = new Date(date.getDay() + 1, 1 - 1, 1);
		alert('ddd');
		$('#time-to-next-lick strong').countdown({
			until: parseInt($('#next-lick-date').val(), 10),
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
				$('#time-to-next-lick').html('<br /><strong>Refresh the page and get a new lick!</strong>');
			}
		});
	};

	jQuery.fn.boot = function(){
	//jQuery.fn('boot', function()	{
		alert("HAS HAS HAS");
		var currentPage = false;
		if (window.location.pathname && window.location.pathname !== '/')
		{
			var rawCurrentPage = window.location.pathname.match(/\/([^\/]+)/);
			if (rawCurrentPage && rawCurrentPage.length && rawCurrentPage[1])
			{
				currentPage = rawCurrentPage[1];
			}
		}
		else
		{
			currentPage = 'index';
		}

		currentPage = currentPage.toLowerCase();
		var currentPageFormated = currentPage.substr(0, 1).toUpperCase() + currentPage.substr(1);
		
		/*
		 * Run things that are initiated for all pages in the project.
		 */

		
		// Manual override for edge cases.
		//Project.setupInstructorProfilePage();
		switch(currentPage)
		{
			case 'lick/of/the/days':
				setupPageLotd();
				break;
			default:break;
		}
	};

	/*jQuery( function() {
		jQuery.boot();
	});*/

});
