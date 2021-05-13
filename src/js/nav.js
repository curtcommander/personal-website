var pages = ['career', 'projects', 'gallery'];
function highlightNav() {
    if ($( window ).outerWidth(true) >= 576) {  
        for (p=0; p<pages.length; p++) {
            if (window.location.href.search(pages[p]) != -1) {
                const queryString = '#link-'+pages[p];
                if ($( queryString ).length == 1) {
                    $( queryString ).css({
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
$( document ).ready(() => {
    highlightNav()
    // include line below so terser doesn't drop switchLanguage
    $( '#language' ).on('click', switchLanguage);
});
$( document ).on('load', highlightNav);
$( window ).on('resize', highlightNav);

// updated with data in translations.json
const translations = {};

function switchLanguage() {
    const elementLang = $('#language'); 
    const language = elementLang.html();

    // switch language displayed
    if (language === 'English') {
        elementLang.html('Español');
    } else if (language === 'Español') {
        elementLang.html('English');
    }
    
    // insert tranlations by id
    const translationsLang = translations[language];
    for (const id in translationsLang) {
        $('#'+id).html(translationsLang[id])
    }

    // adjust caption heights on career page following text change
    if (window.location.pathname.indexOf('career') > -1) {
        adjustCaptionHeight();
    }
}
