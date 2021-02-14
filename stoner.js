
// This setting requires your copy of Painting Stoner to be
// running on a web server with PHP and GIMP-GMIC installed.
// More info: https://github.com/olaviinha/painting-stoner
var gmicSupport = true;

// Elements
var el = {
    img: '#original',
    fimg: '#filtered',
    imgcont: '#bothimages',
    settingSlidersContainer: '.setting.sliders',
    filterSlidersContainer: '.filter.sliders',
    loader: '.loader'
}

var container = $('#container');
var img = $('.img');
var pts = $('.pt');
var loadWait = 3000;
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
    targetPoint.x = e.pageX - container.offset().left;
    targetPoint.y = e.pageY - container.offset().top;
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
var bgVal = 'rgb(0,0,0)';
var cursorSize = 64;
var stamp, fimg, fader, fadeIn, defImg;

function customCursor(color=bgVal, size=cursorSize){
    half = Math.round(size/2);
    var curUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="'+color+'" width="'+size+'" height="'+size+'"><circle cx="'+half+'" cy="'+half+'" r="'+half+'"/></svg>';
    $('#container').css({'cursor': 'url(\''+curUrl+'\') '+half+' '+half+', default'});
}

function resetCursor(){
    $('#container').css({'cursor': 'move'});
}

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
    var imgw = $(el.img).width();
    var imgh = $(el.img).height();
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
        if( $(el.imgcont).css('opacity') == range[0]){
            new_opa = range[1];
        } else {
            new_opa = range[0];
        }
        $(el.imgcont).animate({'opacity': new_opa}, fade*1000);
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
        $(el.imgcont).animate({'opacity': new_opa}, fade*1000);
    }
}

