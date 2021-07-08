//////////////////////////////////////////
/// toggle caption and image selection ///
//////////////////////////////////////////

// toggle caption when image clicked (smaller screens)
$(document).ready(function() {
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
    
})

// toggle image selection
var events = 'click touch'
var flagCaption = false;
$( document ).ready(function() {
    $( '.div-images' ).on(events, function() {
        // add image background and display caption text
        if (!flagCaption) {
            $( '.img-background' ).css('background-color', '#2a3457');
            $( '.caption' ).css('display', 'unset');
            flagCaption = true;
        }
        _toggleCaption($(this).find('img'));
    });
})

function _toggleCaption(t) {
    if (t.hasClass('clicked')) {
        t.removeClass('clicked');
    } else {
        $( '.div-images img' ).removeClass('clicked');
        t.addClass('clicked');
    }
}

// unselect image
$( '*' ).on(events, function(e) {
    window.e = e;
    if (e.target.nodeName !== 'IMG' && e.target.classList[0] !== 'info' && e.target.id !== 'language' ) {
       $( '.div-images img' ).removeClass('clicked');
    }
})

//////////////////////////////
/// adjust caption heights ///
//////////////////////////////

function adjustCaptionHeight() {
    var heightImg = $( '.div-images img' ).height();
    if (!heightImg) {
        return setTimeout(adjustCaptionHeight, 100);
    }
    $( '.caption' ).each(function () {
        cap = $(this);
        var top = (heightImg - cap.height())/2;
        cap.css('top', top);
    });
}

$( document ).ready(adjustCaptionHeight);

//const width = $(window).width()
//const height = $(window).height();
$(window).resize(function() {
    setTimeout(function() {
        adjustCaptionHeight();
        if($(window).width() != width || $(window).height() != height) {
            adjustCaptionHeight();
        }
    }, 10);
});