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
    $( '.div-images img' ).on(events, function(e) {
        // add image background and display caption text
        if ((!flagCaption) && ($(window).outerWidth(true) >= 992)) {
            console.log('fired');
            $( '.img-background' ).css('background-color', '#2a3457');
            $( '.caption' ).css('display', 'unset');
            flagCaption = true;
        }

        toggleCaption($(e.target));
    });
})

// unselect image
$( '*' ).on(events, function(e) {
    if (e.target.nodeName != 'IMG') {
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
window.addEventListener('resize', function() {
    if($(window).width() != width || $(window).height() != height) {
        adjustCaptionHeight();
    }
});
