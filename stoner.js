var container = $('#container');
var img = $('.img');
var pts = $('.pt');
var IMG_WIDTH = 600;
var IMG_HEIGHT = 600;
var transform, filter;

function initFreeTransform(){
    transform = '';
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
var fade = 0.1;
var fade_on = 1;
var fade_off = 2;
var xplay = false;
var xfull = false;
var xchange = false;
var xhelp = false;
var oparange = [0, 1];
var opsteps = 0;
var fimg, fader, fadeIn;

function playFader(fimg) {
    xfade = fade * 1000;
    xfade_on = fade_on * 1000;
    xfade_off = fade_off * 1000;
    fader = setInterval(function(){
        $(fimg).stop().animate({'opacity': oparange[0]}, xfade);
        fadeIn = setTimeout(function(){
            $(fimg).stop().animate({'opacity': oparange[1]}, xfade);
        }, xfade+xfade_off);
    }, xfade+xfade+xfade_on+xfade_off);
    xplay = true;
}

function stopFader(fimg) {
    clearInterval(fader);
    clearTimeout(fadeIn);
    setTimeout(function(){
        $(fimg).css('opacity', oparange[1]);
    }, 200);
    xplay = false;
}

function resizeFrames(){
     $('.img').css({'width': '600px', 'height': '600px'});
    var imgw = $('#theimg').width();
    var imgh = $('#theimg').height();
    $('#container').width(imgw);
    $('#container').height(imgh);
    $('.img').width(imgw);
    $('.img').height(imgh);
    IMG_WIDTH = imgw;
    IMG_HEIGHT = imgh;
}

function changeImageOpacity(){
    if(opsteps<=1){
        range = oparange;
        if( $('.img img').css('opacity') == range[0]){
            new_opa = range[1];
        } else {
            new_opa = range[0];
        }
        $('.img img').animate({'opacity': new_opa}, fade*1000);
    } else {
        min = oparange[0];
        max = oparange[1];
        step = max/opsteps-min;

        for(i=2; i <= opsteps; i++){
            new_opa = i*step;
            if(new_opa == step*opsteps){
                new_opa = oparange[0];
            }
        }
        $('.img img').animate({'opacity': new_opa}, fade*1000);
    }
}

function resizeContainer(){
   var imgw = $('#theimg').width();
   var imgh = $('#theimg').height();
   $('#container').width(imgw);
   $('#container').height(imgh);
}

function updateFilter(el, filter, val){
    filters = $(el).css('filter').split(' ');
    var filter_exists = false;
    if(filters.includes('none')){
        filters = [];
    }
    filters.forEach(function(xfilter, i){
        if(xfilter.indexOf(filter) > -1){
            filter_exists = true;
        }
    });
    if(filter_exists == true){
        filters.forEach(function(xfilter, i){
            if(xfilter.indexOf(filter) > -1){
                filters[i] = filter+'('+val+')';
            }
        });
    } else {
        filters.push(filter + '('+val+')');
    }
    $(el).css('filter', filters.join(' '));
}

$(document).ready(function(){
    fimg = '#theimg';
    fade = $('#fade').val();
    fade_on = $('#fade_on').val();
    fade_off = $('#fade_off').val();
    //opsteps = $('#opacity_division').val();

    $('.contrast').slider({
        min: 100, 
        max: 300, 
        step: 1,
        value: 100,
        animate: 'fast',
        slide: function(e, ui) {
            updateFilter(fimg, 'contrast', ui.value+'%');
            var satur = (100-ui.value/3)+50;
            updateFilter(fimg, 'saturate', satur+'%');
        }
    });

    $('.opaxity').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        value: 1,
        animate: 'fast',
        slide: function(e, ui) {
            opacity = ui.value;
            $(fimg).css('opacity', opacity);
        }
    });

    $('.opaxityrange').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        values: oparange,
        animate: 'fast',
        range: true,
        slide: function(e, ui) {
            oparange = ui.values;
            // $(fimg).css('opacity', opacity);
        }
    });

    $('.controls input').bind('keyup', function(){
        fade = $('#fade').val();
        fade_on = $('#fade_on').val();
        fade_off = $('#fade_off').val();
        if(xplay == true){
            stopFader(fimg);
            setTimeout(function(){
                playFader(fimg);
            }, 100);
        }
    });

    $('.toggle').click(function(){
        if(xplay==false){
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

    $(fimg).addClass('dashed');
    $('.img').addClass('dotted');

    $('#show_grid').change(function(){
        if($(this).is(':checked')){
            $('.gridi').animate({'opacity': 1}, spd);
            $(fimg).addClass('dashed');
            $('.img').addClass('dotted');
        } else {
            $('.gridi').animate({'opacity': 0}, spd);
            $(fimg).removeClass('dashed');
            $('.img').removeClass('dotted');
        }
    });


    $('#show_image').change(function(){
        if($(this).is(':checked')){
            $(fimg).animate({'opacity': 1}, spd);
        } else {
            $(fimg).animate({'opacity': 0}, spd);
        }
    });

    $('#grayscale').change(function(){
        if($(this).is(':checked')){
            updateFilter(fimg, 'grayscale', '100%');
        } else {
            updateFilter(fimg, 'grayscale', '0%');
        }
    });

    $('#high_contrast').change(function(){
        if($(this).is(':checked')){
            updateFilter(fimg, 'contrast', '150%');
        } else {
            updateFilter(fimg, 'contrast', '100%');
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

    $('#wrapper').click(function(e){
        changeImageOpacity();
    }).find('.pt').click(function(e) {
        return false;
    });

    $('.toggle-help').html($('.toggle-help').data('closed')).click(function(){
        if($('.help .content').is(':visible')){
            $('.help .content').slideUp(spd);
            $(this).html($(this).data('closed'));
        } else {
            $('.help .content').slideDown(spd);
            $(this).html($(this).data('open'));
        }
    });

    $(this).mouseup(function(){
        resizeContainer();
    });

    $(this).keyup(function(e){
        if(e.keyCode == 32){
            changeImageOpacity();
        }
    });

    setTimeout(function(){
        resizeFrames();
        initFreeTransform();
    }, 50);

});

function upper(files, obj) {
    file = files[0]
    if (file.type.indexOf("image") == 0) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#theimg').attr('src', e.target.result);
            setTimeout(function(){
                resizeFrames();
                initFreeTransform();
                $('#container').find('img').animate({'opacity': 1}, spd);
                $('.img').css('transform', 'none');
            }, 20);
        }
        reader.readAsDataURL(file);
    }
}

$(document).ready(function () {
    var obj = $("#container");
    obj.on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('outline', '10px solid #000');
        $(this).find('img').animate({'opacity': 0}, spd);
    });
    obj.on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    obj.on('mouseleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('outline', 'none');
        $(this).find('img').animate({'opacity': 1}, spd);
    });
    obj.on('drop', function (e) {
        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files;
        upper(files, obj);
        $(this).css('outline', 'none');
        e.originalEvent.dataTransfer.files = '';
    });
    $(document).on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    
});
