//////////////////////////////////////////
/// toggle caption and image selection ///
//////////////////////////////////////////

// toggle caption when image clicked (smaller screens)
$(document).ready(function() {
    $('.container-postcard').click(function() {
        const thisCaption = $(this).find('.container-caption');
        if (
            (pageName === 'career' && window.innerWidth < 992)
        ) {
             if (thisCaption.hasClass('hide')) {
                $('.container-caption').addClass('hide');
                thisCaption.removeClass('hide');
             } else {
                thisCaption.addClass('hide');
             }
        }
    })
})

// toggle image selection
var events = 'click touch';
var flagCaption = false;
$(document).ready(function() {
    $('.container-postcard').on(events, function() {
        // add image background and display.container-caption text
        if (!flagCaption) {
            $('.container-image').css('background-color', '#2a3457');
            $('.container-caption').css('display', 'unset');
            flagCaption = true;
        }
        toggleCaption($(this).find('img'));
    });
})

function toggleCaption(t) {
    if (t.hasClass('clicked')) {
        t.removeClass('clicked');
    } else {
        $('.container-postcard img').removeClass('clicked');
        t.addClass('clicked');
    }
}

// unselect image
$('*').on(events, function(e) {
    window.e = e;
    if (e.target.nodeName !== 'IMG' && 
        e.target.classList[0] !== 'info' && 
        e.target.id !== 'language'
    ) {
       $('.container-postcard img').removeClass('clicked');
    }
})

//////////////////////////////
/// adjust caption heights ///
//////////////////////////////

function adjustCaptionHeight() {
    var heightImg = $('.container-postcard img').height();
    if (!heightImg) {
        return setTimeout(adjustCaptionHeight, 100);
    }
    $('.container-caption').each(function () {
        cap = $(this);
        var top = (heightImg - cap.height())/2;
        cap.css('top', top);
    });
}

$(document).ready(adjustCaptionHeight);
$(window).resize(function() {
    setTimeout(function() {
        adjustCaptionHeight();
        if($(window).width() != width || $(window).height() != height) {
            adjustCaptionHeight();
        }
    }, 10);
});