function resizeContainer(){
   var imgw = $(el.img).width();
   var imgh = $(el.img).height();
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


function addSlider(name, changeImage=false, container=el.filterSlidersContainer){
    code = name.replaceAll(' ', '');
    backendClass = 'fe';
    if(changeImage){
        backendClass = 'be';
    }
    var sliderTpl = '<div class="sldr sldr-'+code+' '+backendClass+'"><div class="title">'+name+'<span class="val"></span></div><div class="slider '+code+'"></div></div>'
    $(container).append(sliderTpl);
}

function updateVal(el, val){
    var min = el.slider('option', 'min');
    if(val <= min){
        el.parent().find('.val').html('');
    } else {
        el.parent().find('.val').html(val);
    }
}

function resetSlider(el){
    $(el).slider('value', $(el).slider('option', 'max'));
}

$(document).ready(function(){
    // fimg = el.img;
    fimg = el.fimg;
    fade = $('#fade').val();
    fade_on = $('#fade_on').val();
    fade_off = $('#fade_off').val();

    var contrastVal = 100;
    var brightnessVal = 100;
    var grayscaleVal = 0;
    var saturVal = 100;

    var blendMenu = '<div class="blendmode"><div class="title">Filter blend mode</div><div><input type="radio" name="blend" value="normal" checked id="blendNormal"/> <label for="blendNormal">Normal</label></div><div><input type="radio" name="blend" value="darken" id="blendDarken"/> <label for="blendDarken">Darken</label></div><div><input type="radio" name="blend" value="lighten" id="blendLighten"/> <label for="blendLighten">Lighten</label></div></div>'

    addSlider('opacity', false, el.settingSlidersContainer);
    addSlider('opacity range', false, el.settingSlidersContainer);
    addSlider('backlight', false, el.settingSlidersContainer);
    addSlider('cursor size', false, el.settingSlidersContainer);    

    addSlider('filter opacity', false, el.filterSlidersContainer);
    $(el.filterSlidersContainer).append(blendMenu);
    addSlider('bg image opacity', false, el.filterSlidersContainer);
    $(el.filterSlidersContainer).append('<hr>');

    addSlider('threshold', false, el.filterSlidersContainer);
    addSlider('contrast', false, el.filterSlidersContainer);
    addSlider('brightness', false, el.filterSlidersContainer);
    
    if(gmicSupport){
        addSlider('posterize', true, el.filterSlidersContainer);
        addSlider('vectorize', true, el.filterSlidersContainer);
        addSlider('outlines', true, el.filterSlidersContainer);
    }

    $('.opacity').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        value: 1,
        animate: 'fast',
        slide: function(e, ui) {
            opacity = ui.value;
            $(el.imgcont).css('opacity', opacity);
            
            if(Math.round(opacity * 100) == 100){
                $(this).parent().find('.val').html('');
            } else {
                $(this).parent().find('.val').html(Math.round(opacity * 100) + '%');
            }
        }
    });

    $('.bgimageopacity').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        value: 1,
        animate: 'fast',
        slide: function(e, ui) {
            opacity = ui.value;
            $(el.img).css('opacity', opacity);
            
            if(Math.round(opacity * 100) == 100){
                $(this).parent().find('.val').html('');
            } else {
                $(this).parent().find('.val').html(Math.round(opacity * 100) + '%');
            }
        }
    });

    $('.filteropacity').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        value: 1,
        animate: 'fast',
        slide: function(e, ui) {
            opacity = ui.value;
            $(fimg).css('opacity', opacity);
            
            if(Math.round(opacity * 100) == 100){
                $(this).parent().find('.val').html('');
            } else {
                $(this).parent().find('.val').html(Math.round(opacity * 100) + '%');
            }
        }
    });

    $('.opacityrange').slider({
        min: 0, 
        max: 1, 
        step: 0.01,
        values: oparange,
        animate: 'fast',
        range: true,
        slide: function(e, ui) {
            oparange = ui.values;
        }
    });

    $('.backlight').slider({
        min: 0, 
        max: 255, 
        step: 1,
        value: 0,
        animate: 'fast',
        slide: function(e, ui) {
            bgVal = ui.value;
            bgVal = 'rgb('+bgVal+','+bgVal+','+bgVal+')';
            $('body').css('background', bgVal);
            updateVal($(this), ui.value);
        }
    });

    $('.contrast').slider({
        min: 100, 
        max: 300, 
        step: 1,
        value: 100,
        animate: 'fast',
        slide: function(e, ui) {
            contrastVal = ui.value;
            updateFilter(fimg, 'contrast', contrastVal+'%');
            var saturVal = (100-ui.value/3)+50;
            updateFilter(fimg, 'saturate', saturVal+'%');
            updateVal($(this));
            updateVal($(this), ui.value);
        }
    });

    $('.brightness').slider({
        min: 100, 
        max: 300, 
        step: 1,
        value: 100,
        animate: 'fast',
        slide: function(e, ui) {
            brightnessVal = ui.value;
            updateFilter(fimg, 'brightness', brightnessVal+'%');
            updateVal($(this), ui.value);
        }
    });

    $('.cursorsize').slider({
        min: 5, 
        max: 128,
        step: 1,
        value: 64,
        animate: 'fast',
        slide: function(e, ui) {
            cursorSize = ui.value;
            customCursor(bgVal, cursorSize);
            updateVal($(this), ui.value);
        }
    });

    $('.threshold').slider({
        min: 49, 
        max: 300, 
        step: 1,
        value: 49,
        animate: 'fast',
        slide: function(e, ui) {
            if(ui.value > 50){
                var brightnessVal = ui.value;
                updateFilter(fimg, 'brightness', brightnessVal+'%');
                updateFilter(fimg, 'grayscale', '100%');
                updateFilter(fimg, 'contrast', '5000%');
            } else {
                updateFilter(fimg, 'brightness', '100%');
                updateFilter(fimg, 'grayscale', grayscaleVal+'%');
                updateFilter(fimg, 'contrast', contrastVal+'%');
                
            }
            updateVal($(this), ui.value);
        }
    });

    if(gmicSupport){
        $('.posterize').slider({
            min: 1, 
            max: 8, 
            step: 1,
            value: 8,
            animate: 'fast',
            start: function(e, ui) {
                resetSlider('.vectorize');
                resetSlider('.outlines');
            },
            slide: function(e, ui) {
                if(ui.value == $(this).slider('option', 'max')){
                    $(fimg).attr('src', defImg);
                } else {
                    $(fimg).attr('src', 'tmp/'+stamp+'_pz'+ui.value+'.jpg');
                }
            }
        });

        $('.vectorize').slider({
            min: 1, 
            max: 11, 
            step: 1,
            value: 11,
            animate: 'fast',
            start: function(e, ui) {
                resetSlider('.posterize');
                resetSlider('.outlines');
            },
            slide: function(e, ui) {
                if(ui.value == $(this).slider('option', 'max')){
                    $(fimg).attr('src', defImg);
                } else {
                    $(fimg).attr('src', 'tmp/'+stamp+'_vc'+ui.value+'.jpg');
                }
            }
        });

        $('.outlines').slider({
            min: 1, 
            max: 8, 
            step: 1,
            value: 8,
            animate: 'fast',
            start: function(e, ui) {
                resetSlider('.posterize');
                resetSlider('.vectorize');
            },
            slide: function(e, ui) {
                if(ui.value == $(this).slider('option', 'max')){
                    $(fimg).attr('src', defImg);
                } else {
                    $(fimg).attr('src', 'tmp/'+stamp+'_ol'+ui.value+'.jpg');
                }
            }
        });
    }

    $('.controls input').bind('keyup', function(){
        fade = $('#fade').val();
        fade_on = $('#fade_on').val();
        fade_off = $('#fade_off').val();
        if(xplay == true){
            stopFader(el.imgcont);
            setTimeout(function(){
                playFader(el.imgcont);
            }, 100);
        }
    });

    $('.toggle').click(function(){
        if(xplay==false){
            playFader(el.imgcont);
            $(this).html('<i class="fas fa-pause"></i>');
        } else {
            stopFader(el.imgcont);
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
            $(el.imgcont).addClass('dashed');
            $('.img').addClass('dotted');
        } else {
            $('.gridi').animate({'opacity': 0}, spd);
            $(el.imgcont).removeClass('dashed');
            $('.img').removeClass('dotted');
        }
    });

    $('#show_image').change(function(){
        if($(this).is(':checked')){
            $(el.imgcont).animate({'opacity': 1}, spd);
        } else {
            $(el.imgcont).animate({'opacity': 0}, spd);
        }
    });

    $('#grayscale').change(function(){
        if($(this).is(':checked')){
            updateFilter(fimg, 'grayscale', '100%');
        } else {
            updateFilter(fimg, 'grayscale', '0%');
        }
    });

    $('#invert').change(function(){
        if($(this).is(':checked')){
            updateFilter(fimg, 'invert', '100%');
        } else {
            updateFilter(fimg, 'invert', '0%');
        }
    });

    $('#details').change(function(){
        if($(this).is(':checked')){
            $(fimg).attr('src', 'tmp/'+stamp+'_fd.jpg');
        } else {
            $(fimg).attr('src', defImg);
        }
    });


    $('.bgimageopacity').slider({disabled: true});
    $('.bgimageopacity').prev().css('opacity', .5);
    $('input[type="radio"]').change(function(){
        var val = $(this).val();
        $(fimg).css('mix-blend-mode', val);
        if(val=='normal'){
            $('.bgimageopacity').slider({disabled: true});
            $('.bgimageopacity').prev().css('opacity', .5);
        } else {
            $('.bgimageopacity').slider({disabled: false});
            $('.bgimageopacity').prev().css('opacity', 1);
        }
    });

    $('#imgurl').change(function(){
        $(fimg).attr('src', $(this).val());
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
            // $('.help').css('top', '-60px');
            $('.help .content').slideUp(spd, function(){
                $('.help').animate({'top': '-60px'}, 50);
            });
            $('.toggle-help').html($(this).data('closed'));
        } else {
            $('.help').css('top', 0);
            $('.help .content').slideDown(spd, function(){
                
            });
            $('.toggle-help').html($(this).data('open'));
        }
    });

    $('.toggle-controls').html($('.toggle-controls').data('open')).click(function(){
        if( parseInt($('.controls').css('top')) > -50){
            var cHei = $('.controls').height() - 15;
            $('.controls').animate({'top': -cHei+'px'}, spd);
            $('.toggle-controls').html($(this).data('closed'));
        } else {
            $('.controls').animate({'top': '0'}, spd);
            $('.toggle-controls').html($(this).data('open'));
        }
    });

    $('#container').draggable();
    $('#container').draggable('disable');

    $('.img').mouseenter(function(){
        $('#container').draggable('enable');
        customCursor(bgVal, cursorSize);
    }).mousedown(function(){
        resetCursor();
    }).mouseup(function(){
        customCursor(bgVal, cursorSize);
    }).mouseleave(function(){
        $('#container').draggable('disable');
        resetCursor();
    });

    $('.pt').mouseenter(function(e){
        $('#container').draggable('disable');
    }).mouseup(function(e){
        // e.stopPropagation();
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
    if(gmicSupport){
        showLoader('Generating images. Please hold.');
    }
    img.find('.instructions').remove();
    file = files[0]
    if (file.type.indexOf("image") == 0) {
        var reader = new FileReader();
        reader.onload = function(e) {
            showInputImage(e.target.result, gmicSupport);
        }
        reader.readAsDataURL(file);
    }
}


function imgAsBase64(pasteEvent, callback, imageFormat){
    if(pasteEvent.clipboardData == false){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };
    var items = pasteEvent.clipboardData.items;
    if(items == undefined){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };
    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") == -1) continue;
        var blob = items[i].getAsFile();
        var mycanvas = document.createElement("canvas");
        var ctx = mycanvas.getContext('2d');
        var img = new Image();
        img.onload = function(){
            mycanvas.width = this.width;
            mycanvas.height = this.height;
            ctx.drawImage(img, 0, 0);
            if(typeof(callback) == "function"){
                callback(mycanvas.toDataURL(
                    "image/jpeg", 1.0
                ));
            }
        };
        var URLObj = window.URL || window.webkitURL;
        img.src = URLObj.createObjectURL(blob);
    }
}

