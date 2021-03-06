<?php

$files = glob('tmp/*');
$action = 'list';

if( isset($_POST['action']) && $_POST['action'] != ''){
  $action = $_POST['action'];
}

if($action == 'list'){
  if(count($files) == 0){
    echo 0;
  }  else {
    echo str_replace("tmp/", "", explode(".", $files[0])[0]);
  }
}

// Save image from URL
function getimg($url) {         
    $headers[] = 'Accept: image/gif, image/x-bitmap, image/jpeg, image/pjpeg, image/png';              
    $headers[] = 'Connection: Keep-Alive';         
    $headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8';         
    $user_agent = 'php';         
    $process = curl_init($url);         
    curl_setopt($process, CURLOPT_HTTPHEADER, $headers);         
    curl_setopt($process, CURLOPT_HEADER, 0);         
    curl_setopt($process, CURLOPT_USERAGENT, $user_agent);
    curl_setopt($process, CURLOPT_TIMEOUT, 30);         
    curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);         
    curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);         
    $return = curl_exec($process);         
    curl_close($process);         
    return $return;     
} 

// Generate images
if ($action == 'generate') {

  // Clear old images
  foreach($files as $file){
    if(is_file($file)) {
      unlink($file);
    }
  }

  $img_id = date("YmdHis");
  $imgpath = "tmp/${img_id}.jpg";
  if($_POST['isUrl'] == 'true'){
      $imgurl = $_POST['data'];
      copy($imgurl, $imgpath);
  } else {
      $extension = explode('/', mime_content_type($_POST['data']))[1];
      $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $_POST['data']));
      file_put_contents("tmp/${img_id}.jpg", $data);
  }

  // Posterize
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,2,0,0,1,0 -output tmp/' . $img_id . '_pz1.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,4,0,0,1,0 -output tmp/' . $img_id . '_pz2.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,6,0,0,1,0 -output tmp/' . $img_id . '_pz3.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,10,0,0,1,0 -output tmp/' . $img_id . '_pz4.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,12,0,0,1,0 -output tmp/' . $img_id . '_pz5.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,16,0,0,1,0 -output tmp/' . $img_id . '_pz6.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_posterize 150,30,1,20,0,0,1,0 -output tmp/' . $img_id . '_pz7.jpg');

  // Vectorize
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 3 -output tmp/' . $img_id . '_vc1.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 6 -output tmp/' . $img_id . '_vc2.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 7 -output tmp/' . $img_id . '_vc3.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 8 -output tmp/' . $img_id . '_vc4.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 9 -output tmp/' . $img_id . '_vc5.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 9.2 -output tmp/' . $img_id . '_vc6.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 9.4 -output tmp/' . $img_id . '_vc7.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 9.6 -output tmp/' . $img_id . '_vc8.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 9.8 -output tmp/' . $img_id . '_vc9.jpg');
  exec('gmic -input ' . $imgpath . ' -fx_vector_painting 9.9 -output tmp/' . $img_id . '_vc10.jpg');

  // Restore details
  exec('gmic -input ' . $imgpath . ' -fx_freaky_details 2,10,1,11,0,32,0 -output tmp/' . $img_id . '_fd.jpg');

  // Outlines
  exec('gmic -input ' . $imgpath . ' -edges 24% -normalize 0,255 -output tmp/' . $img_id . '_ol1.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 18% -normalize 0,255 -output tmp/' . $img_id . '_ol2.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 14% -normalize 0,255 -output tmp/' . $img_id . '_ol3.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 9% -normalize 0,255 -output tmp/' . $img_id . '_ol4.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 6% -normalize 0,255 -output tmp/' . $img_id . '_ol5.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 4% -normalize 0,255 -output tmp/' . $img_id . '_ol6.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 2% -normalize 0,255 -output tmp/' . $img_id . '_ol7.jpg');
  exec('gmic -input ' . $imgpath . ' -edges 1% -normalize 0,255 -output tmp/' . $img_id . '_ol8.jpg');

  echo $img_id;
}

?>
