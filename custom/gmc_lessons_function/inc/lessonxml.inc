<?php

 // print_r($detect = mobile_detect_get_object()); exit;
  function generateXML($nid, $part, $key) {
  echo '<?xml version="1.0" encoding="UTF-8"?>';
  if ($part == 'true' || $part == 'undefined') {
    $v = variable_get('lickvideo'.$nid);
    $bk = variable_get('backtrack'.$nid);
    $f = file_load($v->fid);
    $url = file_create_url($f->uri);
   
?>
<lesson>
		<memberaccess>true</memberaccess>
		<lotd>true</lotd>
		<settings>
			<volume>80</volume>
			<bufferTime>7</bufferTime>
			<borderless>true</borderless>
		</settings>
		<video>
			<clip quality="medium" width="" height=""><?php echo $url;  ?></clip>
		</video>
		<backingtracks>
			
				<track title="" downloadable="false"><?php echo file_create_url($bk->uri); ?></track>
			
		</backingtracks>
		<tools>
		</tools>
	</lesson>
<?php exit; }
  $f = file_load($part);
  $url = file_create_url($f->uri);
  global $user;
  $access = load_file($f->fid);
  $node = node_load($nid);
  if (isset($node->field_free_parts_al)) {
    $laccess = $node->field_free_parts_al['und'][0]['value'];
    $laccess = str_replace(' ' ,'', $laccess);
    $lesacc = explode(',', $laccess);
  }
  
    $command = '/opt/local/bin/ffprobe -v quiet -show_streams ' . escapeshellarg(drupal_realpath('sites/default/files/uploads/'.$node->nid."/".$f->filename));
    $dimensions = array();
    
    exec($command,$output,$status);
    //var_dump($output);
    if (!preg_match('/width=[0-9]*/',implode('/n',$output),$matches))
    {
        preg_match('/Could not find codec parameters \(Video: (?P<videocodec>.*) (?P<width>[0-9]*)x(?P<height>[0-9]*)\)/',implode('/n',$output),$matches);
    } else {
      $wid = explode('=',$matches[0]);
      $srcWidth = $wid[1];
    }
    if (!preg_match('/height=[0-9]*/',implode('/n',$output),$matches))
    {
        preg_match('/Could not find codec parameters \(Video: (?P<videocodec>.*) (?P<width>[0-9]*)x(?P<height>[0-9]*)\)/',implode('/n',$output),$matches);
    } else {
      $hei = explode('=',$matches[0]);
      $srcHeight = $hei[1];
    }
    if(!empty($matches['width']) && !empty($matches['height']))
    {
      $srcWidth = $matches['width'];
      $srcHeight = $matches['height'];
    }

	 $srcWidth -= $srcWidth & 1;
   $srcHeight -= $srcHeight & 1;
	 $ratio = ratio($srcWidth, $srcHeight); 
 
  if($ratio == "16:9" || $ratio == "23:13") {
    $high = 'width="640" height="360"';
    if($f->filemime == "video/mp4") {
      $medium = 'width="640" height="360"';
    }
    else {
      $high = 'width="680" height="382"';
      $medium = 'width="680" height="382"';
    }
      $low = 'width="512" height="288"';
  }
  else { // 4:3
    $high = 'width="512" height="384"';
    if($f->filemime == "video/mp4") {
      $medium = 'width="512" height="384"';
    }
    else {
      $medium = 'width="510" height="382"';
    }
      $low = 'width="320" height="240"';
  }
  if ($f->filemime == "video/mp4") {
    if ($srcWidth >= 512) {
      $medium2 = $medium;
    } else {
      $medium2 = $low;
    }
  } else {
    $medium2 = 'width="680" height="382"';
  }
  if (!in_array($key, $lesacc) && !in_array('paid user',$user->roles) && !in_array('administrator',$user->roles) && $access[0]->status != 0 && $node->field_free_parts['und'][0]['value'] != 1 && !in_array('instructor',$user->roles)) { ?>
    <lesson>
	    <memberaccess>false</memberaccess>
	    <lotd>false</lotd>
	    <settings>
		    <volume>80</volume>
		    <bufferTime>7</bufferTime>
	    </settings>
	    <video>
		    <clip quality="medium" width="468" height="258"><?php echo file_create_url("flashvideoplayer/members-only-message.png"); ?></clip>
	    </video>
	    <backingtracks></backingtracks>
	    <tools>
	    </tools>
    </lesson>
<?php 
  exit;
  } 
?>
<lesson>
	<?php if (isset($node->field_free_parts['und'][0]['value']) && $node->field_free_parts['und'][0]['value'] == 1) { ?>
    <memberaccess>true</memberaccess>
    <?php }else { ?>
    <memberaccess><?php if  ( !in_array('instructor',$user->roles) && !in_array('administrator',$user->roles) && !in_array('paid user',$user->roles) ) { echo "false"; } else { echo "true"; } ?></memberaccess>
    <?php } ?>
	<lotd>false</lotd>
	<rounded>true</rounded>
	<settings>
		<volume>80</volume>
		<bufferTime>7</bufferTime>
		<borderless>true</borderless>
	</settings>
	<video>
  <?php 
  if ($f->filemime == 'video/quicktime') {
    $f->filename = str_replace(".mov",".mp4",$f->filename);
    $f->uri = str_replace("mov","mp4",$f->uri);
  } 
  if ( !file_exists(drupal_realpath($f->uri)."_high.mp4_qtfast.mp4" ) || file_exists(drupal_realpath(str_replace("mp4","flv",$f->uri))) ) { 
					if ( file_exists(drupal_realpath(str_replace(".mp4",".flv",$f->uri))) ) {
	       ?>
            <!--<clip quality="high" width="<?php //echo $srcWidth; ?>" height="<?php //echo $srcHeight; ?>"><?php //echo $url; ?></clip>-->
		        <clip quality="low" <?php echo $medium2; ?> ><?php echo str_replace(".mp4",".flv",$url); ?></clip>
         <?php
             // print_r($f);exit;
					 }
					 elseif ( !file_exists(drupal_realpath('sites/default/files/uploads/'.$node->nid."/high_".$f->filename)) ) {
         ?>
            <clip quality="high" <?php echo $high; ?> ><?php echo $urlflv; echo file_create_url('sites/default/files/uploads/'.$node->nid."/".$f->filename); ?></clip>
            <?php
					}
					elseif ( file_exists(drupal_realpath('sites/default/files/uploads/'.$node->nid."/high_".$f->filename)) ) {
						?>
						<clip quality="low" <?php echo $low ?> ><?php echo file_create_url('sites/default/files/uploads/'.$node->nid."/small_".$f->filename); ?></clip>
						<clip quality="medium" <?php echo $medium ?> ><?php echo file_create_url('sites/default/files/uploads/'.$node->nid."/medium_".$f->filename); ?></clip>
						<clip quality="high" <?php echo $high ?> ><?php echo file_create_url('sites/default/files/uploads/'.$node->nid."/high_".$f->filename); ?></clip>
						<!--<clip quality="high" width="<?php //echo $srcWidth; ?>" height="<?php //echo $srcHeight; ?>" ><?php //echo file_create_url('sites/default/files/uploads/'.$node->nid."/high_".$f->filename); ?></clip>-->
						<?php
					}
	 
	?>
     <?php } ?>	
	</video>
  <backingtracks>
  <?php 
    if(empty($node->field_downloadable_backing['und'][0]['value'])) {
      $k = 0;
    } else {
      $k = 1;
    }
    foreach(load_files_mp3($nid) as $key => $v) {
      if(!empty($node->field_downloadable_backing['und'][0]['value']) && $node->field_downloadable_backing['und'][0]['value'] == $v->fid) {
        $kk = 0;
      } else {
        $kk = $k;
      }
      $f = file_load($v->fid);
      if ($f->filemime == 'audio/mpeg') {
        $item['title'] = $f->filename;
        $item['title'] = str_replace(".mp3","",$item['title']);
		$item['title'] = str_replace("_"," ",$item['title']);
		if(strlen($item['title']) > 20) {
		  $item['title'] = substr($item['title'],0,12) . ' ' . substr($item['title'],-8);
        }
		?>
        <track title="<?php echo $item['title'];?>" downloadable="<?php if ( isset($node->field_is_cover_lesson['und'][0]['value']) && $node->field_is_cover_lesson['und'][0]['value'] == 1 ) { echo 'false'; } else { echo ( $kk == 0 && $node->field_backing['und'][0]['value'] != 1) ? "true":"false"; } ?>"><?php echo file_create_url('backingtrack/'.$nid."/".$f->fid."/"); ?></track>
  <?php $k++;
	    }
    }
	?>
	</backingtracks>
	<tools>
  <?php
    if (!empty($node->field_is_cover_lesson['und'][0]['value'])) {
  ?>
    <coverlesson><?php echo $node->field_is_cover_lesson['und'][0]['value']; ?></coverlesson>
	<?php
    }
		$GuitarPro = 0;
		$PDF = 0;
		$pdf_icon  ='';
		$tab_icon='';
		$guitarPro_icon ='';
		foreach(load_files($nid) as $key => $v) {
			$f = file_load($v->fid);
      if (isset($f->filemime))
		    $ex = explode("/",$f->filemime);		  
		//if($tab != "" && strlen($tab) > 302 && $tab != "No tab for this lesson." && md5($tab) != "68f38c8eec5af3b85604ababaa5e6329" && md5($tab) != "39943bc2ca449b78d4fb06278c963146" && md5($tab) != "61324155744bd66de2abe6178b93ea6b" && md5($tab) != "68b329da9893e34099c7d8ad5cb9c940" && md5($tab) != "f68fde229fbe3801bfdda141acf08a74" && md5($tab) != '5521b5e20c0c4ceae6c198e82b392688' && md5($tab) != "c177c068a6dc10349d0378f15ff07bf3" && md5($tab) != "8a2084ce3b0a5023d4b9e2dc10d0792e" && md5($tab) != "03dfc245bf031ba9ed3d072422b9583a" && md5($tab) != "d74b77b8b771c70322da9242c4abe114") {
			
			if ($key == 0) {
            $tab_icon = '<tool name="Tabs" icon="http://admin.prod.gmc.my/sites/all/themes/gmc_v2/images/tabs.jpg">'.file_create_url('lesson/tabs/'.$nid).'</tool>';
			
			}
		//}
	if ( strtolower($ex[1]) == 'octet-stream' && $GuitarPro == 0) { $gpro = file_create_url($f->uri); $GuitarPro = 1;
		$guitarPro_icon = '<tool name="GuitarPro" icon="http://admin.prod.gmc.my/sites/all/themes/gmc_v2/images/gp.jpg">'.$gpro.'</tool>';
	} 



     if (isset($f->filemime)) {
       if ($f->filemime == 'application/pdf' && $PDF == 0) { $pdf = file_create_url($f->uri); $PDF = 1;
		$pdf_icon ='<tool name="PDF" icon="http://admin.prod.gmc.my/sites/all/themes/gmc_v2/images/pdf.jpg" downloadable="false">'.$pdf.'</tool>';
 } 
    }
  }
  echo $tab_icon.$guitarPro_icon.$pdf_icon;
?>
	</tools>
</lesson>
<?php
	
}
