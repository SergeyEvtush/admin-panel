<?php
session_start();
if($_SESSION["auth"]!=true){
	header("HTTP/1.0 403 Forbiden");
	die;
}
 $file="../../yfuy1g221b_hhg44.html";
 
 if (file_exists($file)){
 unlink($file);
 }else{
	header("HTTP/1.0 400 bad Request");
 }