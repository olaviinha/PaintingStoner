# Painting Stoner

Painting Stoner is a simple browser-based tool for optimizing projector guided painting. I.e. when you use a real-life projector to project a digital image on your real-life canvas for real-life painting, whether you use projecting for making a rough sketch, learning perspectives or even try to paint the projected image.

I developed this tool for my own purposes after purchasing a $50 projector for painting. All features are built around that cheap-ass projector's shortcomings as well as otherwise making many aspects of the process more convenient.

Painting Stoner's power lies in three key features:
1. **Free perspective transformation of image.** This enables you to keystone the image to your canvas despite the projector position or what kind of keystoning features it has. Optional guidelines are present for more accurate transform positioning.
2. **Extended opacity control with animated auto-fading.** In addition to basic opacity slider, the Stoner includes an opacity range slider where you can select two opacity values. You can easily switch between these values when necessary by clicking anywhere on page or hitting spacebar on your keyboard. You may also enable animated auto-fading between these opacity values according to duration settings (separately specified image fade time, image on-screen time and image off-screen time). This way you will see both the end result without projection and the overlaying projection on regular (fast or slow) intervals while you paint.
3. **Multiple relevant image adjustment controls** to get the projected image closer to what best suits your needs at any moment. Controls include `(Projection) backlight`, `Grayscale`, `Invert (colors)`, `Threshold`, `Contrast`, and `Brightness`. With optional backend setup, you can get a few more controls based on server-side image processing: `Details`, `Posterize` and `Vectorize`.


Tested only in [Google Chrome](https://chrome.google.com).

![Painting Stoner in action](https://storage.googleapis.com/olaviinha/github/ps-4fps.gif)
(Note that the fading animation is much smoother in reality than in this 4 frames per second gif.)

## Use the online demo (no backend support)
1. Set up your projector to project on your canvas. Remember that this tool has excessive keystoning, so you may place your projector in a position where you normally might not – The Stoner will make up for any possible shortcomings in your projector's keystoning features.
2. Open [Painting Stoner](https://inha.asia/dmo/painting-stoner).
3. Drag any image file from your computer and drop it in the yellow square (yellow square will appear on page when you drag your file on the page). Alternatively you may directly paste an image or an image URL from your clipboard.
4. Click on the <i>Full screen</i> button to enter full screen mode.
5. Drag the big red corner dots to get the image on your canvas as you wish. Easiest way to go is to crop your image to the same aspect ratio as your canvas (using some other tools) – in this case you will simply drag the big red dots onto the corners of you canvas and you're done.
6. Adjust image effect and opacity settings to whatever you find most convenient for the situation at hand.
7. Start painting.

## Setup without backend support

Place all the files of this repository on a server and you're done.

## Setup with backend support

Backend support will provide a few additional controls based on server-side image processing.

### Prerequisites
- PHP
- Gimp-G'MIC
- G'MIC

### Example installation

1. Install all prerequisites on your server. Installation procedure depends on your server setup, but for Apache2 running on Ubuntu, it should go something like this:

```
# Install PHP
sudo apt install php libapache2-mod-php
```
```
# Install Gimp-G'MIC & G'MIC: 
sudo apt install gimp-gmic
sudo apt install gmic
``` 

2. Place all the files of this repository on that server.

3. Grant PHP write permission to `tmp` directory. It is used to store processed images temporarily:

```
chown -R www-data:www-data /var/www/WHATEVER-PATH-TO/painting-stoner/tmp
```

4. Open `stoner.js` in a text editor and change `var gmicSupport` to `true`:
```
var gmicSupport = true;
```
