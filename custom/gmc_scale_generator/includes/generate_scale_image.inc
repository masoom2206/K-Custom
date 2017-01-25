<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 'On');
global $base_url,$user,$note_bg,$note_hl,$notebgsize,$noteheight,$notes_img,$notewidth,$fretboard,$showcage,$strings,$pathtoimages,$pathtostoredscales,$x_coords,$y_coords,$cageposition,$cagepositions,$caption,$gstring;
//include (drupal_get_path("module","gmc_scale_generator")."/includes/_functions.inc");

/*********/
/* get parameters */
/*********/
$caption = foVal("caption") !=-1 ? foVal("caption") : "";
$gstring[1] = foVal("e1")!=-1 ? foVal("e1") : "0000000000000";
$gstring[2] = foVal("b")!=-1 ? foVal("b") : "0000000000000";
$gstring[3] = foVal("g")!=-1 ? foVal("g") : "0000000000000";
$gstring[4] = foVal("d")!=-1 ? foVal("d") : "0000000000000";
$gstring[5] = foVal("a")!=-1 ? foVal("a") : "0000000000000";
$gstring[6] = foVal("e6")!=-1 ? foVal("e6") : "0000000000000";
for ($a=1;$a<7;$a++) {
	if (strlen($gstring[$a])<14) $gstring[$a].= "0000000000000";
}
$showcage = foVal("showcage")!="true" ? false : true;
$cageposition = (int) foVal("cageposition");

if (  $cageposition< 0  || $cageposition > 8 ) {
	$showcage = false;
	$cageposition = 0;
}

$u = file_create_url(path_to_theme());

$pathtoimages = drupal_realpath(path_to_theme()."/css/")."/";

//$pathtostoredscales = drupal_realpath("public://uploads/scales/");
$pathtostoredscales = drupal_realpath("public://generatescaleimage/scales/");

$notes_img['a'] = imagecreatefrompng($pathtoimages.'images/notes/a.png');

$notes_img['as'] = imagecreatefrompng($pathtoimages.'images/notes/as.png');
$notes_img['b'] = imagecreatefrompng($pathtoimages.'images/notes/b.png');
$notes_img['c'] = imagecreatefrompng($pathtoimages.'images/notes/c.png');
$notes_img['cs'] = imagecreatefrompng($pathtoimages.'images/notes/cs.png');
$notes_img['d'] = imagecreatefrompng($pathtoimages.'images/notes/d.png');
$notes_img['ds'] = imagecreatefrompng($pathtoimages.'images/notes/ds.png');
$notes_img['e'] = imagecreatefrompng($pathtoimages.'images/notes/e.png');
$notes_img['f'] = imagecreatefrompng($pathtoimages.'images/notes/f.png');
$notes_img['fs'] = imagecreatefrompng($pathtoimages.'images/notes/fs.png');
$notes_img['g'] = imagecreatefrompng($pathtoimages.'images/notes/g.png');
$notes_img['gs'] = imagecreatefrompng($pathtoimages.'images/notes/gs.png');

$fretboard = imagecreatefromjpeg($pathtoimages.'images/fretboard_generator_883x200.jpg');

$note_bg = imagecreatefrompng($pathtoimages.'images/note_button_30_gray.png');
$note_hl = imagecreatefrompng($pathtoimages.'images/root_note_24x22.png');

$notewidth = imagesx($notes_img['a']);
$noteheight = imagesy($notes_img['a']);

$notebgsize = imagesx($note_bg);

// name of each guitar string, used to generate element ids
$strings[0] = Array( "e6","a","d","g","b","e1");

// notes on fretboard by notename
$strings[1] = Array( "E","F","FS","G","GS","A","AS","B","C","CS","D","DS","E" );
$strings[2] = Array( "B","C","CS","D","DS","E","F","FS","G","GS","A","AS","B" );
$strings[3] = Array( "G","GS","A","AS","B","C","CS","D","DS","E","F","FS","G" );
$strings[4] = Array( "D","DS","E","F","FS","G","GS","A","AS","B","C","CS","D" );
$strings[5] = Array( "A","AS","B","C","CS","D","DS","E","F","FS","G","GS","A" );
$strings[6] = Array( "E","F","FS","G","GS","A","AS","B","C","CS","D","DS","E" );

// x & y coordinates for the notes
$y_coords = Array ( 2, 32, 63, 94, 125, 156 );
$x_coords = Array ( 6, 54, 120, 191, 262, 333, 404, 475, 546, 617, 687, 756, 827 );

// left relative coordinate and width for the cage
$cagepositions = Array( 17, 301, 
						56, 333, 
						122, 338, 
						191, 339, 
						263, 339, 
						333, 340, 
						404, 338, 
						475, 337, 
						546, 340 );
						

