var pages = ['career', 'projects', 'gallery'];
function highlightNav() {
    if ($( window ).outerWidth(true) >= 576) {  
        for (p=0; p<pages.length; p++) {
            if (window.location.href.search(pages[p]+'.html') != -1) {
                $( '#'+pages[p]+'> a' ).css({
                    'font-weight' : '650' 
                })
                break
            }
        }   
    } else {
        $(' li a').css({
            'font-weight' : '400'
        })
    }
};
$( window ).on('load', highlightNav);
$( window ).on('resize', highlightNav);
