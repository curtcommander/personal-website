function careerPage() {
    return location.hash.slice(1) === 'career';
}

function switchLayoutCareer() {
    if (careerPage()) {
        if (window.innerWidth >= 992) {
            $('.img-background > img:not(.clicked)').parent().parent().contents('.caption').removeClass('hide')
        } else {
            $('.img-background > img:not(.clicked)').parent().parent().contents('.caption').addClass('hide')
        }
    }
}

var width = $(window).width();
var height = $(window).height();
window.addEventListener('resize', function() {
    if ($(window).width() != width || $(window).height() != height) {
        switchLayoutCareer();
    }
});
