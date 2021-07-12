<?php

namespace Chirp;

// Original PHP code by Chirp Internet: www.chirpinternet.eu
// Please acknowledge use of this code by including this header.

class ImageSampler
{

  private $img;
  private $callback = NULL;
  private $initialized = FALSE;

  protected $percent = 5;
  protected $steps = 10;

  public $w, $h;
  public $sample_w = 0;
  public $sample_h = 0;

  public function __construct($imagefile)
  {
    if(!$this->img = imagecreatefromjpeg($imagefile)) {
      die("Error loading image: {$imagefile}");
    }
    $this->w = imagesx($this->img);
    $this->h = imagesy($this->img);
  }

  public function set_percent($percent)
  {
    $percent = intval($percent);
    if(($percent < 1) || ($percent > 50)) {
      die("Your \$percent value needs to be between 1 and 50.");
    }
    $this->percent = $percent;
  }

  public function set_steps($steps)
  {
    $steps = intval($steps);
    if(($steps < 1) || ($steps > 50)) {
      die("Your \$steps value needs to be between 1 and 50.");
    }
    $this->steps = $steps;
  }

  private function set_callback($callback)
  {
    try {
      $fn = new \ReflectionFunction($callback);
      if($fn->getNumberOfParameters() != 5) {
        throw new \ReflectionException("Invalid parameter count in callback function.  Usage: fn(int, int, int, bool) { ... }");
      }
      $this->callback = $callback;
    } catch(\ReflectionException $e) {
      die($e->getMessage());
    }
  }

  public function init()
  {
    $this->sample_w = $this->w / $this->steps;
    $this->sample_h = $this->h / $this->steps;
    $this->initialized = TRUE;
  }

  private function get_pixel_color($x, $y)
  {
    $rgb = imagecolorat($this->img, $x, $y);
    $r = ($rgb >> 16) & 0xFF;
    $g = ($rgb >> 8) & 0xFF;
    $b = $rgb & 0xFF;
    return [$r, $g, $b];
  }

  public function sample($callback = NULL)
  {
    if(!$this->initialized) {
      $this->init();
    }
    if(($this->sample_w < 2) || ($this->sample_h < 2)) {
      die("Your sampling size is too small for this image - reduce the \$steps value.");
    }

    if($callback) {
      $this->set_callback($callback);
    }

    $sample_size = round($this->sample_w * $this->sample_h * $this->percent / 100);

    $retval = [];
    for($i=0, $y=0; $i < $this->steps; $i++, $y += $this->sample_h) {
      $flag = FALSE;
      $row_retval = [];
      for($j=0, $x=0; $j < $this->steps; $j++, $x += $this->sample_w) {
        $total_r = $total_g = $total_b = 0;
        for($k=0; $k < $sample_size; $k++) {
          $pixel_x = $x + rand(0, $this->sample_w-1);
          $pixel_y = $y + rand(0, $this->sample_h-1);
          list($r, $g, $b) = $this->get_pixel_color($pixel_x, $pixel_y);
          $total_r += $r;
          $total_g += $g;
          $total_b += $b;
        }
        $avg_r = round($total_r/$sample_size);
        $avg_g = round($total_g/$sample_size);
        $avg_b = round($total_b/$sample_size);
        if($this->callback) {
          call_user_func_array($this->callback, [$avg_r, $avg_g, $avg_b, $w, !$flag]);
        }
        $row_retval[] = [$avg_r, $avg_g, $avg_b];
        $w = $pixel_x;
        $flag = TRUE;
      }
      $retval[] = $row_retval;
    }

    return $retval;
  }

}

$files = glob('tmp/*');
$img = $files[0];
$sampler = new \Chirp\ImageSampler($img);
$sampler->set_percent(15);
$sampler->set_steps(7);
$sampler->init();
$colors = array();

$sampler_callback = function($r, $g, $b, $w, $new_row) {
  global $colors;
  $color = $r . "," . $g . "," . $b;
  $entry = array(
    'w' => $w,
    'color' => $color
  );
  array_push($colors, $entry);
};

$sampler->sample($sampler_callback);

function getBright($palette, $brightness_limit=400) {

  global $max;
  global $diff_limit;

  $bright_colors = array();
  $filtered_bright_colors = array();
  $existing_sums = array();
  $ci = 0;

  foreach($palette as $i => $color) {
    $xcolor = explode(",", $color['color']);
    $sum = array_sum($xcolor);
    if(!in_array($sum, $existing_sums)) array_push($existing_sums, $sum);
  }

  $average = array_sum($existing_sums)/count($existing_sums);
  $brightness_min = $average * .1;
  $brightness_max = $average * .9;

  foreach($palette as $i => $color) {
    $xcolor = explode(",", $color['color']);
    $sum = array_sum($xcolor);

    if(!in_array($sum, $existing_sums)) array_push($existing_sums, $sum);
    if($sum >= $brightness_min && $sum <= $brightness_max) {

      foreach($existing_sums as $existing_sum){
        if( $existing_sum > $sum+$comp && $exiting_sum < $sum-$comp && !in_array($color, $bright_colors)){
          $color_entry = array(
            'w' => $color['w'],
            'color' => $color['color']
          );
          array_push($bright_colors, $color_entry);
          $ci++;
        }
      }
    }

  }

  $final_list = $bright_colors;
  sort($final_list);
  return $final_list;
}

echo json_encode( getBright($colors, 60) );

?>
