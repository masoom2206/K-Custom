(function($) {
  $(".b-submit").live('click', function() {
      var nid = $(this).attr('nid');
      var revision = $(this).attr('revision');
      $.ajax({
          data: 'nid='+nid+'&revision='+revision,
          type: 'POST',
          url: '/send/review/request',
          success:function(msg) {
            location.reload(); 
          }
      });
      $(this).parent('div').html('<a class="bigbutton" style="color:#bbb;">Submitting for review please wait.....</a>'); 
  });

  $("#reviewlesson").live('click', function() {
      $('.element_to_pop_up').bPopup({
            modalClose: false,
            opacity: 0.6,
            positionStyle: 'fixed' //'fixed' or 'absolute'
        });
  });
  $("#reeditlesson").live('click', function() {
      var nid = $(this).attr('nid');
      var revision = $(this).attr('revision');
      $.ajax({
          data: 'nid='+nid+'&revision='+revision,
          type: 'POST',
          url: '/reedit/review/request',
          success:function(msg) {
            location.reload(); 
          }
      });
    $(this).parent('span').html('<a class="bigbutton" style="color:#bbb;">Re-edit submited revision</a>'); 
  });
  $("#revisionlesson").live('click', function() {
      var nid = $(this).attr('nid');
      var revision = $(this).attr('revision');
      $.ajax({
          data: 'nid='+nid+'&revision='+revision,
          type: 'POST',
          url: '/complete/revision/lesson/publish',
          success:function(msg) {
            location.reload(); 
          }
      });
    $(this).parent('span').html('<a class="bigbutton" style="color:#bbb;">Current Revision Publish</a>'); 
    //location.reload(true);
  });
  $(".reviapp").live('click', function() {
      var sid = $(this).attr('sid');
      var uid = $(this).attr('uid');
      $.ajax({
          data: 'sid='+sid+'&uid='+uid,
          type: 'POST',
          url: '/send/review/request',
          success:function(msg) {
            location.reload(); 
          }
      });
    $(this).parent('td').html('<a target="_blank" href="/node/add/lessons?sid='+sid+'&uid='+uid+'">Create a Empty Lesson</a>'); 
  });
})(jQuery);
