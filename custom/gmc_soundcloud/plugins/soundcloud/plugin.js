/**
 * @file Plugin for inserting Drupal embeded media
 */
( function($) {
 
  // All CKEditor plugins are created by using the CKEDITOR.plugins.add function
  // The plugin name here needs to be the same as in hook_ckeditor_plugin()
  // or hook_wysiwyg_plugin()
  CKEDITOR.plugins.add( 'soundcloud',
  {
    // the init() function is called upon the initialization of the editor instance
    init: function (editor) {
 
      // Register the dialog. The actual dialog definition is below.
      CKEDITOR.dialog.add('soundcloudDialog', ytDialogDefinition);
 
      // Now that CKEditor knows about our dialog, we can create a
      // command that will open it
      editor.addCommand('soundcloudDialogCmd', new CKEDITOR.dialogCommand( 'soundcloudDialog' ));
 
      // Finally we can assign the command to a new button that we'll call youtube
      // Don't forget, the button needs to be assigned to the toolbar. Note that
      // we're CamelCasing the button name (YouTube). This is just because other
      // CKEditor buttons are done this way (JustifyLeft, NumberedList etc.)
      editor.ui.addButton( 'SoundCloud',
        {
          label : 'SoundCloud',
          command : 'soundcloudDialogCmd',
          icon: this.path + 'images/icon.png'
        }
      );
 
    }
  });
 
  /*
    Our dialog definition. Here, we define which fields we want, we add buttons
    to the dialog, and supply a "submit" handler to process the user input
    and output our youtube iframe to the editor text area.
  */
  var ytDialogDefinition = function (editor) {
 
    var dialogDefinition =
    {
      title : 'SoundCloud Embed',
      minWidth : 390,
      minHeight : 130,
      contents : [
        {
          // To make things simple, we're just going to have one tab
          id : 'tab11',
          label : 'Settings',
          title : 'Settings',
          expand : true,
          padding : 0,
          elements :
          [
            {
              // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.definition.vbox.html
              type: 'vbox',
              widths : [ null, null ],
              styles : [ 'vertical-align:top' ],
              padding: '5px',
              children: [
                {
                  // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.definition.html.html
                  type : 'html',
                  padding: '5px',
                  //html : 'You can find the youtube video id in the url of the video. <br/> e.g. http://www.youtube.com/watch?v=<strong>VIDEO_ID</strong>.'
				  html : 'Example : <b>https://soundcloud.com/XXX/XXXX</b>.'
                },
                {
                  // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.definition.textInput.html
                  type : 'text',
                  id : 'txtVideoId1',
                  label: 'SoundCloud Link',//'YouTube Video ID',
                  style: 'margin-top:5px;',
                  'default': '',
                  validate: function() {
                    // Just a little light validation
                    // 'this' is now a CKEDITOR.ui.dialog.textInput object which
                    // is an extension of a CKEDITOR.ui.dialog.uiElement object
                    var value = this.getValue();
                    this.setValue(value);
                  },
                  // The commit function gets called for each form element
                  // when the dialog's commitContent Function is called.
                  // For our dialog, commitContent is called when the user
                  // Clicks the "OK" button which is defined a little further down
                  commit: commitValue
                },
              ]
            }
          ]
        }
      ],
 
      // Add the standard OK and Cancel Buttons
      buttons : [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ],
 
      // A "submit" handler for when the OK button is clicked.
      onOk : function() {
 
        // A container for our field data
        var data = {};
 
        // Commit the field data to our data object
        // This function calls the commit function of each field element
        // Each field has a commit function (that we define below) that will
        // dump it's value into the data object
        this.commitContent( data );
 
        if (data.info) {
          var info = data.info;
          // Set the autoplay flag
          var autoplay = info.chkAutoplay ? 'autoplay=1': 'autoplay=0';
          // Concatenate our youtube embed url for the iframe
          var src = info.txtVideoId1;
          // Create the iframe element
			var regexp = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
			var tag =  src.match(regexp) && src.match(regexp)[2];
			if(tag == null) {
				var regexp2 = /^https?:\/\/(m.)(soundcloud.com|snd.sc)\/(.*)$/;
				var tag2 =  src.match(regexp2) && src.match(regexp2)[1];
				if(tag2 == null) {
					alert("Invalid URL");
					return false;
				}
				else {
					/*http://m.soundcloud.com/kristofer-dahl*/
					//var s_url = src.replace(/http:.*(m.soundcloud.com|snd.sc)/, '');
					var s_url = src.replace(/http:.*(m.soundcloud.com|snd.sc)/, '').replace(/https:.*(m.soundcloud.com|snd.sc)/, '');
					src = 'https://soundcloud.com' + s_url;
				}
			}
			//else {
			  /*var p = new CKEDITOR.dom.element( 'p' );
			  var html = '<object height="81" width="100%"><param name="movie" value="http://player.soundcloud.com/player.swf?url=' + src + '"/><param name="allowscriptaccess" value="always"/><embed allowscriptaccess="always" height="81" src="http://player.soundcloud.com/player.swf?url=' + src + '" type="application/x-shockwave-flash" width="100%"/></object><a href="' + src + '" target="_blank" class="gmc-sound-cloud">' + src + '</a>';
			  p.appendHtml( html );
			  editor.insertElement(p);*/
			  // Create the iframe element
			  if(App.mobile){
				var iframe = new CKEDITOR.dom.element( 'iframe' );
				var fullsrc = 'https://w.soundcloud.com/player/?url=' + src + '&auto_play=false&hide_related=false&show_comments=false&show_user=fasle&show_reposts=false&visual=true';
				  // Add the attributes to the iframe.
				  iframe.setAttributes({
					'width': 745,//info.txtWidth,
					'height': 120,//info.txtHeight,
					'type': 'application/x-shockwave-flash',
					'data-cke-saved-src': fullsrc,
					'src': fullsrc,
					'frameborder': 0,
					'scrolling': 0,
					'allowscriptaccess' : 'always',
				  });
			  }
			  else {
				  var fullsrc = 'http://player.soundcloud.com/player.swf?url=' + src;
				  var iframe = new CKEDITOR.dom.element( 'iframe' );
				  // Add the attributes to the iframe.
				  iframe.setAttributes({
					'width': 745,//info.txtWidth,
					'height': 81,//info.txtHeight,
					'type': 'application/x-shockwave-flash',
					'data-cke-saved-src': fullsrc,
					'src': fullsrc,
					'frameborder': 0,
					'scrolling': 0,
					'allowscriptaccess' : 'always',
				  });
				}
			  // Finally insert the element into the editor.
			  editor.insertElement(iframe);
			  var p = new CKEDITOR.dom.element( 'p' );
			  var html = '<a href="' + src + '" target="_blank" class="gmc-sound-cloud">' + src + '</a>';
			  p.appendHtml( html );
			  editor.insertElement(p);
		  //}
        } 
      }
    };
 
    return dialogDefinition;
  };
 
  // Little helper function to commit field data to an object that is passed in:
  var commitValue = function( data ) {
    var id = this.id;
    if ( !data.info )
      data.info = {};
    data.info[id] = this.getValue();
  };
 
 
})(jQuery);