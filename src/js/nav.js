////////////////
/// language ///
////////////////

// get translations
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

let elementLang, lang;
function  handleLangReady() {
    // wait for language element
    elementLang = $('#language');
    if (elementLang.length === 0) {
        return setTimeout(handleLangReady, 100);
    }

    // switch between full words and abbreviations
    switchLanguageText();

    const langText = elementLang.html();
    if (langText === 'English') {
        lang = 'Español';
    } else if (langText === 'Español') {
        lang = 'English';
    } else if (langText === 'EN') {
        lang = 'ES';
    } else {
        lang = 'EN';
    }

    // bind click event to language elements
    elementLang.on('click', function() {
        return changeLanguage();
    });
}
handleLangReady();

// change language
function changeLanguage() {
    // change language text
    elementLang.html(lang);
    if (lang === 'English') {
        lang = 'Español';
    } else if (lang === 'Español') {
        lang = 'English';
    } else if (lang === 'EN') {
        lang = 'ES';
    } else {
        lang = 'EN';
    }
    
    // insert tranlations by id
    let keyLang;
    if (lang === 'EN') {
        keyLang = 'English';
    } else if (lang === 'ES') {
        keyLang = 'Español';
    } else {
        keyLang = lang;
    }
    const translationsLang = translations[keyLang];
    for (const id in translationsLang) {
        $('#'+id).html(translationsLang[id])
    }

    // adjust caption heights on career page following text change
    if (location.hash.slice(1) === 'career') {
        adjustCaptionHeight();
    }
}

// switch language text according to width
function switchLanguageText() {
    const langText = elementLang.html();
    if ($(window).outerWidth(true) >= 576) {
        if (langText === 'EN') {
            elementLang.html('English');
            lang = 'Español';
        } else if (langText === 'ES') {
            elementLang.html('Español');
            lang = 'English';
        }
    } else {
        if (langText === 'English') {
            elementLang.html('EN');
            lang = 'ES';
        } else if (langText === 'Español') {
            elementLang.html('ES');
            lang = 'EN';
        }
    }
}
$(window).on('resize', switchLanguageText);

/////////////
/// pages ///
/////////////

let links, pageName;
function handleLinksReady() {
    links = $('.link');
    if (links.length !== 3 || !lang) {
        return setTimeout(handleLinksReady, 100);
    }

    pageName = location.hash.slice(1);

    // initial nav highlight
    highlightNav();

    // insert page content into body
    // dependent on value of lang
    insertPageHTML();

    // bind click listener to page links
    links.on('click', function(e) {
        pageName = e.target.id.split('-')[1];
        if (pageName === 'home') {
            history.pushState("", document.title, window.location.pathname);
        }
        highlightNav();
        insertPageHTML();
        collapseMobileMenu();
    })

    // freeze link widths to prevent flickering
    elementLang.on('click', function() {
        unfreezeLinksWidth();
        freezeLinksWidth();
    })
}
handleLinksReady();

function highlightNav() {
    links.removeClass('selected');
    if ($(window).outerWidth(true) >= 576 && pageName) {
        $('#link-'+pageName).addClass('selected');
    }
}
$( window ).on('resize', function() { highlightNav() });

function insertPageHTML() {
    let routePrefix = '';
    if (['EN', 'English'].includes(lang)) {
        routePrefix = '/en';
    } else if (['ES', 'Español'].includes(lang)) {
        routePrefix = '/sp'
    }
    
    routePrefix = '..' + routePrefix;
    
    let url;
    if (pageName === '') {
        url = routePrefix + '/html/home.html';
    } else {
        url = routePrefix + '/html/' + pageName + '.html';
    }

    const req = new Request(url);
    fetch(req).then(function(res) {
        res.text().then(function(text) {
            $('#container-main').html(text);
            switchLayoutCareer();
        })
    })
}

function collapseMobileMenu() {
    if ($(window).outerWidth(true) < 576) {
        $('.navbar-collapse').collapse('hide');
    }
}

function unfreezeLinksWidth() {
    links.each(function() {
        $(this).width('unset');
    })
}
function freezeLinksWidth() {
    links.each(function() {
        $(this).width($(this).width());
    })    
}