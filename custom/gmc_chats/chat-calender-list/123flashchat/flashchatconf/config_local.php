<?php
/************************************************************************/
/* IPB: Web Portal System                                               */
/* Module for 123 flash chat server software                            */
/* ===========================                                          */
/*                                                                      */
/* Copyright (c) by TopCMM 									*/
/* Daniel Jiang (support@123flashchat.com)          					*/
/* http://www.topcmm.com												*/
/* http://www.123flashchat.com											*/
/*																		*/                                            
/*                                                                      */
/*                                                                      */
/************************************************************************/


//    Client swf name, it should be 123flashchat.swf.

$swf_file_name = "123flashchat.swf";



//    This parameter is used to define the room's host group name. If you have any question about this parameter,
//    please feel free to send your question to support@123flashchat.com.

$chat_group = "default" ;



//    Default: $client_size_width = "634";
//    The chat client's width, you may adjust the size of chat window to suit your needs, 100% means full screen.

$client_size_width = "634";




//    Default: $client_size_height = "476";
//    The chat client's height, you may adjust the size of chat window to suit your needs, 100% means full screen.

$client_size_height = "476";


//    Default: $chat_client_root_path = "http://www.123flashchat.com/";  
//    The client location is the string of an URL or a directory where chat client is located.

$chat_client_root_path = "http://www.guitarmasterclass.net:35555/";  

//    Default: $chat_data_path = "<123flashchat server install directory>/server/data/default/";
//    Define path information of your chat server and room information on your server.

$chat_data_path = "/opt/www/chat/TopCMM/123FlashChat97/server/data/default/"  ;

//    Default: $primary_server_host = "localhost";
//    The primary server host value.

$primary_server_host = App::deploy_domain() ;

//    Default: $primary_server_port = 51127;
//    The primary server port value.

$primary_server_port = 51127 ;


?>
