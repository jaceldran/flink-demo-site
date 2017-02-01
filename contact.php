<?php

$request = $_POST;
$request['when'] = date('d/m/y H:i');
extract($request);

$message = "
<h2>$subject</h2>
<hr>
<dl>
	<dt><br><b>From</b></dt>
	<dd>$email &lt;$name&gt;</dd>	
	<dt><br><b>Date</b></dt>
	<dd>$when;</dd>	
	<dt><br><b>Message<b></dt>
	<dd>$message;</dd>	
</dl>
";

$headers = "MIME-Version: 1.0" . "\r\n"
	. "Content-Type: text/html; Charset=ISO-8859-1" . "\r\n"
;
/*$headers = 'From: flinz@zentric.es' . "\r\n"
	'Reply-To: jaceldran@gmail.com' . "\n\n"
;*/

$sent = mail($to, $subject, $message, $headers);

header('Location: contact.html?sent=' . $sent);
