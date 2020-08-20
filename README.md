# 🎨 Painting Stoner

Painting Stoner is a simple tool for optimizing projection aided painting. I.e. when you use a real-life projector to project a digital image on your real-life canvas for real-life painting, whether you're learning perspectives or just want to take a shortcut though time. 

Its power lies in two features: 
1. Perspective free transformation of image. This enables you to keystone the image to your canvas despite the projector position or what kind of keystoning features it has. Optional guidelines are present for more accurate transform positioning.
2. In addition to basic opacity control, this includes an animated auto-fading of image with individual on-screen settings for fade in time, fade out time, on-screen time and off-screen time.

Tested only in [Google Chrome](https://chrome.google.com).

## Howto
1. Set up your projector to project on your canvas. Remember that this tool has excessive keystoning, so you may place your projector in a position where you normally might not – The Stoner will make up for any possible shortcomings in your projector's keystoning features.
2. Open Painting Stoner.
3. Click on the <i>Full screen</i> button to enter full screen mode.
4. Click on _Change image_ and paste URL to the image you wish to paint  –or–  place your image path directly in the source code:
```
<!-- place your image here -->
<img id="theimg" src="file:///Users/olavi/temp/painting-sketch.jpg"/>
```
5. Drag the big red corner dots to get the image on your canvas as you wish. Easiest way to go is to crop your image to the same aspect ratio as your canvas – in this case you will simply drag the big red dots onto the corners of you canvas and you're done.
6. Adjust opacity or animated auto on/off opacity for more optimized output.
7. Start painting.

## Demo

https://joku.asia/painting-stoner

![Painting Stoner](https://storage.googleapis.com/olaviinha/github/painting-stoner.gif)
