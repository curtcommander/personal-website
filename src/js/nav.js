const pageNames = ['career', 'projects'];

function handleReady() {
    const links = $('.nav-item');
    if (links.length === 0) {
        return setTimeout(handleReady, 100);
    }
    highlightNav();
    insertPageHTML(location.hash.slice(1));
    links.on('click', function(e) {
        const pageName = e.target.id.split('-')[1];
        highlightNav(pageName);
        insertPageHTML(pageName);
    })
}
handleReady();
$( document ).ready(function() {
    handleReady();
});

$( window ).on('resize', function() {
    highlightNav();
});

function highlightNav(pageName) {
    $('.nav-item').removeClass('selected');
    if ($(window).outerWidth(true) >= 576) {
        if (pageName) {
            $('#link-'+pageName).addClass('selected');
        } else {
            for (const pageName of pageNames) { 
                if (window.location.href.search(pageName) !== -1) {
                    $('#link-'+pageName).addClass('selected');
                    break;
                }
            }
        }
    }
};

function insertPageHTML(pageName) {
    let url;
    if (pageName === '') {
        url = 'html/home.html';
    } else {
        url = 'html/' + pageName + '.html';
    }

    const req = new Request(url);
    fetch(req).then(function(response) {
        response.text().then(function(text) {
            $('#container-main').html(text);
            switchLayoutCareer();
        })
    })
}

let translations;
function getTranlations() {
    const url = 'translations.json';
    const req = new Request(url);
    return fetch(req).then(function(response) {
        return response.text().then(function(text) {
            translations = JSON.parse(text);
        })
    })
}
getTranlations();

window.switchLanguage = function() {
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
    if (location.hash.slice(1) === 'career') {
        adjustCaptionHeight();
    }
}
