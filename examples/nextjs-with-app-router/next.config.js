const withTacoTranslate = require('tacotranslate/next/config').default;
const tacoTranslateClient = require('./tacotranslate-client');

module.exports = async () => {
	const config = await withTacoTranslate(
		{},
		{
			client: tacoTranslateClient,
			isProduction:
				process.env.TACOTRANSLATE_ENV === 'production' ||
				process.env.VERCEL_ENV === 'production' ||
				(!(process.env.TACOTRANSLATE_ENV || process.env.VERCEL_ENV) &&
					process.env.NODE_ENV === 'production'),
		}
	);

	// NOTE: Remove i18n from config when using the app router
	return {...config, i18n: undefined};
};
