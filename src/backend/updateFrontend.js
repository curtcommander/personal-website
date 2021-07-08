#!/usr/bin/env node
'use strict';

const axios = require('axios');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const aws = require('aws-sdk');

const { getTokenInstagram } = require('./tokenInstagram');

const s3 = new aws.S3();
axios.defaults.baseURL = 'https://graph.instagram.com';
const bucket = 'curtcommander-personal-website';
const prefix = 'images/instagram';

updateWebsite()
.catch(console.log)

async function updateWebsite() {
    const idsS3 = await _getIdsS3();
    const posts = await _getMediaData();
    for (const post of posts) {
        if (!idsS3.includes(post.id)) {            
            // process image
            await _processImage(post.media_url, post.id);

            // add post to website gallery
            const [captionEN, captionSP] = post.caption.split('\n\n');
        }
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
        const id = filename.split('.')[0];
        ids.push(id);
    }
    return ids;
}

async function _getMediaData() {
    const tokenInstagram = await getTokenInstagram();
    const dataGetMedia = {
        fields: 'id, caption, media_url',
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
    const bufferWebp = await sharp(pathImage).webp().toBuffer();
    
    // updload webp image to s3
    const params = {
        Bucket: bucket,
        Key: `${prefix}/${id}.webp`,
        Body: bufferWebp
    };
    await s3.putObject(params).promise();

    // delete image originally downloaded
    fs.unlinkSync(pathImage);
}
