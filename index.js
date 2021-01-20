const fs = require('fs');
const dir = './memes-are-life';
const path = require('path');
const fetch = require('node-fetch');

const url = 'https://memegen-link-examples-upleveled.netlify.app/';

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
	const pathToMemes = path.resolve(
		__dirname,
		'memes-are-life',
		`${imgName}.png`,
	);

	const response = await fetch(imgUrl);
	const buffer = await response.buffer();

	fs.writeFile(pathToMemes, buffer, () => console.log('finished downloading!'));
}

function generateName() {
	return JSON.stringify(Math.random());
}

async function scrapeMemes() {
	const res = await fetch(url);
	const body = await res.text();

	const imgs = getImages(body);

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	for (let i = 0; i < 10; i++) {
		const imgName = generateName();
		const imageUrl = imgs[i];
		await downloadImg(imageUrl, imgName);
	}
}

scrapeMemes();
