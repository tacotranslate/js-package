const withTacoTranslate = require('tacotranslate/next/config').default;
const tacoTranslateClient = require('./tacotranslate-client');

module.exports = async () => {
	const config = {};

	return withTacoTranslate(config, {
		client: tacoTranslateClient,
		isProduction:
			process.env.TACOTRANSLATE_ENV === 'production' ||
			process.env.VERCEL_ENV === 'production' ||
			(!(process.env.TACOTRANSLATE_ENV || process.env.VERCEL_ENV) &&
				process.env.NODE_ENV === 'production'),
	});
};
