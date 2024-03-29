const fs = require('node:fs/promises');
const config = require('./tsconfig.build.json');

const promises = [];

for (const file of config.include) {
	if (file.endsWith('.d.ts')) {
		continue;
	}

	const typeFile = file.replace(/\.tsx?$/, '.d.ts');

	promises.push(
		fs.unlink(typeFile).catch((error) => {
			console.error(error);
		})
	);
}

Promise.all(promises);
