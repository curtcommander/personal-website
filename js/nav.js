var pages = ['career', 'projects', 'gallery'];
function highlightNav() {
    if ($( window ).outerWidth(true) >= 576) {  
        for (p=0; p<pages.length; p++) {
            if (window.location.href.search(pages[p]) != -1) {
                if ($( '#'+pages[p]+'> a' ).length == 1) {
                    $( '#'+pages[p]+'> a' ).css({
                        'font-weight' : '650' 
                    })
                    break
                } else {
                    setTimeout(highlightNav, 100);
                }
                
            }
        }   
    } else {
        $(' li a').css({
            'font-weight' : '400'
        })
    }
};
highlightNav();
$( document ).ready(highlightNav);
$( document ).on('load', highlightNav);
$( window ).on('resize', highlightNav);
