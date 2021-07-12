// declare switchLayoutPostcards as global to aviod issues with terser
switchLayoutPostcards = function() {
    const queryString = '.container-image > img:not(.clicked)';
    const containersPostcard = $(queryString).parent().parent();
    const containersCaption = containersPostcard.contents('.container-caption');

    if (pageName === 'career') {
        if (window.innerWidth >= 992) {
            containersCaption.removeClass('hide');
        } else {
            containersCaption.addClass('hide');
        }
    }
}

var width = $(window).width();
var height = $(window).height();
window.addEventListener('resize', function() {
    if ($(window).width() != width || $(window).height() != height) {
        switchLayoutPostcards();
    }
});
