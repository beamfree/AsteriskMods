#!/usr/bin/php -q 
<?php
require('phpagi/phpagi.php');
$agi = new AGI();
if (!isset($argv[1])) { 
          $agi->verbose("OneCallBusy: Device not found");
		  $agi->set_variable("OneCallBusy","n");
} else {
        $State= $argv[1];
		$agi->set_variable("OneCallBusy","n");
		switch($State) {
			case "INUSE": $agi->set_variable("OneCallBusy","y"); break;
			case "BUSY": $agi->set_variable("OneCallBusy","y"); break;
			case "RINGING": $agi->set_variable("OneCallBusy","y"); break;
			case "RINGINUSE": $agi->set_variable("OneCallBusy","y"); break;
			default:
				$agi->set_variable("OneCallBusy","n");
			break;
		}
       
}
?>
