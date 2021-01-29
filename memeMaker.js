const fetch = require('node-fetch');
const fs = require('fs');
const memeCreator = require('meme-creator');

const memeTemplateURL = 'https://api.memegen.link/templates';

async function fetchMemeTemplate(url, memeName) {
	const res = await fetch(url);
	const body = await res.text();
	const memeTempsArr = JSON.parse(body);

	const selectedMemeTemp = memeTempsArr.filter((memeTemp) => {
		return memeTemp.key === memeName;
	})[0];

	return selectedMemeTemp;
}

async function fetchMemeTemplates(url) {
	const res = await fetch(url);
	const body = await res.text();
	const memeTempsArr = JSON.parse(body);

	return memeTempsArr;
}

async function createMeme(topText, bottomText, memeName) {
	// Make directory
	const dir = './my-memes';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	// Fetch specified memetemplate
	const memeTemp = await fetchMemeTemplate(memeTemplateURL, memeName);

	// Set meme parameters
	const options = {
		imageURL: `${memeTemp.blank}`, // URL to image
		topText, // top text of meme
		bottomText, // bottom text of meme
		directory: './my-memes/', // where to save memes
		fileName: `${memeTemp.name}`, // change to 'random' for a random file name
	};

	memeCreator(options, function (res, error) {
		if (error) throw new Error(error);

		console.log('You can view your meme by going to ' + res.fileName);
	});
}

async function listMemes() {
	const memesTemps = await fetchMemeTemplates(memeTemplateURL);
	const memeSlugs = memesTemps.map((memeTemp) => {
		return memeTemp.key;
	});
	console.dir(memeSlugs, { maxArrayLength: null });
}

module.exports = { createMeme, listMemes };
