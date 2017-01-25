<?php 
function lessonTabs($id) {
	$n = node_load($id);
	?>
    <style type="text/css">
	body{
		margin:0px;
	}
	div{
		background:#fff;
		margin:1px;
		height:15px;
		line-height:15px;
		font-family: monospace, Courier;
		font-size: 12px;
		white-space:nowrap;
		width:100%;
	}
</style>
<?php 
  $tabs = $n->field_complete_tab['und'][0]['value'];
  if (!empty($tabs)) {
    echo '<pre>';
    echo $tabs;
  } else {

?>
  <div>---------------------------------------------------------------</div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TAB</div>
  <div>---------------------------------------------------------------&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo $n->title; ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo $n->name; ?></div>
  <?php
	  $tabs = load_files($id);
		  foreach($tabs as $key => $t) {
			  if ( empty($t->notes) ) continue;
			  //echo '<br><br><div>Part '.($key+1).'</div><br>';
			  $br = false;
			  $ex = explode("\r\n",$t->notes);
				  if ( empty($ex[1]) ) {
					  $ex = explode("\n",$t->notes);
					  $br = true;	
				  }
				  foreach($ex as $e) {
					  echo '<div>'.str_replace(" ","&nbsp;",$e).'</div>';
					
				  }
				  if ($br) echo "<br>";
		  }
		  ?>
          <div>===============================================================</div>
  <div>Copyright&nbsp;©&nbsp;2007-2009&nbsp;www.guitarmasterclass.net&nbsp;(Rock&nbsp;My&nbsp;Web&nbsp;AB)</div>
  <?php
		  exit;
  }
}
