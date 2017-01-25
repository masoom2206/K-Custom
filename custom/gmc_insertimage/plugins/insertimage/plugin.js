/**
 * @file Plugin for inserting Drupal embeded media
 */
( function($) {
 
  // All CKEditor plugins are created by using the CKEDITOR.plugins.add function
  // The plugin name here needs to be the same as in hook_ckeditor_plugin()
  // or hook_wysiwyg_plugin()
  CKEDITOR.plugins.add( 'insertimage',
  {
    // the init() function is called upon the initialization of the editor instance
    init: function (editor) {
 
      // Register the dialog. The actual dialog definition is below.
      CKEDITOR.dialog.add('insertimageDialog', ytDialogDefinition);
 
      // Now that CKEditor knows about our dialog, we can create a
      // command that will open it
      editor.addCommand('insertimageDialogCmd', new CKEDITOR.dialogCommand( 'insertimageDialog' ));
 
      // Finally we can assign the command to a new button that we'll call youtube
      // Don't forget, the button needs to be assigned to the toolbar. Note that
      // we're CamelCasing the button name (YouTube). This is just because other
      // CKEditor buttons are done this way (JustifyLeft, NumberedList etc.)
      editor.ui.addButton( 'InsertImage',
        {
          label : 'Insert Image',
          command : 'insertimageDialogCmd',
          icon: this.path + 'images/icon.png'
        }
      );
      // Add event at doubble click.
      editor.on( 'doubleclick', function( evt ) {
        // Delete the default img dialog.
        delete evt.data.dialog;

        var element = evt.data.element;
        if ( !element.isReadOnly() ) {
          if ( element.is( 'img' ) ) {
            editor.getSelection().selectElement( element );
              editor.commands.insertimageDialogCmd.exec();
          }
        }
      });
 
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
      title : 'Insert Image in Editor',
      minWidth : 390,
      minHeight : 130,
      contents : [
        {
          // To make things simple, we're just going to have one tab
          id : 'tab124',
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
                  // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.definition.textInput.html
                  type : 'text',
                  id : 'txtImageTitle',
                  label: 'Please enter the URL for this image',//'YouTube Video ID',
                  style: 'margin-top:5px;',
                  'default': 'http://',
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
 		onShow: function() {
			var element = null;
			if((element = editor.getSelection().getSelectedElement()) && element.getName() == 'img' && element.hasAttribute('src')) {
				var selectedURL = element.getAttribute("src");
				this.setValueOf( 'tab124', 'txtImageTitle', selectedURL );
				var a=this.getContentElement("tab124","txtImageTitle");
				a.select()
			}
		},

		onFocus : function(){
			var a=this.getContentElement("tab124","txtImageTitle");
			if(a && a.getValue() == "http://") {
				a.select();
			}
		},

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
          // Concatenate our youtube embed url for the iframe
          var src = info.txtImageTitle;
		  var element = CKEDITOR.dom.element.createFromHtml( '<img src="'+src+'"/>' );
          editor.insertElement(element);
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