function showLoader(msg){
    $(el.loader).find('.msg').html(msg);
    $(el.loader).css('opacity', 1).show();
}

function hideLoader(){
    $(el.loader).animate({'opacity': 0}, spd, function(){
        $(this).hide();
        $(this).find('.msg').html('Please hold.');
    });
}

function preloadImages(id){
    $('.preloader').remove();
    $('body').append('<div class="preloader" style="position:absolute;top:-9999px;left:-9999px;"></div>');
    if(prl) clearTimeout(prl);

    var prl = setTimeout(function(){
        $('.preloader').append('<img src="tmp/'+id+'_pz1.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_pz2.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_pz3.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_pz4.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_pz5.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_pz6.jpg">');

        $('.preloader').append('<img src="tmp/'+id+'_vc1.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc2.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc3.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc4.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc5.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc6.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc7.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc8.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc9.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_vc10.jpg">');

        $('.preloader').append('<img src="tmp/'+id+'_fd.jpg">');

        $('.preloader').append('<img src="tmp/'+id+'_ol1.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol2.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol3.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol4.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol5.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol6.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol7.jpg">');
        $('.preloader').append('<img src="tmp/'+id+'_ol8.jpg">');
    }, loadWait);
}

function isValidUrl(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

function fixTransformableFrame(delay) {
    setTimeout(function(){
        console.log('fix transform frame');
        resizeFrames();
        initFreeTransform();
        $('#container').find('img').animate({'opacity': 1}, spd);
        $('.img').css('transform', 'none');
        hideLoader();
    }, delay);
}

function showInputImage(imageData, gmic, isUrl=false){
    if(gmic){
        $.ajax({
            type: 'POST',
            url: 'gmic.php',
            // async: false,
            data: {
                'action': 'generate',
                'isUrl': isUrl,
                'data': imageData
            },
            beforeSend: function(){
                img.find('.instructions').remove();
                showLoader('Generating images. This may take a few minutes.<br>Please hold.');
            },
            fail: function(resp){
                console.log('FAIL', resp);
            },
            success: function(resp){
                stamp = resp;
                defImg = 'tmp/'+resp+'.jpg';
                $(el.img).attr('src', defImg);
                $(el.fimg).attr('src', defImg);
                preloadImages(resp);
                fixTransformableFrame(loadWait);
                $('.be').show();
            }
        });
    } else {
        $(el.img).attr('src', imageData);
        fixTransformableFrame(20);
    }
}

function initEvents(){

    var obj = $("#container");
    obj.on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('outline', '10px solid #ff9');
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

    if(gmicSupport){
        $.ajax({
            type: 'POST',
            url: 'gmic.php',
            // async: false,
            data: {
                'action': 'list',
                'isUrl': false
            },
            beforeSend: function(){
                showLoader('Loading. Please hold.');
            },
            fail: function(resp){
                console.log('FAIL', resp);
            },
            success: function(resp){
                if(resp > 0){
                    img.find('.instructions').remove();
                    stamp = resp;
                    defImg = 'tmp/'+resp+'.jpg';
                    $(el.img).attr('src', defImg);
                    $(el.fimg).attr('src', defImg);
                    preloadImages(resp);
                    fixTransformableFrame(loadWait);
                    $('.be').show();
                }
            }
        });
    }

    window.addEventListener('paste', function(e){
        var clipboardData = e.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');
        if(isValidUrl(pastedData)){
            showInputImage(pastedData, gmicSupport, true);
        } else {
            $.each(clipboardData.items, function (i, item) {
                if (item.type.indexOf('image') !== -1) {
                    imgAsBase64(e, function(imageDataBase64){
                        if(imageDataBase64){
                            showInputImage(imageDataBase64, gmicSupport);
                        }
                    });
                }
            });
        }
    });
}

$(document).ready(function () {
    initEvents();
});
