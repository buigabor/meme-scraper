const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cliProgress = require('cli-progress');

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

scrapeMemes();
