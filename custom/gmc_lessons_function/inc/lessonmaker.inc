<?php
function Maker($nid,$title) {
	 
	extension_loaded('ffmpeg') or die('Error in loading ffmpeg');
	
	  drupal_add_library('system', 'drupal.collapse');
	  /*
	 
	  $n = $nid;
	   $form = drupal_get_form('others_file_upload',$n);
	   $f = drupal_get_form('icp_display_item_form',$n);
	   
	 return drupal_render($f);
	 */
	 global $user;
	 $n = node_load($nid);
	 if ($n->field_editable['und'][0]['value'] == 1 && !in_array('administrator',$user->roles)) {
		 drupal_goto('admin/icp');
		 exit;
	 }
	  $lfiles = load_files($nid);
	 $form = drupal_get_form('others_file_upload',$nid);
	 $list = drupal_get_form('files_form',$nid);
	 $mp3 = drupal_get_form('_backingtrack',$nid);
	 return drupal_render($form).drupal_render($list).drupal_render($mp3).loadMovies($nid,$title,$lfiles);
	 
	 
	 //loadMovies($nid,$title,$lfiles);
	 

}

function loadMovies($nid,$title,$lfiles) {
	
	
	 $r = array();	
	 $row[0] = array (array('data' => t('Empty'), 'colspan' => 6, 'align' =>'center'));
	   if ( !empty($lfiles) ) {
		 $n = 0;
	  	foreach ($lfiles as $key => $v) {
			
			$data = file_load($v->fid);
			if (!is_object($data)) continue;
			
			
			if ($data->filemime != 'video/mp4' && $data->filemime != 'video/x-flv' ) {
			
			if ($data->filemime == 'audio/mpeg') continue;	
			
		  
			if ($data->filemime == 'image/jpeg') {
				$r[$data->filemime][]= array(
									file_create_url($data->uri),
		  			           		l(t("Delete"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$data->fid.'/backtracking/delete'),
									l(t("Set as thumbnail"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$data->fid.'/set-as-thumbnail'),
									);
			}
			else {
				$r[$data->filemime][]= array(
									$data->filename,
		  			           		l(t("Delete"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$data->fid.'/backtracking/delete'),
									);
			}
				$header[$data->filemime] = $header = array(t('File Name'),array('data' => t('Operations'), 'colspan' => 4));	
				
			}
		}
	   }
	  $list = '';
	 
	  foreach($r as $key => $v) {
		
	
	  $ex = explode("/",$key);		  
	  if (strtolower($ex[1]) == 'octet-stream' ) $ex[1] = 'Guitar Pro';
	 $data = theme('table', array('rows' => $v));
	  $edit_element = array( 
							// list title 
							'#title'          => t($ex[1]), 
							// content fieldset-а 
							'#children'    => $data, 
							// list of variable 
							'#collapsible' => false,   
							// and collapsed 
							'#collapsed'  => false, 
							// we indicate in attributes that specified classes must be used
							'#attributes'  => array(  
													'class' => array('collapsible', 'collapsed')
													), 
							); 
	  // input a function $fieldset_edit that will output field into 
	  $list .= theme('fieldset', array('element' => $edit_element)); 
	  }
	
	return $list;
}
function regenerate($nid,$t,$f) {
	
	generateThumbs($f,$nid);
	return Maker($nid,$t);
	
}


function convertMovies($data,$nid) {

				$data = file_load($data);
				$srcFile = drupal_realpath($data->uri);
				$ff = new ffmpeg_movie(drupal_realpath($data->uri));
				$low = "sites/default/files/uploads/".$nid."/".$data->filename."_small.mp4";
				$medium = "sites/default/files/uploads/".$nid."/".$data->filename."_medium.mp4";
				$high = "sites/default/files/uploads/".$nid."/".$data->filename."_high.mp4";
				$mobile = "sites/default/files/uploads/".$nid."/".$data->filename."_mobile.mp4";
				$srcWidth = $ff->getFrameWidth();
				$srcWidth -= $srcWidth & 1;
							
				$srcHeight = $ff->getFrameHeight();
				$srcHeight -= $srcHeight & 1;
				
				$srcsize = $srcWidth."x".$srcHeight;
				if ($srcHeight == 1080) {
				$rate = '8000k';	
				}
				else {
				$rate = '5000k';	
				}
				//echo "/usr/bin/ffmpeg -i $srcFile -vcodec libx264 -preset fast -acodec copy -ab 256 -b:v $rate -s $srcsize -map_meta_data -f flv $high 2>&1";
				if (!file_exists($high."_qtfast.mp4")) {
				exec("/usr/bin/ffmpeg -i $srcFile -vcodec libx264 -preset fast -acodec copy -ab 256 -b:v $rate -s $srcsize  -f mp4 $high 2>&1",$output);
				exec("/usr/bin/qt-faststart ".drupal_realpath($high)." ".drupal_realpath($high)."_qtfast.mp4");
				unlink(drupal_realpath($high));
				}
				if (!file_exists($medium."_qtfast.mp4")) {
				exec("/usr/bin/ffmpeg -i $srcFile -vcodec libx264 -preset fast -acodec copy -ab 256 -b:v 900k -s 640x360  -f mp4 $medium 2>&1",$output);
				exec("/usr/bin/qt-faststart ".drupal_realpath($medium)." ".drupal_realpath($medium)."_qtfast.mp4");
				unlink(drupal_realpath($medium));
				}
				if (!file_exists($low."_qtfast.mp4")) {
				exec("/usr/bin/ffmpeg -i $srcFile -vcodec libx264 -preset fast -acodec copy -ab 256 -b:v 300k -s 512x288  -f mp4 $low 2>&1",$output);
				exec("/usr/bin/qt-faststart ".drupal_realpath($low)." ".drupal_realpath($low)."_qtfast.mp4");
				unlink(drupal_realpath($low));
				}
				//exec("/usr/bin/ffmpeg -i $srcFile -vcodec libx264 -preset fast -acodec copy -ab 256 -b:v 900k -s 640x360  -f mp4 $mobile 2>&1",$output);
				
				
				
				
}

function setAsThumbnail($nid,$t,$f) {
	
				$df = file_load($f);
				
				$new_image = imagecreatetruecolor(30, 20);
			    $old_image = imagecreatefromjpeg(drupal_realpath($df->uri));
			    imagecopyresampled($new_image,$old_image,0,0,0,0,30,20,120,90);        
			    imagejpeg($new_image, "sites/default/files/uploads/".$nid."/small_".$nid.".jpg", 100);
				
				
				$new_image = imagecreatetruecolor(120,90);
			    $old_image = imagecreatefromjpeg(drupal_realpath($df->uri));
			    imagecopyresampled($new_image,$old_image,0,0,0,0,120,90,120,90);        
			    imagejpeg($new_image, "sites/default/files/uploads/".$nid."/big_".$nid.".jpg", 100);
				
				return Maker($nid,$t);
				
	
}

function generateThumbs($data,$nid) {
	
				convertMovies($data,$nid);
				
				$data = file_load($data);
				
				$ff = new ffmpeg_movie(drupal_realpath("public://uploads/".$nid."/".$data->filename."_medium.mp4_qtfast.mp4"));
				
				if ( !is_object($ff) ) return;
				$rnd = rand(4,200);
				$capPos = ceil($rnd);
			
				$obj = $ff->getFrame($capPos);
				
				if ( !is_object($obj) ) return;
				
				//$obj->resize(120,90);
					
				imagejpeg($obj->toGDImage(),"sites/default/files/uploads/".$nid."/big_".$data->fid.".jpg",100);
				$new_image = imagecreatetruecolor(120, 90);
				$old_image = imagecreatefromjpeg(drupal_realpath("sites/default/files/uploads/".$nid."/big_".$data->fid.".jpg"));
				imagecopyresampled($new_image,$old_image,0,0,0,0,120,90,640,360);   
				imagejpeg($new_image,"sites/default/files/uploads/".$nid."/big_".$data->fid.".jpg",100);
				imagejpeg($new_image,"sites/default/files/uploads/".$nid."/big_".$nid.".jpg",100);
				imagejpeg($new_image,"sites/default/files/uploads/".$nid."/small_".$nid.".jpg",100);
				$img = file_get_contents("sites/default/files/uploads/".$nid."/big_".$data->fid.".jpg");
				$df = file_save_data($img,"public://uploads/".$nid."/big_".$data->fid.".jpg",FILE_EXISTS_REPLACE);
				file_save($df);
				
				$new_image = imagecreatetruecolor(30, 20);
			    $old_image = imagecreatefromjpeg(drupal_realpath($df->uri));
			    imagecopyresampled($new_image,$old_image,0,0,0,0,30,20,120,90);        
			    imagejpeg($new_image, "sites/default/files/uploads/".$nid."/small_".$data->fid.".jpg", 100);
				$new_image = file_get_contents("sites/default/files/uploads/".$nid."/small_".$data->fid.".jpg");
				$df = file_save_data($new_image,"public://uploads/".$nid."/small_".$data->fid.".jpg",FILE_EXISTS_REPLACE);
				file_save($df);	
	
}


function Maker_form($form,&$form_state,$nid,$title,$fid = 0,$arr = 0) {
	
	 $form['edit'] = array (
  		'#type'=>'hidden',
		'#value'=>$fid,
		);
		$form['arr'] = array (
  		'#type'=>'hidden',
		'#value'=>$arr,
		);
$notes = '';
$text = '';
	if ( $fid !=  0) {
		$files = load_file($fid);
		
		$notes = $files[0]->notes;
		$text = $files[0]->description;
	}

 /*
  $form['file'] = array(
    '#type' => 'file',
	'#value' => $nid,
    '#title' => t('Edit Lesson File'),
  );
  */
  $form['nid'] = array (
  		'#type'=>'hidden',
		'#value'=>$nid,
		);
  $form['title'] = array (
  		'#type'=>'hidden',
		'#value'=>$title,
		);
		
  $form['notes'] = array (
  		'#type'=>'textarea',
		'#default_value' => $notes,
		'#rows' => 10,
		'#cols' => 10,
		'#title' => 'Tab for this lesson part (always include backing chords above the tab):',
		'#attributes'=> array('style'=>'font-family:"Courier", "monospace", "Courier new" !important;font-size:12px;'),
		);
		
		
   $form['description'] = array(
    '#type' => 'text_format',
    '#title' => t('Text for this lesson part'),
    '#default_value' => $text,
    '#format' => 'plain_text',
    
  );
 
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Save',
	'#submit' => array('Maker_form_submit'),
  );
  
 
  
  return $form;



	
	
}
function lessonMaker_validate( $form, &$form_state) {
	
	
}

function Maker_form_submit($form, &$form_state) {
	
	
	  $nid = $form['nid']['#value'];
	  $notes = $form['notes']['#value'];
	  $text = $form['description']['value']['#value'];
	  
	  $title = $form['title']['#value'];
	  $edit = $form['edit']['#value'];
		
	update_notes($notes,$text,$edit);		
	
	
		$form_state['redirect'] = "admin/icp/".$nid."/".$title."/lm2/".$edit."/".$edit."/edit";
		drupal_set_message(t('Lesson Step has been updated!!!'));
	
	
	
	
	
}

function lesson_file_delete_submit($form,&$form_state,$nid,$title,$fid,$type) {
	
$file = file_load($fid);
 if ( !is_object($file) ) { drupal_goto("admin/icp/".$nid."/".$title."/lm2"); }
 if (file_delete($file)) {
	 if (file_exists(drupal_realpath($file->uri."_small.mp4_qtfast.mp4"))) {
		 unlink(drupal_realpath($file->uri."_small.mp4_qtfast.mp4"));
	 }
	 if (file_exists(drupal_realpath($file->uri."_high.mp4_qtfast.mp4"))) {
		 unlink(drupal_realpath($file->uri."_high.mp4_qtfast.mp4"));
	 }
	 if (file_exists(drupal_realpath($file->uri."_medium.mp4_qtfast.mp4"))) {
		 unlink(drupal_realpath($file->uri."_medium.mp4_qtfast.mp4"));
	 }
	 if (file_exists(drupal_realpath($file->uri."_mobile.mp4"))) {
		 unlink(drupal_realpath($file->uri."_mobile.mp4"));
	 }
	 delete_file($file->fid);
	 drupal_set_message(t('deleted successfully!'));
	 
 }
 
	drupal_goto("admin/icp/".$nid."/".$title."/lm2");
}

function others_file_upload($form,&$form_state,$nid) {

$n = node_load($nid);
	 $form['title'] = array(
	'#markup' => '<h3>'.$n->title.'</h3>',
	);
	$form['file'] = array(
    '#type' => 'file',
	'#value' => $nid,
    '#title' => t('Add File'),
  );
  $form['nid'] = array (
  		'#type'=>'hidden',
		'#value'=>$nid,
		);
  
		
  //$form['type'] = array ( '#type' => 'hidden','#value'=>$type,);
		
		
  
 
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Upload',
	'#submit' => array('others_files_upload_submit'),
  );
  
    $form['preview'] = array(
	'#markup' => l(t("Preview"),file_create_url(drupal_lookup_path('alias', 'node/'.$nid)),array('attributes'=> array('target'=>'_blank'))),
	);
  
  return $form;

	
}

function others_files_upload_submit($form, &$form_state) {
	
	$nid = $form['nid']['#value'];
	$dir = "sites/default/files/uploads/".$nid;
	if ( !file_exists($dir) ) mkdir($dir);
	//print_r($_FILES);
	$_FILES['files']['name']['file'] = str_replace(" ","",$_FILES['files']['name']['file']);
	if (file_get_mimetype($_FILES['files']['name']['file']) == "application/zip") {
	
	$zip = new ZipArchive;
		$res = $zip->open($_FILES['files']['tmp_name']['file']);
		
		if ( !file_exists($dir."/".$nid) ) mkdir($dir."/".$nid);
		
		for($i = 0; $i < $zip->numFiles; $i++) {
		
		// if ( is_dir($zip->getNameIndex($i)) ) { echo $zip->getNameIndex($i); continue; }
		//$zip->extractTo("sites/default/files/uploads/".$nid,array($zip->getNameIndex($i)));
		
		$filename = $zip->getNameIndex($i); 
        $fileinfo = pathinfo($filename);
       
		//copy("zip://".$_FILES['files']['tmp_name']['file']."#".$filename, "sites/default/files/uploads/".$nid."/".$fileinfo['basename']);
		$fp = file_get_contents("zip://".$_FILES['files']['tmp_name']['file']."#".$filename);
		//unlink(drupal_realpath("sites/default/files/uploads/".$nid."/".$fileinfo['basename']));
		$ex = explode(".",$filename);
		
		if ( empty($ex[1]) ) continue;
		$file = file_save_data($fp,"public://uploads/".$nid."/".str_replace(" ","",$filename),FILE_EXISTS_RENAME);
		$file->status = FILE_STATUS_PERMANENT;
	 	file_save($file);
		$files[] = $file->fid;
		
		drupal_set_message($file->filename. " extracted");	
		}
		//unlink(drupal_realpath("sites/default/files/uploads/".$nid."/".$nid));
		$zip->close();
		
	}
	else {
    
	$file = file_save_upload('file', array('file_validate_extensions' => array()),"public://uploads/".$nid,FILE_EXISTS_RENAME);
	$file->status = FILE_STATUS_PERMANENT;
	 file_save($file);
 	 $files[] = $file->fid;

	}
	 
	 
	foreach($files as $key => $v) {
	insert_file($v,$nid);	
	}
	
	drupal_set_message($file->filename. " Uploaded!");	
	
	
}

function insert_file($v,$nid) {
	
	 db_insert('lesson_files')
    ->fields(array(
      'nid' => $nid,
      'fid' => $v,
      'status' => 1,
	  'weight' => 0,
    ))
    ->execute();
	
}


function files_form($form, &$form_state,$nid) {
  
  $files = load_files($nid);
   $title = "Lessons";
   global $user;
  foreach($files as $key => $v) {
	$file = file_load($v->fid);
	if (!is_object($file)) continue;
	if ($file->filemime != 'video/mp4' && $file->filemime != 'video/x-flv') continue;
	$data = $file;
	if ( !file_exists(drupal_realpath($data->uri)."_small.mp4_qtfast.mp4") || !file_exists(drupal_realpath($data->uri)."_medium.mp4_qtfast.mp4") || !file_exists(drupal_realpath($data->uri)."_high.mp4_qtfast.mp4") ) {
				
				if ( !file_exists(drupal_realpath(str_replace(".mp4",".flv",$data->uri))) && !file_exists(drupal_realpath('sites/default/files/uploads/'.$nid."/high_".$f->filename)) ) {
					//generateThumbs($data->fid,$nid);
				}
			}
	$red_dwarf[] = array(
					"thumbnail"=>"<img src='".file_create_url(file_build_uri("uploads/".$nid."/big_".$file->fid.".jpg"))."'>",
					'name'=>$file->filename,
					"type"=>$file->filemime,
					"st"=>$v->status,
					"rank"=>$v->weight,
					'id'=>$file->fid,
					'opr' =>  l(t("Edit"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$v->fid.'/'.$key.'/edit')." | ".
										l(t("Delete"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$v->fid.'/lesson_parts_/delete')." | ".
										l(t("Re-genrate Thumbails"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$v->fid.'/regenerate')
										
					);  
	  
  }
  
  $options = array(
  0 => 'Free',
  1 => 'Members Only',
);
  
  $form['characters'] = array(
    '#prefix' => '<div id="red-dwarf">',
    '#suffix' => '</div>',
    '#tree' => TRUE,
    '#theme' => 'form_table_theme_name'
  );
 
 	if (empty($red_dwarf)) return $form;
  foreach ($red_dwarf as $key => $characters) {
    $form['characters'][$key]['thumb'] = array(
      '#markup' => $characters['thumbnail'],
    );
	$form['characters'][$key]['operations'] = array (
		'#markup' => $characters['opr']
		);
	$form['characters'][$key]['name'] = array(
      '#markup' => $characters['name'],
    );
	$form['characters'][$key]['id'] = array(
      '#type' => 'hidden',
	  '#value'=> $characters['id'],
    );
    $form['characters'][$key]['type'] = array(
      '#markup' => $characters['type'],
    );
	if ( in_array('administrator',$user->roles) ) {
	$form['characters'][$key]['access'] = array (
		'#type'=>'select',
		'#options'=>$options,
		'#default_value'=>$characters['st'],
		);
	}
    $form['characters'][$key]['weight'] = array(
      '#type' => 'textfield',
      '#default_value' => $characters['rank'],
      '#size' => 3,
    	'#attributes' => array('class' => array('rank-weight')),
    );
  }
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
	'#submit' => array('form_table_example_form_submit'),
  );

  return $form;
}

function form_table_example_form_submit($form, &$form_state) {
  uasort($form_state['values']['characters'], 'drupal_sort_weight');
 
  foreach($form_state['values']['characters'] as $v) {
	  
  update_files_weight($v);
  }
}
function update_notes($n,$t,$fid) {
	
	db_update('lesson_files')
    ->fields(array(
      'notes' => $n,
      'description' => $t,
    ))
    ->condition('fid', $fid)
    ->execute();
	
}
function update_files_weight($arr) {
	
	db_update('lesson_files')
    ->fields(array(
      'status' => $arr['access'],
      'weight' => $arr['weight'],
    ))
    ->condition('fid', $arr['id'])
    ->execute();
}

function _backingtrack($form, &$form_state,$nid) {
	global $user;
	$form['characters'] = array(
    '#prefix' => '<div id="red-dwarf">',
    '#suffix' => '</div>',
    '#tree' => TRUE,
    '#theme' => 'form_table_theme_name'
  );
  $title = "mp3";
	$options = array(
  0 => 'Free',
  1 => 'Members Only',
);
	$files = load_files_mp3($nid);
	
	 foreach($files as $key => $v) {
		
		$file = file_load($v->fid);
		
		if (!is_object($file)) continue;
		
		if ($file->filemime != 'audio/mpeg') continue;
		
	$form['characters'][$key]['name'] = array(
      '#type' => 'textfield',
      '#default_value' => $file->filename,
         	
    );
	$form['characters'][$key]['id'] = array(
      '#type' => 'hidden',
      '#default_value' => $file->fid,
         	
    );
	$form['characters'][$key]['operations'] = array (
		'#markup' => l(t("Delete"),'admin/icp/'.$nid.'/'.$title.'/lm2/'.$file->fid.'/backtracking/delete'),
		);
		
	if ( in_array('administrator',$user->roles) ) {
	$form['characters'][$key]['access'] = array (
		'#type'=>'select',
		'#options'=>$options,
		'#default_value'=>$v->status,
		);
	}	
	
	 $form['characters'][$key]['weight'] = array(
      '#type' => 'textfield',
      '#default_value' => $v->weight,
      '#size' => 3,
    	'#attributes' => array('class' => array('rank-weight')),
    );
	 }
	 
	 $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
	'#submit' => array('renameMp3'),
  );
  
  
  
  return $form;
}



function renameMp3($form, &$form_state) {
	
  uasort($form_state['values']['characters'], 'drupal_sort_weight');
   foreach($form_state['values']['characters'] as $v) {
	  
	   $f = file_load($v['id']);
	   $f->filename = $v['name'];
	   file_save($f);
	   update_files_weight($v);
  }
}
?>