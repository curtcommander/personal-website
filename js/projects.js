// taken from postcards.js (different breakpoint)
function switchLayout() {
    if ($(window).outerWidth(true) >= 768) {
        $( '.caption' ).removeClass('hide');
    } else {
        $( '.caption' ).addClass('hide');
    }
}
$( document ).ready(switchLayout);

// toggle caption when image clicked (smaller screens)
$( '.div-images' ).click(function() {
    if ($(window).outerWidth(true) < 768 ) {
        $(this).find('.caption').toggleClass('hide');
        $(this).find('.info').toggleClass('expanded');
    }
})

function adjust() {
    if ($(window).outerWidth(true) >= 768) {
        // set height of postcard
        h_window = $( window ).outerHeight(true);
        nav = 48;
        footer = 85;
        p = 30;
        h = h_window - nav - footer - p;
        $( '#container-images img' ).height(h);

        $( '.caption').width($( '#container-images img' ).width());
        $( '.img-background' ).width($( '#container-images img' ).width());
        
    } else {
        $( '#container-images img' ).height( 'auto' );
        $( '.caption' ).width('initial');
        $( '.img-background' ).width( 'initial' );
        $( '.img-background' ).unbind( 'mouseenter' ).unbind( 'mouseleave' );
    }  
}
$( document).ready(adjust);
$( window ).on('load', adjust);

var width = $(window).width(), height = $(window).height();
window.addEventListener('resize', function() {
    if($(window).width() != width || $(window).height() != height) {
        switchLayout();
        adjust();
    }
});