<?php
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$conn = mysqli_connect('mysql.ict.swin.edu.au', 's100590093', '280294', 's100590093_db');
mysqli_set_charset($conn,'utf8');
$input = json_decode(file_get_contents('php://input'),true);

$id = mysqli_real_escape_string($input->ItemID);
$name = mysqli_real_escape_string($input->Name);
$price = mysqli_real_escape_string($input->Price);
$stock = mysqli_real_escape_string($input->StockQty);
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));

if ($method == 'PUT')
{
	mysqli_query("UPDATE `$table` SET Name=`$name`, Price=`$price`, StockQty=`$stock` WHERE ID=`$id`"); break;
}

mysqli_close($conn);
?>
