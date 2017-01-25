<?php
/************************************************************************/
/* IPB: Web Portal System                                               */
/* Module for 123 flash chat server software                            */
/* ==============================================                       */
/*                                                                      */
/* Copyright (c) by TopCMM                                              */
/* Daniel Jiang (support@123flashchat.com)                              */
/* http://www.topcmm.com						                        */
/* http://www.123flashchat.com                                          */
/* http://www.invisionboard.com/                                        */
/*                                                                      */
/************************************************************************/

require_once 'lib/classes/App.php';


//    Please choose the Running Mode:
//    1.Client server hosted by your own 
//    2.Client server hosted by 123flashchat.com 
//    3.Client server hosted by 123flashchat.com free of charge (default)
//*   Please choose the Running Mode. Necessary!
//*   Running mode 1, 2, 3

$running_mode=1;

if($running_mode==1){
	include "config_local.php";
}
else if ($running_mode==2){
	include "config_host.php";
}
else{
	include "config_free.php";
}

?>
