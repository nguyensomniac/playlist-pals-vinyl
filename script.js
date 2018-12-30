const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');
const Vibrant = require('node-vibrant');

const readdirAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);

const main = async () => {
  let originalImages;
  const colorMap = {};
  try {
    originalImages = await readdirAsync('./original');
  } catch(e) {
    console.log(e);
    process.exit(1);
  }
  const imageLoop = originalImages.map(async imagePath => {
    const imageName = imagePath.split('.')[0];
    const newPath = path.join('./cropped', imageName);
    const originalPath = path.join('./original', imagePath);
    mkdirp(newPath);
    const image = sharp(originalPath);
    const QUARTER_CROP = {width: 320, height: 320}
    const topLeftPath = path.join(newPath, 'top-left.jpg');
    const topRightPath = path.join(newPath, 'top-right.jpg');
    const bottomLeftPath = path.join(newPath, 'bottom-left.jpg');
    const bottomRightPath = path.join(newPath, 'bottom-right.jpg');
    const topLeft = image.extract({
      ...QUARTER_CROP,
      top: 0,
      left: 0
    }).toFile(topLeftPath);
    const topRight = image.extract({
      ...QUARTER_CROP,
      top: 0,
      left: 320
    }).toFile(topRightPath);
    const bottomLeft = image.extract({
      ...QUARTER_CROP,
      top: 320,
      left: 0
    }).toFile(bottomLeftPath);
    const bottomRight = image.extract({
      ...QUARTER_CROP,
      top: 320,
      left: 320
    }).toFile(bottomRightPath);
    await topLeft;
    await topRight;
    await bottomLeft;
    await bottomRight;
    const fullPalette = await Promise.all([topLeftPath, topRightPath, bottomLeftPath, bottomRightPath].map(quadrantPath => {
      const vibrant = new Vibrant(quadrantPath);
      return vibrant.getPalette();
    }));
    // let vibrantColors = fullPalette.map((pal) => pal.Vibrant || pal.Muted || pal.DarkMuted);
    let vibrantColors = fullPalette.map((pal) => (pal.Vibrant && pal.Vibrant._population > 20) ? pal.Vibrant : pal.DarkVibrant || pal.Muted || pal.DarkMuted);
    // let vibrantColors = fullPalette.map((pal) => Object.values(pal).sort((a, b) => (
    //   (a ? a._population : 0) -
    //   (b ? b._population : 0)
    // ))[5]);
    const accentColor = fullPalette[0].DarkVibrant || fullPalette[0].Muted || fullPalette[0].DarkMuted;
    console.log(vibrantColors);
    vibrantColors = vibrantColors.sort((a, b) => a.getHsl()[0] - b.getHsl()[0]);
    colorMap[imageName] = {
      accentColor,
      vibrantColors
    }
    return;
  });
  await Promise.all(imageLoop);
  await writeFileAsync('./colors.json', JSON.stringify(colorMap));
}

main();
