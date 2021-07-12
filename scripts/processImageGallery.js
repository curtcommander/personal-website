#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = { processImageGalleryBuffer };

function processImageGalleryBuffer(pathImage) {
    return sharp(pathImage)
        .resize(1080, 1080)
        .webp({ lossless: true })
        .toBuffer();
}

const pathImage = 'images/noche-de-velitas.jpg';
processImageGalleryFile(pathImage);

async function processImageGalleryFile(pathImage) {
    const bufferImage = await processImageGalleryBuffer(pathImage);
    const filename = `${path.basename(pathImage).split('.').slice(0)[0]}.webp`;
    const pathImageProcessed = `${path.dirname(pathImage)}/${filename}`;
    fs.writeFileSync(pathImageProcessed, bufferImage);
}
