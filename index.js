const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cliProgress = require('cli-progress');
const readline = require('readline');
const { createMeme, listMemes } = require('./memeMaker');

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

function getImages(string) {
  let match;
  const urls = [];
  const rex = /<img[^>]+src="([^">]+)"/g;

  while ((match = rex.exec(string))) {
    urls.push(match[1]);
  }

  return urls;
}

async function downloadImg(imgUrl, imgName) {
  const pathToMemes = path.resolve(__dirname, 'memes', `${imgName}.png`);

  const response = await fetch(imgUrl);
  const buffer = await response.buffer();

  await fs.writeFile(pathToMemes, buffer, () => {
    bar1.increment(10);
  });
}

function generateName() {
  return JSON.stringify(Math.random());
}

async function scrapeMemes() {
  const res = await fetch(url);
  const body = await res.text();

  const imgs = getImages(body);

  const dir = './memes';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  bar1.start(100, 0);
  for (let i = 0; i < 10; i++) {
    const imgName = generateName();
    const imageUrl = imgs[i];
    await downloadImg(imageUrl, imgName);
  }
  bar1.update(100);
  bar1.stop();
}

let topText = process.argv[2];
let bottomText = process.argv[3];
const memeName = process.argv[4];

if (process.argv[2] === '--help') {
  listMemes();
} else if (topText && bottomText && memeName) {
  topText = topText.split('-').join(' ');
  bottomText = bottomText.split('-').join(' ');

  createMeme(topText, bottomText, memeName);
} else if (!process.argv[4]) {
  const text = process.argv[2];
  const memeKey = process.argv[3];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    'Would like the text to be at the top or bottom?',
    function (pos) {
      if (pos === 'bottom') {
        createMeme('', text, memeKey);
        return rl.close();
      }
      createMeme(text, '', memeKey);
      return rl.close();
    },
  );
} else {
  scrapeMemes();
}
