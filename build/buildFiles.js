#!/usr/bin/env node
'use strict';

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const { serialize } = require('../scripts/serialize');
const { switchDateFormat } = require('../src/js/switchDateFormat');

const langs = ['en', 'sp'];
const pathSrc = 'src';
const pathDest = 'dist/frontend';

const translations = JSON.parse(fs.readFileSync(`${pathSrc}/translations.json`).toString());
const filenamesHtml = ['home.html', 'career.html', 'projects.html', 'gallery.html', 'nav.html'];

buildFiles();

function buildFiles() {
    _buildFileStructure();
    _populateHtmlLang();
    _copyIconsImages();
    _copyHtml();
    _copyCssJs();
    _copyIndex();
    _copyTranslations();
    _copyResume();
}

function _buildFileStructure() {
    let paths = ['dist', pathDest];

    // base folders
    const folders = ['html', 'css', 'js', 'images', 'icons'];
    for (const folder of folders) {
        const pathFolder = `${pathDest}/${folder}`;
        paths.push(pathFolder);
    }

    // langauge folders for html
    for (const lang of langs) {
        const pathLang = `${pathDest}/html/${lang}`;
        paths.push(pathLang);
    }

    // folder for instagram images
    paths.push(`${pathDest}/images/instagram`);
    
    for (const path of paths) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
}

function _populateHtmlLang() {
    for (const filename of filenamesHtml) {
    
        // read file and get dom
        const fileString = fs.readFileSync(`${pathSrc}/html/${filename}`).toString();
        const jsdom = new JSDOM(fileString);
        const $ = require('jquery')(jsdom.window);

        for (const lang of langs) {
            // replace text using element id
            let keyLang;
            lang === 'en' ? keyLang = 'English' : keyLang = 'Español';
            for (const key in translations[keyLang]) {
                const element = $(`#${key}`);
                if (element.length) {
                    element.html(translations[keyLang][key]);
                }
            }

            // set language text in nav
            if (filename === 'nav.html') {
                if (lang === 'en') {
                    $('#language').html('ES');
                } else {
                    $('#language').html('EN');
                }
            }

            // change date formats
            if (lang === 'sp' && filename === 'gallery.html') {
                switchDateFormat($);
            }

            // write to file
            const html = serialize(jsdom);
            fs.writeFileSync(`${pathDest}/html/${lang}/${filename}`, html);
        }
    }
}

function _copyIconsImages() {
    for (const folder of ['icons', 'images']) {
        const files = fs.readdirSync(folder);
        for (const file of files) {
            // filter out files that aren't webp in images folder
            if (folder === 'icons' || path.extname(file) === '.webp') {
                fs.copyFileSync(`${folder}/${file}`, `${pathDest}/${folder}/${file}`);
            }
        }
    }
}

function _copyHtml() {
    const files = fs.readdirSync(`${pathSrc}/html`);
    for (const file of files) {
        // filter out language-specific html files
        // these files already in destination folder
        if (!filenamesHtml.includes(file)) {
            const src = `${pathSrc}/html/${file}`;
            for (const lang of langs) {
                const dest = `${pathDest}/html/${lang}/${file}`;
                fs.copyFileSync(src, dest);
            }
        }
    }
}

function _copyCssJs() {
    for (const folder of ['css', 'js']) {
        const files = fs.readdirSync(`${pathSrc}/${folder}`);
        for (const file of files) {
            fs.copyFileSync(`${pathSrc}/${folder}/${file}`, `${pathDest}/${folder}/${file}`);
        }
    }
}

function _copyIndex() {
    fs.copyFileSync(`${pathSrc}/index.html`, `${pathDest}/index.html`);
}

function _copyTranslations() {
    fs.copyFileSync(`${pathSrc}/translations.json`, `${pathDest}/translations.json`);
}

function _copyResume() {
    const filename = 'resume_curt_commander.pdf';
    const src = `docs/${filename}`;
    const dest = `${pathDest}/${filename}`;
    fs.copyFileSync(src, dest);
}
