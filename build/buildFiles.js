#!/usr/bin/env node
'use strict';

const { JSDOM } = require( "jsdom" );
const fs = require('fs');

const translations = JSON.parse(fs.readFileSync('src/translations.json').toString());
const filePaths = ['index.html', 'career.html', 'projects.html', 'html/nav.html'];
const langs = ['en', 'sp'];

const lang = process.argv[2];
if (langs.indexOf(lang) === -1) {
    throw new Error('specify language ("en" or "sp")');
}
let keyLang, keyLangNot;
if ( lang === 'en') {
    keyLang = 'English';
    keyLangNot = 'Español'; 
} else {
    keyLang = 'Español';
    keyLangNot = 'English';
}

buildFiles();

function buildFiles() {
    _buildFileStructure();
    for (const filePath of filePaths) {
        _populateHtmlLang(filePath);
    }
    _addJsonNav();
    _copyIconsImages();
    _copyCssJs();
    _copyResume();
    //_removeHTMLExt();
}

function _buildFileStructure() {
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    
    const pathLang = `dist/${lang}`;
    if (!fs.existsSync(pathLang)) {
        fs.mkdirSync(pathLang);
    }
    const folders = ['html', 'css', 'js', 'images', 'icons'];
    for (const folder of folders) {
        const pathFolder = `dist/${lang}/${folder}`;
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder);
        }
    }
}

function _populateHtmlLang(filePath) {
    // read file and get dom
    const fileString = fs.readFileSync(`src/${filePath}`).toString();
    const jsdom = new JSDOM(fileString);
    const $ = require('jquery')(jsdom.window);

    // replace text using element id
    for (const key in translations[keyLang]) {
        const element = $(`#${key}`);
        if (element.length) {
            element.html(translations[keyLang][key]);
        }
    }

    // set initial language in nav
    if (filePath.indexOf('nav') > -1) {
        $('#language').html(keyLangNot);
    }

    // write to file
    const html = jsdom.serialize();
    fs.writeFileSync(`dist/${lang}/${filePath}`, html);
}

// add translations object to nav.js
function _addJsonNav() {
    let navJs = fs.readFileSync('src/js/nav.js').toString();
    const translationsStatementOld = navJs.match(/const translations .*/g)[0];
    const translationsStatementNew = `const translations = ${JSON.stringify(translations)}`;
    navJs = navJs.replace(translationsStatementOld, translationsStatementNew);
    fs.writeFileSync(`dist/${lang}/js/nav.js`, navJs);
}

function _copyIconsImages() {
    for (const folder of ['icons', 'images']) {
        const files = fs.readdirSync(folder);
        for (const file of files) {
            if (folder === 'icons' || file.indexOf('drawing') === -1) {
                fs.copyFileSync(`${folder}/${file}`, `dist/${lang}/${folder}/${file}`);
            }
        }
    }
}

function _copyCssJs() {
    for (const folder of ['html', 'css', 'js']) {
        const files = fs.readdirSync(`src/${folder}`);
        for (const file of files) {
            if (['nav.html', 'nav.js'].indexOf(file) === -1) {
                fs.copyFileSync(`src/${folder}/${file}`, `dist/${lang}/${folder}/${file}`);
            } else {
            }
        }
    }
}

function _copyResume() {
    fs.copyFileSync(`docs/resume_curt_commander.pdf`, `dist/${lang}/resume_curt_commander.pdf`)
}

function _removeHTMLExt() {
    const baseNames = ['career', 'projects'];
    for (const baseName of baseNames) {
        fs.renameSync(`dist/${lang}/${baseName}.html`, `dist/${lang}/${baseName}`);
    }
}