function showNoteAt($guitarstring, $noteposition, $highlight=false) {
	global $fretboard, $note_bg, $notes_img, $note_hl, $notebgsize, $notewidth, $noteheight, $y_coords, $x_coords, $strings;
	
	$x = $x_coords[$noteposition];
	$y = $y_coords[$guitarstring-1];
	
	$note = strtolower($strings[$guitarstring][$noteposition]);
	
	imagecopy($fretboard, $note_bg, $x, $y, 0, 0, $notebgsize, $notebgsize); 
	if ($highlight) imagecopy($fretboard, $note_hl, $x+3, $y+4, 0, 0, $notewidth, $noteheight); 
		imagecopy($fretboard, $notes_img[$note], $x+3, $y+3, 0, 0, $notewidth, $noteheight); 
}

function showCageAt($position) {
	global $fretboard, $cagepositions;
	
	if ($position>8) $position = 8;
	if ($position<0) $position = 0;
	
	$x1 = $cagepositions[$position*2]-14;
	$x2 = $x1+$cagepositions[$position*2+1];
	
	imageline ($fretboard,$x1,0,$x1,187,0x00BFFF00);
	imageline ($fretboard,$x1+1,0,$x1+1,187,0x00BFFF00);
	
	imageline ($fretboard,$x2,0,$x2,187,0x00BFFF00);
	imageline ($fretboard,$x2+1,0,$x2+1,187,0x00BFFF00);
}

function makefilename() {
	global $caption, $gstring, $showcage, $cageposition;
	$filename ="gmcscale_";	
	$fileextension = ".jpg";
	
	$filename.= str_replace(" ","_",strtolower(trim($caption)))."_";	
	
	$filename.= "e1".substr($gstring[1],0,13)."_";
	$filename.= "b".substr($gstring[2],0,13)."_";
	$filename.= "g".substr($gstring[3],0,13)."_";
	$filename.= "d".substr($gstring[4],0,13)."_";
	$filename.= "a".substr($gstring[5],0,13)."_";
	$filename.= "e6".substr($gstring[6],0,13);
	
	$filename.= $showcage ? "_cage_".$cageposition : "";	
	
	$filename.= $fileextension;
	return $filename;
}		
function showScale() {
	global $fretboard, $note_bg, $note_hl, $notes_img, $gstring, $showcage, $cageposition, $caption, $pathtostoredscales;
	$filename = makefilename();	
    if( isset($_GET['path']) && preg_match('/^\w+\.jpg$/', $_GET['path']) ){
        $filename   = $_GET['path'] ;
    }
    
	if (file_exists($pathtostoredscales.'/'.$filename)) {
		drupal_goto(file_create_url('public://generatescaleimage/scales/'.$filename));
		/*$im = imagecreatefromjpeg($pathtostoredscales.'/'.$filename);
		header('Content-type: image/jpeg');
		imagejpeg($im,NULL,100);
		imagedestroy($im);
		freeimages();
		return;*/
	}
	for ($a=1;$a<7;$a++) {
		$currentstring = str_split($gstring[$a]);
		for ($b=0;$b<13;$b++) {		
			switch ($currentstring[$b]) {
				case '0':				
					break;
				case '1':
					showNoteAt($a,$b);
					break;
				case 'R':
					showNoteAt($a,$b,true);
			}
		}
	}
	if ($showcage) showCageAt($cageposition);
	imagettftext($fretboard, 9, 0, 8, 198, 0x00CCCCCC, path_to_theme()."/fonts/arial.ttf", $caption);
	imagettftext($fretboard, 9, 0, 630, 198, 0x00CCCCCC, path_to_theme()."/fonts/arial.ttf", "Scalegenerator 1.0 &#xA9; GuitarMasterClass.Net");

	//print $fretboard;exit;
	imagejpeg($fretboard,$pathtostoredscales.'/'.$filename,95);
	
	header('Content-type: image/jpeg');
	imagejpeg($fretboard,NULL,95);


	//free images
	freeimages();
}

function freeimages () {
	global $fretboard, $note_bg, $note_hl, $notes_img;
	
	imagedestroy($fretboard);
	imagedestroy($note_bg);
	imagedestroy($note_hl);

	imagedestroy($notes_img['a']);
	imagedestroy($notes_img['as']);
	imagedestroy($notes_img['b']);
	imagedestroy($notes_img['c']);
	imagedestroy($notes_img['cs']);
	imagedestroy($notes_img['d']);
	imagedestroy($notes_img['ds']);
	imagedestroy($notes_img['e']);
	imagedestroy($notes_img['f']);
	imagedestroy($notes_img['fs']);
	imagedestroy($notes_img['g']);
	imagedestroy($notes_img['gs']);  
}


function generate_scale_image() {
	//print "Hello";exit;
	showScale();
	$filename = makefilename();
	drupal_goto(file_create_url('public://generatescaleimage/scales/'.$filename));
}
?>
