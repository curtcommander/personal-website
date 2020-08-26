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
    if (window.innerWidth < 992 ) {
        $(this).find('.caption').toggleClass('hide');
        $(this).find('.info').toggleClass('expanded');
    }
})
