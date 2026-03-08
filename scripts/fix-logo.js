const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = 'C:/Users/jiank/.gemini/antigravity/brain/8f364737-807e-45a9-86c7-9f4805ea4632/round_1.png';
const pubDir = 'C:/antigravity/LanternELL/public/images';

async function extractCircle() {
    const image = sharp(src);

    // 1. 去除周围的黑边框，保留中间的圆形主体
    const trimmed = await image.trim({ threshold: 20 }).toBuffer();
    const trimmedMeta = await sharp(trimmed).metadata();

    // 取最短边进行正方形切割，确保完美圆形
    const size = Math.min(trimmedMeta.width, trimmedMeta.height);

    // 2. 创建一个等大的圆形 SVG 遮罩 (向内收缩 2 像素避免任何黑边残留)
    const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${(size / 2) - 3}" fill="white"/></svg>`;

    // 3. 应用遮罩，挖出带完美透明边缘的圆形 Logo
    const circularImage = await sharp(trimmed)
        .resize(size, size, { fit: 'cover' })
        .composite([{
            input: Buffer.from(circleSvg),
            blend: 'dest-in'
        }])
        .png()
        .toBuffer();

    // 4. 生成不同尺寸并覆盖原有的伪透明图片
    await sharp(circularImage).resize(200, 200).webp({ quality: 95 }).toFile(path.join(pubDir, 'logo.webp'));

    await sharp(circularImage).resize(32, 32).png().toFile('C:/antigravity/LanternELL/public/favicon-32.png');
    await sharp(circularImage).resize(16, 16).png().toFile('C:/antigravity/LanternELL/public/favicon-16.png');
    await sharp(circularImage).resize(180, 180).png().toFile('C:/antigravity/LanternELL/public/apple-touch-icon.png');
    await sharp(circularImage).resize(192, 192).png().toFile('C:/antigravity/LanternELL/public/android-chrome-192.png');
    await sharp(circularImage).resize(512, 512).png().toFile('C:/antigravity/LanternELL/public/android-chrome-512.png');
    await sharp(circularImage).resize(400, 400).webp({ quality: 90 }).toFile(path.join(pubDir, 'logo-og.webp'));

    // Favicon.ico
    await sharp(circularImage).resize(32, 32).toFormat('png').toFile('C:/antigravity/LanternELL/public/favicon.ico');

    console.log('Logo perfectly extracted and transparent favicons regenerated!');
}

extractCircle().catch(console.error);
