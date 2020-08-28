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
    if (e.target.nodeName != 'IMG' && e.target.classList[0] !== 'info') {
       $( '.div-images img' ).removeClass('clicked');
    }
})

// adjust caption heights
function adjustCaptionHeight() {
    console.log('adjustCaptionHeight fired')
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