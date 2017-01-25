<?php
  global $user;
  global $base_url;
  $uri = null;
  if( $uri == null ) {
      $uri = parse_url($_SERVER['REQUEST_URI']) ;
      $q = array() ;
      if( isset($uri['query']) ) {
          parse_str($uri['query'], $q);
      }
      $uri['query'] = $q ;
  }

  $_q	= $uri;
  $lick_cat = array('4165', '4166', '4167');
  if(in_array(arg(3), $lick_cat)) {
	$lessonid = db_query("SELECT n.nid AS nid FROM node n INNER JOIN field_data_field_active fa ON n.nid = fa.entity_id AND (fa.entity_type = 'node' AND fa.deleted = '0') INNER JOIN taxonomy_index t ON n.nid = t.nid LEFT JOIN draggableviews_structure ds ON n.nid = ds.entity_id AND ds.view_name = 'lick_of_the_day_admin' AND ds.view_display = 'block_1' AND ds.args = '[\"".arg(3)."\"]' WHERE t.tid = '".arg(3)."' AND n.status = '1' AND n.type IN  ('lick_of_the_day') AND fa.field_active_value = '1' ORDER BY ds.weight ASC LIMIT 0, 1")->fetchField();
  }
  else {
	$lessonid = arg(3);
  }
  $guitarlesson = load_files($lessonid);
  $node = node_load($lessonid);
	if($node->type == 'lick_of_the_day') {
		$json = array();
		$lessonid = arg(3);
		$files = $node->field_video_upload['und']['0'];
		$srcFile = drupal_realpath($files['uri']);
		$destination = str_replace(" ", "_", $srcFile);
		$file2  = file_unmanaged_copy($files['uri'], $destination, FILE_EXISTS_REPLACE);
		//print_r($file2); exit;
		$filename = str_replace(" ", "_", $files['filename']);
		$low = drupal_realpath($files2['uri'].'_qt_fast.mp4');
		exec("ffmpeg -i $destination $low");
		exec("qt-faststart $low $destination");
	   // unlink($low);
		// print "ffmpeg -i $destination $low"; exit;
		$small = file_create_url("public://lick_of_the_day/mp4/".$filename);
		$small = $small;
		$medium = $small;
		$large = $small;
		$json['parts'][] = array($small, $medium, $large);
		foreach($node->field_backtrack_upload['und'] as $files) {
			$url_backtrack = file_create_url($files['uri']);
			$json['backingtracks'][] = array('title' => '', 'id' => $files['fid'], 'nid' => $node->nid, 'length' => 100, 'fid' => $files['fid'], 'url' => $url_backtrack, NULL );
		}
		$json['tools']['Text Tab'][0] = '';
		$json['tools']['Guitar Pro'][0] = '';
		$json['tools']['pdf'][0] = '';
		$json['free_tacks'] = $freetrack;
		$json['coverlesson'] = 0;
		$json['coverd_lesson'] =''; 
	}
	else {

		$query = db_select('lesson_files', 'lf');
		$query->leftJoin('file_managed', 'fm', 'fm.fid = lf.fid');
		$_gallery = $query->fields('fm',array('fid', 'uri', 'filename', 'filemime'))->fields('lf',array('weight'))
			->condition('lf.nid', $lessonid)
			->condition('lf.publish',1, '=')
			->orderBy('lf.weight', 'ASC')
			->execute()->fetchAll();
		$laccess = $node->field_free_parts_al['und'][0]['value'];
		$laccess = str_replace(' ' ,'', $laccess);
		$vars['lesacc'] = explode(',', $laccess);
		$lesacc = $vars['lesacc'];										

		$json =array();
		$x = 1;
		foreach ($_gallery as $key => $value) {
			if ($value->filemime == 'video/mp4' || $value->filemime == 'video/x-flv' || $value->filemime == 'video/mov' || $value->filemime == 'video/quicktime') {
				if ((in_array('administrator',$user->roles) || in_array('instructor',$user->roles) || in_array('paid user',$user->roles) || $node->field_free_parts['und'][0]['value'] == 1 || in_array($key, $lesacc))) {
					if ($value->filemime == 'video/quicktime') {
						$value->filename = str_replace(".mov",".mp4",$value->filename);
					}
					if (file_exists(file_create_url("public://uploads/".$lessonid."/small_".$value->filename))) {
						$small = file_create_url("public://uploads/".$lessonid."/small_".$value->filename);
					} else {
						$small = file_create_url("public://uploads/".$lessonid."/".$value->filename);
					}
					if (file_exists(file_create_url("public://uploads/".$lessonid."/medium_".$value->filename))) {
						$medium = file_create_url("public://uploads/".$lessonid."/medium_".$value->filename);
					} else {
						$medium = file_create_url("public://uploads/".$lessonid."/".$value->filename);
					}
					if (file_exists(file_create_url("public://uploads/".$lessonid."/large_".$value->filename))) {
						$large = file_create_url("public://uploads/".$lessonid."/large_".$value->filename);
					} else {
						$large = file_create_url("public://uploads/".$lessonid."/".$value->filename);
					}
					$json['parts'][] = array($small, $medium, $large);
				} else {
					$memimage = $base_url.'/flashvideoplayer/members-only-message.png';
					$json['parts'][] = array($memimage, $memimage, $memimage);
				}
			}
		}
		foreach(load_files_mp3($lessonid) as $key => $v) {
			$value = file_load($v->fid);
			if ($value->filemime == 'audio/mpeg') {
				if ($user->uid > 0) {
					$url = file_create_url($value->uri);
				} else {
					$url = '';
				}
				if(empty($node->field_downloadable_backing['und'][0]['value'])) {
					$k = 0;
				} else {
					$k = 1;
				}
				if(!empty($node->field_downloadable_backing['und'][0]['value']) && $node->field_downloadable_backing['und'][0]['value'] == $value->fid) {
					$kk = 0;
				} else {
					$kk = $k;
				}
				if ( isset($node->field_is_cover_lesson['und'][0]['value']) && $node->field_is_cover_lesson['und'][0]['value'] == 1 ) { 
					$json['backingtracks'][] = array('title' => str_replace('.mp3', '', $value->filename), 'id' => $value->fid, 'nid' => $node->nid, 'length' => 100, 'fid' => $value->fid, 'url' => $url, NULL );
				} else { 
					if( $kk == 0 && $node->field_backing['und'][0]['value'] != 1)  {
						$acc = ($user->uid > 0)  ? true : false ;
						if ($x == 1) {
							$json['backingtracks'][] = array('title' => str_replace('.mp3', '', $value->filename), 'id' => $value->fid, 'nid' => $node->nid, 'length' => 100, 'fid' => $value->fid, 'url' => file_create_url($value->uri), 'downloadable' => $acc);
							$freetrack = file_create_url($value->uri);
						} else {
							$json['backingtracks'][] = array('title' => str_replace('.mp3', '', $value->filename), 'id' => $value->fid, 'nid' => $node->nid, 'length' => 100, 'fid' => $value->fid, 'url' => $url, NULL );
						}
						if (empty($node->field_downloadable_backing['und'][0]['value'])) {
							$x = 2;
						}
					} else {
						$json['backingtracks'][] = array('title' => str_replace('.mp3', '', $value->filename), 'id' => $value->fid, 'nid' => $node->nid, 'length' => 100, 'fid' => $value->fid, 'url' => $url, NULL );
					} 
				}
					
			}
		}
		$GuitarPro = 0;
		$PDF = 0;
		$pdf_icon  ='';
		$tab_icon='';
		$guitarPro_icon ='';
		foreach(load_files($lessonid) as $key => $v) {
				$f = file_load($v->fid);
				if (isset($f->filemime))
					$ex = explode("/",$f->filemime);		  
				
				if ($key == 0) {
							 $tab_icon = file_create_url('lesson/tabs/'.$lessonid);
							 if ($user->uid > 0) {
								 $json['tools']['Text Tab'][0] = $tab_icon;
							 } else {
								 $json['tools']['Text Tab'][0] = '';
							 }
							 $json['tools']['Text Tab'][1] = '/sites/all/themes/gmc_v2/images/tabs.jpg';
				}

				if ( strtolower($ex[1]) == 'octet-stream' && $GuitarPro == 0) { 
					 $gpro = file_create_url($f->uri); 
					 $GuitarPro = 1;
					 if ($user->uid > 0) {
						 $json['tools']['Guitar Pro'][0] = $gpro;
					 } else {
						 $json['tools']['Guitar Pro'][0] = '';
					 }
					 $json['tools']['Guitar Pro'][1] = '/sites/all/themes/gmc_v2/images/gp.jpg';
				} 
			 if (isset($f->filemime)) {
				 if ($f->filemime == 'application/pdf' && $PDF == 0) { 
						$pdf = file_create_url($f->uri); 
						$PDF = 1;
						if ($user->uid > 0) {
							$json['tools']['pdf'][0] = $pdf;
						} else {
							$json['tools']['pdf'][0] = '';
						}
						$json['tools']['pdf'][1] = '/sites/all/themes/gmc_v2/images/pdf.jpg';
				 } 
			}
		}
	
		$json['free_tacks'] = $freetrack;
		$json['coverlesson'] = 0;
		$json['coverd_lesson'] =''; 
	}
	if ( isset($_q['query']['jsonp']) ) {
		echo preg_replace('/[^\w\.]/', '_', $_q['query']['jsonp']) , ' = ' , json_encode($json) , ';' ;
		exit ;
	}
	echo json_encode($json);
