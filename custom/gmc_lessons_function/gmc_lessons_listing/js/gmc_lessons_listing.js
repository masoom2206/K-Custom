(function($) {

//sorting feature  
  $("#itemsort").live('hover', function() {
      $("#itemlist").sortable({ 
          opacity:.5,
          update : function () {  
            var articleorder="";  
            var articleorder2="";      
            var status="";
            $("#itemlist li").each(function(i) {
              status = $(this).attr('status');
              nid = $(this).attr('nid');
              if (articleorder=='') {
                if (status == 1) {
                  articleorder = $(this).attr('newdata');
                } else {
                  articleorder2 = $(this).attr('newdata');
                }
              } else {
                if (status == 1) {
                  articleorder += "," + $(this).attr('newdata');
                } else {
                  articleorder2 += "," + $(this).attr('newdata');
                }
              }
            });
            articleorder += "," + articleorder2;
            $.ajax({
                data: 'data='+articleorder+'&status='+status+'&nid='+nid,
                type: 'POST',
                url: '/update/weight/data',
                success:function(msg) {
                  location.reload(); 
                }
            });
          } 
      });
  }); 
  $('input:radio[name=gp5_rows]').live('change', function() { 
    var articleorder="";
    var nid = ""; 
    $('input:radio[name=gp5_rows]').each(function(){
      nid = $(this).attr('nid');
      var fid = $(this).attr('fid');
      var stat = $(this).attr('checked');
        if (articleorder=='')
          articleorder = fid + "--" + stat;
        else
          articleorder += "," + fid + "--" + stat;
    });
    $.ajax({
      data: 'data='+articleorder+'&nid='+nid,
      type: 'POST',
      url: '/update/gppdf/data',
      success:function(msg) {
        location.reload(); 
      }
    });   
  });
  $('input:radio[name=pdf_rows]').live('change', function() { 
    var articleorder=""; 
    var nid = "";
    $('input:radio[name=pdf_rows]').each(function(){
      nid = $(this).attr('nid');
      var fid = $(this).attr('fid');
      var stat = $(this).attr('checked');
        if (articleorder=='')
          articleorder = fid + "--" + stat;
        else
          articleorder += "," + fid + "--" + stat;
    });
    $.ajax({
      data: 'data='+articleorder+'&nid='+nid,
      type: 'POST',
      url: '/update/gppdf/data',
      success:function(msg) {
        location.reload(); 
      }
    });   
  });
  $('input:radio[name=mp3_rows]').live('change', function() { 
    var fid = $(this).attr('fid');
    var nid = $(this).attr('nid');
    $.ajax({
      data: 'nid='+nid+'&fid='+fid,
      type: 'POST',
      url: '/update/mp3w/data',
      success:function(msg) {
        location.reload(); 
      }
    });
    /*$('input:radio[name=mp3_rows]').each(function(){
      var fid = $(this).attr('fid');
      var stat = $(this).attr('checked');
        if (articleorder=='')
          articleorder = fid + "--" + stat;
        else
          articleorder += "," + fid + "--" + stat;
    });
    $.ajax({
      data: 'data='+articleorder,
      type: 'POST',
      url: '/update/mp3w/data'
    }); */  
  });
  $(".clicktoshow").live('click', function() {
      $(this).parent().find('.copyimageurl').toggle();
      $(this).parent().find('.clicktoshow').toggle();
  });

  //var myPlayer = _V_('video');
  //alert(myplayer);
})(jQuery);

function myfunction(){
  alert('res');
}

function checkd(ids, op) {
   jQuery.ajax({
      data: 'fid='+ids+'&op='+op,
      type: 'POST',
      url: '/update/uup/data',
      success:function(msg) {
        location.reload(); 
      }
  });
}



