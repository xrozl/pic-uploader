<?php
// これ本当は危ないけど、今回はこれで
header("Access-Control-Allow-Origin: *");

function print_json ($data){
    header('Content-Type: application/json');
    echo json_encode($data);
}

if (isset($_POST['image'])) {
    // base64からimageへ
    $data = $_POST["image"];
    $data = str_replace(' ' , '+' , $data);
    $data = preg_replace('#^data:image/\w+;base64,#i' , '' , $data);
    $image = base64_decode($data);

    // fileのmimeタイプを取る
    $extension = explode(';', explode('/', $_POST['image'])[1])[0];

    // ファイルの保存
    $file_name = 'images/'.date('Y').'/'.date('m').'/'.date('d').'/'.mt_rand()."_image.{$extension}";
    $file_path = dirname(__FILE__)."/{$file_name}";
    if (!file_exists(dirname($file_path))) {
        mkdir(dirname($file_path), 0777, true);
    }
    file_put_contents($file_name, $image);

    print_json([
        'status' => 'success',
        'file_name' => $file_name,
    ]);

    
}
?>