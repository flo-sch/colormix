<?php
// PHP Proxy
// Loads a XML from any location. Used with Flash/Flex apps to bypass security restrictions
// Author: Paulo Fierro
// January 29, 2006
// usage: proxy.php?url=http://mysite.com/myxml.xml
$session = curl_init($_GET['url']); 	               // Open the Curl session
curl_setopt($session, CURLOPT_HEADER, false); 	       // Don't return HTTP headers
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);   // Do return the contents of the call
$response = curl_exec($session);                       // Make the call
// Set the content type appropriately
switch ($_GET['type']) {
	case 'xml':
		header("Content-Type: text/xml"); 	
		break;
	case 'jsonp':
		header("Content-Type: application/javascript");
	case 'json':
	default:
		header("Content-Type: application/json");
		break;
}
echo $response; 	      // Spit out the xml
curl_close($session); // And close the session
?>