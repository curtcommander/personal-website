#!/usr/bin/env node
'use strict';

const axios = require('axios');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const readline = require('readline');
const { JSDOM } = require('jsdom');

const { getTokenInstagram } = require('./tokenInstagram');
const { processImageGalleryBuffer } = require('./processImageGallery');
const { serialize } = require('./serialize');

const debug = true;

const pathDist = 'dist/frontend';
axios.defaults.baseURL = 'https://graph.instagram.com';

const s3 = new aws.S3();
const bucket = 'personal-website-curtcommander';
const prefix = 'images/instagram';

// get galleryImage.html from file
const htmlGalleryImage = fs.readFileSync('src/galleryImage.html').toString();
const domGalleryImage = new JSDOM(htmlGalleryImage);
const galleryImage = require('jquery')(domGalleryImage.window);

// get translations.json from file
const translations = JSON.parse(fs.readFileSync('src/translations.json').toString());

updateWebsite()
.catch(console.log)

async function updateWebsite() {
    // get gallery.html from S3 (english)
    const paramsHtmlGalleryEN = {
        Bucket: bucket,
        Key: `html/en/gallery.html`
    };
    const resHtmlGalleryEN = await s3.getObject(paramsHtmlGalleryEN).promise();
    let htmlGalleryEN = resHtmlGalleryEN.Body.toString();
    const domGalleryEN = new JSDOM(htmlGalleryEN);
    const galleryEN = require('jquery')(domGalleryEN.window);

    // get gallery.html from s3 (spanish)
    const paramsHtmlGallerySP = {
        Bucket: bucket,
        Key: `html/sp/gallery.html`
    };
    const resHtmlGallerySP = await s3.getObject(paramsHtmlGallerySP).promise();
    let htmlGallerySP = resHtmlGallerySP.Body.toString();
    const domGallerySP = new JSDOM(htmlGallerySP);
    const gallerySP = require('jquery')(domGallerySP.window);

    const idsS3 = await _getIdsS3();
    const posts = await _getMediaData();

    let idsPosts = [];
    let htmlInsertEN = '';
    let htmlInsertSP = '';
    for (const post of posts) {
        idsPosts.push(post.id);
        if (idsS3.includes(post.id)) continue;

        // process image
        await _processImage(post.media_url, post.id);
        
        // captions
        const captions = post.caption.split('\n\n');
        const captionEN = captions[0].trim();
        let captionSP;
        captions[1] ? captionSP = captions[1].trim() : captionSP = captionEN;

        // location
        let location;
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('Enter the location of the post with the following caption:\n')
        console.log(`${post.caption}\n`);
        await new Promise(resolve => {
            rl.question('Location: ', loc => {
                location = loc;
                console.log();
                rl.close();
                resolve();
            });
        })
        
        // date
        let [y, m, d] = post.timestamp.slice(0,10).split('-');
        if (m[0] === '0') m = m.slice(1);
        if (d[0] === '0') d = d.slice(1);
        const dateEN = `${m}/${d}/${y}`;
        const dateSP = `${d}/${m}/${y}`

        // gallery.html
        galleryImage('.conatiner-image').attr('id', post.id);
        galleryImage('img').attr('src', `images/instagram/${post.id}.webp`);
        galleryImage('.container-caption p').attr('id', `caption-${post.id}`);
        galleryImage('.loc').html(location);
        
        // gallery.html (english)
        galleryImage('.date').html(dateEN);
        galleryImage('.container-caption p').html(captionEN);
        htmlInsertEN += serialize(domGalleryImage);

        // gallery.html (spanish)
        galleryImage('.date').html(dateSP);
        galleryImage('.container-caption p').html(captionSP);
        htmlInsertSP += serialize(domGalleryImage);

        // translations.json
        const key = `caption-${post.id}`;
        translations['English'][key] = captionEN;
        translations['Español'][key] = captionSP;
    }

    for (const idS3 of idsS3) {
        if (!idsPosts.includes(idS3)) {
            // delete image from S3
            const paramsDeleteImageS3 = {
                Bucket: bucket,
                Key: `images/instraram/${idS3}.webp`
            };
            await s3.deleteObject(paramsDeleteImageS3).promise();        

            // remove image from gallery
            galleryEN(`#${idS3}`).remove();
            gallerySP(`#${idS3}`).remove();

            // remove from translations
            const key = `caption-${idS3}`;
            delete translations['English'][key];
            delete translations['Español'][key];
        }
    }

    // update gallery.html
    await _updateGalleryS3(domGalleryEN, htmlInsertEN, 'en');
    await _updateGalleryS3(domGallerySP, htmlInsertSP, 'sp');
    
    // update translations.json
    if (debug) {
        // write translations to dist
        fs.writeFileSync(`${pathDist}/translations.json`, JSON.stringify(translations));
    } else {
        // upload translations to S3
        const paramsPutTranslations = {
            Bucket: bucket,
            Key: `translations.json`,
            Body: JSON.stringify(translations)
        };
        await s3.putObject(paramsPutTranslations).promise();
    }
}

async function _getIdsS3() {
    const params = {
        Bucket: bucket,
        Prefix: prefix,
    }
    const res = await s3.listObjects(params).promise();

    let ids = [];
    for (const file of res.Contents) {
        const filename = file.Key.slice(params.Prefix.length);
        const id = filename.split('.')[0].slice(1);
        ids.push(id);
    }
    return ids;
}

async function _getMediaData() {
    const tokenInstagram = await getTokenInstagram();
    const dataGetMedia = {
        fields: 'id, caption, media_url, timestamp',
        access_token: tokenInstagram
    };
    const res = await axios.get(`/v11.0/me/media?${qs.stringify(dataGetMedia)}`);
    return res.data.data;
}

async function _processImage(mediaUrl, id) {
    const pathImage = path.resolve(__dirname, id);
    
    // download image
    const writer = fs.createWriteStream(pathImage);
    const res = await axios({
        url: mediaUrl,
        method: 'GET',
        responseType: 'stream'
    });
    res.data.pipe(writer);
    await new Promise((resolve, reject) => {
        writer.on('error', reject);
        writer.on('finish', resolve);
    })

    // convert image to webp buffer
    const bufferImage = await processImageGalleryBuffer(pathImage);
    
    if (debug) {
        // write webp image to dist
        fs.writeFileSync(`${pathDist}/images/instagram/${id}.webp`, bufferImage);
    } else {
        // updload webp image to s3
        const params = {
            Bucket: bucket,
            Key: `${prefix}/${id}.webp`,
            Body: bufferImage
        };
        await s3.putObject(params).promise();
    }

    // delete image originally downloaded
    fs.unlinkSync(pathImage);
}

async function _updateGalleryS3(dom, htmlInsert, lang) {
    // insert html
    let htmlGallery = serialize(dom);
    const htmlGalleryLines = htmlGallery.split('\n');
    const htmlGalleryStart = htmlGalleryLines.slice(0,2).join('\n');
    const htmlGalleryEnd = htmlGalleryLines.slice(2).join('\n');
    htmlGallery = `${htmlGalleryStart}\n${htmlInsert}${htmlGalleryEnd}`;
    
    if (debug) {
        // write gallery.html to file
        fs.writeFileSync(`${pathDist}/html/${lang}/gallery.html`, htmlGallery);
    } else {
        // upload gallery.html to s3
        const paramsPutHtmlGallery = {
            Bucket: bucket,
            Key: `html/${lang}/gallery.html`,
            Body: JSON.stringify(htmlGallery)
        };
        await s3.putObject(paramsPutHtmlGallery).promise();
    }
}