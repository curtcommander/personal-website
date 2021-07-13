////////////////
/// language ///
////////////////

let elementLang, lang;
let pageName = location.hash.slice(1);

// get translations
async function getTranlations() {
    const uri = 'translations.json';
    const req = new Request(uri);
    const res = await fetch(req);
    const text = await res.text();
    return JSON.parse(text);
}
let translations;
getTranlations().then(data => translations = data);

function handleLangReady() {
    // wait for language element
    elementLang = $('#language');
    if (elementLang.length === 0) {
        return setTimeout(handleLangReady, 100);
    }

    // switch between full words and abbreviations
    switchLayoutLanguage();

    // get lang
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
    elementLang.on('click', changeLanguage);
}
handleLangReady();

// change language
// switch between ensligh and spanish
function changeLanguage() {
    // change language text
    elementLang.html(lang);

    // get new lang
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

    // switch date format
    switchDateFormat($);

    // adjust caption heights on career page following text change
    if (['career', 'gallery'].includes(pageName)) {
        adjustCaptionHeight();
    }
}

// change language text according to width
// switch between full words and abbreviations
function switchLayoutLanguage() {
    const langText = elementLang.html();
    if (window.innerWidth >= 576) {
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
$(window).on('resize', switchLayoutLanguage);

/////////////
/// pages ///
/////////////

let links;

function handleLinksReady() {
    links = $('.link');
    if (links.length !== 4 || !lang) {
        return setTimeout(handleLinksReady, 100);
    }

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
        if (window.innerWidth >= 576) {
            unfreezeLinksWidth();
            freezeLinksWidth();
        }
    })
}
handleLinksReady();

function highlightNav() {
    links.removeClass('selected');
    $('#link-'+pageName).addClass('selected');
}

async function insertPageHTML() {
    if (pageName === '') pageName = 'home';
    
    let uri;
    if (['EN', 'English'].includes(lang)) {
        uri = `/html/en/${pageName}.html`;
    } else if (['ES', 'Español'].includes(lang)) {
        uri = `/html/sp/${pageName}.html`;
    }
    
    const req = new Request(uri);
    const res = await fetch(req);
    const text = await res.text();
    $('#container-main').html(text);

    switchLayoutPostcards();
}

function collapseMobileMenu() {
    if (window.innerWidth < 576) {
        $('.navbar-collapse').collapse('hide');
    }
}

$(window).on('resize', function() {
    if (window.innerWidth > 576) {
        $('.navbar-collapse').collapse('hide');
    }
})

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

$(window).on('resize', function() {
    if (window.innerWidth < 576) {
        unfreezeLinksWidth();
    } else {
        freezeLinksWidth();
    }
})