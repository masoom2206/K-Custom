(function($) {
  CKEDITOR.plugins.add( 'my_plugin', {
    init: function( editor )
    {
     editor.addCommand( 'image_command', new CKEDITOR.dialogCommand( 'image_command' ) );
     editor.ui.addButton( 'my_plugin_button', {
      label: 'Do something awesome', //this is the tooltip text for the button
      command: 'image_command',
      icon: this.path + 'images/image.png'
     });
    }
  });
  CKEDITOR.dialog.add('image_command', function(editor) {
	  return {
				title : 'Images List',
				minWidth : 600,
				minHeight : 300,
				contents :
				[
					{
						id : 'general',
						label : 'Settings',
						elements :
						[  

					    {
                  type: 'button',
                  id: 'browse',
                  filebrowser: {
                    action: 'Browse',
                    target: 'Link:txtUrl',
                    url: editor.config.filebrowserImageBrowseLinkUrl
                  },
                  style: 'float:right',
                  hidden: true,
                  label: editor.lang.common.browseServer
							  }
						]
					}
				],
				onOk : function()
				{
					// Create a link element and an object that will store the data entered in the dialog window.
					// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dom.document.html#createElement
           alert(this.path);
					  var imageSrcUrl = 'http://admin.prod.gmc.my/sites/default/files/logo.jpg';
            var width = 200;
            var height = 200;
            var imgHtml = CKEDITOR.dom.element.createFromHtml('<img src=' + imageSrcUrl + '?width=' + width + '&height=' + height + ' alt="" /><br>');
            editor.insertElement(imgHtml);
				}
			};
  });

})(jQuery);
