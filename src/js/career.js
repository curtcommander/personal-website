function switchLayout() {
    if (window.innerWidth >= 992) {
        $('.img-background > img:not(.clicked)').parent().parent().contents('.caption').removeClass('hide')
    } else {
        $('.img-background > img:not(.clicked)').parent().parent().contents('.caption').addClass('hide')
    }
}

$( document ).ready(switchLayout);
var width = $(window).width(), height = $(window).height();
window.addEventListener('resize', function() {
    if($(window).width() != width || $(window).height() != height) {
        switchLayout();
    }
});

// toggle caption when image clicked (smaller screens)
$( '.div-images' ).click(function() {
    const thisCaption = $(this).find('.caption');
    if (window.innerWidth < 992 ) {
         if (thisCaption.hasClass('hide')) {
            $( '.caption' ).addClass('hide');
            thisCaption.removeClass('hide');
         } else {
            thisCaption.addClass('hide');
         }
    }
})

// toggle image selection
var events = 'click touch'
function toggleCaption(t) {
    if (t.hasClass('clicked')) {
        t.removeClass('clicked');
    } else {
        $( '.div-images img' ).removeClass('clicked');
        t.addClass('clicked');
    }
}

var flagCaption = false;
$( document ).ready(function() {
    $( '.div-images' ).on(events, function(e) {
        // add image background and display caption text
        if (!flagCaption) {
            $( '.img-background' ).css('background-color', '#2a3457');
            $( '.caption' ).css('display', 'unset');
            flagCaption = true;
        }
        toggleCaption($(this).find('img'));
    });
})

// unselect image
$( '*' ).on(events, function(e) {
    window.e = e;
    if (e.target.nodeName !== 'IMG' && e.target.classList[0] !== 'info' && e.target.id !== 'language' ) {
       $( '.div-images img' ).removeClass('clicked');
    }
})

// adjust caption heights
function adjustCaptionHeight() {
    var h_img = $( '.div-images img' ).height();
    $( '.caption' ).each(function () {
        cap = $(this);
        var top = (h_img - cap.height())/2;
        cap.css('top', top);
    });
}
$( window ).on('load',adjustCaptionHeight);
var width = $(window).width(), height = $(window).height();
$(window).resize(function() {
    setTimeout(function() {
        adjustCaptionHeight();
        if($(window).width() != width || $(window).height() != height) {
            adjustCaptionHeight();
        }
    }, 10);
});