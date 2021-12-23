#!/usr/bin/php -q 
<?php
require('phpagi/phpagi.php');
$agi = new AGI();
$agi->verbose("ProviderNumber: ".$argv[1]);
if (!isset($argv[1]) && !isset($argv[2]) && !isset($argv[3])) { 
	  $agi->verbose("ProviderNumber: Wrong data");
	  $agi->set_variable("CorrectNnumber",$argv[1]);
} else {
	if(substr($argv[1], 0,1) == "9") {
		$agi->set_variable("CALLERID(num)",$argv[2]);
		$agi->set_variable("CorrectNnumber",$argv[3].substr($argv[1], 2));
	} else {
		$agi->set_variable("CorrectNnumber",$argv[1]);
	}
}
       
?>
