var container = $('#container');
var img = $('.img');
var pts = $('.pt');
var IMG_WIDTH = 600;
var IMG_HEIGHT = 600;
var transform;

function initFreeTransform(){
    transform = new PerspectiveTransform(img[0], IMG_WIDTH, IMG_HEIGHT, true);
    var tl = pts.filter(".tl").css({
        left : transform.topLeft.x,
        top : transform.topLeft.y
    });
    var tr = pts.filter(".tr").css({
        left : transform.topRight.x,
        top : transform.topRight.y
    });
    var bl = pts.filter(".bl").css({
        left : transform.bottomLeft.x,
        top : transform.bottomLeft.y
    });
    var br = pts.filter(".br").css({
        left : transform.bottomRight.x,
        top : transform.bottomRight.y
    });
    var target;
    var targetPoint;
}

function onMouseMove(e) {
    targetPoint.x = e.pageX - container.offset().left;// - 20;
    targetPoint.y = e.pageY - container.offset().top;// - 20;
    target.css({
        left : targetPoint.x,
        top : targetPoint.y
    });
    
    if(transform.checkError()==0){
        transform.update();
        img.show();
    }else{
        img.hide();
    }
}

pts.mousedown(function(e) {
    target = $(this);
    targetPoint = target.hasClass("tl") ? transform.topLeft : target.hasClass("tr") ? transform.topRight : target.hasClass("bl") ? transform.bottomLeft : transform.bottomRight;
    onMouseMove.apply(this, Array.prototype.slice.call(arguments));
    $(window).mousemove(onMouseMove);
    $(window).mouseup(function() {
        $(window).unbind('mousemove', onMouseMove);
    })
});

var spd = 300;
var fade_in = 0.5;
var fade_out = 0.5;
var fade_on = 1;
var fade_off = 2;
var xplay = false;
var xfull = false;
var xchange = false;
var fimg, fader, fadeIn;

function playFader(fimg) {
    xfade_in = fade_in * 1000;
    xfade_out = fade_out * 1000;
    xfade_on = fade_on * 1000;
    xfade_off = fade_off * 1000;
    fader = setInterval(function(){
        $(fimg).stop().animate({'opacity': 0}, xfade_out);
        fadeIn = setTimeout(function(){
            $(fimg).stop().animate({'opacity': 1}, xfade_in);
        }, xfade_in+xfade_off);
    }, xfade_in+xfade_out+xfade_on+xfade_off);
    xplay = true;
}

function stopFader(fimg) {
    clearInterval(fader);
    clearTimeout(fadeIn);
    setTimeout(function(){
        $(fimg).css('opacity', 1);
    }, 200);
    xplay = false;
}

$(document).ready(function(){
    fimg = '#theimg';

    $('.opaxity').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        value: 1,
        slide: function(e, ui) {
            opacity = ui.value;
            $(fimg).css('opacity', opacity);
        }
    });

    $('.controls input').bind('keyup', function(){
        fade_in = $('#fade_in').val();
        fade_out = $('#fade_out').val();
        fade_on = $('#fade_on').val();
        fade_off = $('#fade_off').val();
        if(xplay == true){
            stopFade(fimg);
            setTimeout(function(){
                playFader(fimg);
            }, 100);
        }
    });

    $('.toggle').click(function(){
        if(xplay==false){
            console.log('play');
            playFader(fimg);
            $(this).html('<i class="fas fa-pause"></i>');
        } else {
            stopFader(fimg);
            $(this).html('<i class="fas fa-play"></i>');
        }
    });

    $('.fullscreen').click(function(){
        if (xfull == false) {
            document.documentElement.requestFullscreen();
            $(this).html('<i class="fas fa-compress"></i>');
            xfull = true;
        } else {
            document.exitFullscreen();
            $(this).html('<i class="fas fa-expand"></i>');
            xfull = false;
        }
    });

    $('#show_grid').change(function(){
        if($(this).is(':checked')){
            $('.gridi').animate({'opacity': 1}, spd);
            $(fimg).css('outline', '2px dashed rgba(255,0,0,1)');
        } else {
            $('.gridi').animate({'opacity': 0}, spd);
            $(fimg).css('outline', 0);
        }
    });

    $('#show_image').change(function(){
        if($(this).is(':checked')){
            $(fimg).animate({'opacity': 1}, spd);
        } else {
            $(fimg).animate({'opacity': 0}, spd);
        }
    });

    $('#imgurl').change(function(){
        $('#theimg').attr('src', $(this).val());
        $('#image-changer').animate({'top': '-70px'}, spd);
    });

    $('#change_image').click(function(){
        if(xchange==false){
            $('#image-changer').animate({'top': '0px'}, spd);
            xchange = true;
        } else {
            $('#image-changer').animate({'top': '-70px'}, spd);
            xchange = false;
        }
    });

    setTimeout(function(){
        var imgw = $('#theimg').width();
        var imgh = $('#theimg').height();
        $('.img').width(imgw);
        $('.img').height(imgh);
        IMG_WIDTH = imgw;
        IMG_HEIGHT = imgh;
        initFreeTransform();
    }, 50);



});
