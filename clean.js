const fs = require('node:fs/promises');
const config = require('./tsconfig.build.json');

const promises = [];

for (const file of config.include) {
	const typeFile = file.replace(/\.tsx?$/, '.d.ts');
	promises.push(fs.unlink(typeFile));
}

Promise.all(promises);
