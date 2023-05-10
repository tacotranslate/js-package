const {default: createTacoTranslateClient} = require('tacotranslate');

module.exports = async () => {
	const publicApiKey = process.env.TACOTRANSLATE_PUBLIC_API_KEY;
	const secretApiKey = process.env.TACOTRANSLATE_SECRET_API_KEY;
	const {getLocales} = createTacoTranslateClient({apiKey: secretApiKey});
	const locales = await getLocales().catch((error) => {
		console.error(error);
		return [process.env.TACOTRANSLATE_DEFAULT_LOCALE];
	});

	const [projectLocale] = locales;
	const isProduction =
		process.env.TACOTRANSLATE_ENV === 'production' ||
		process.env.VERCEL_ENV === 'production' ||
		(!(process.env.TACOTRANSLATE_ENV || process.VERCEL_ENV) &&
			process.env.NODE_ENV === 'production');

	return {
		env: {
			TACOTRANSLATE_API_KEY: isProduction ? publicApiKey : secretApiKey,
			TACOTRANSLATE_PROJECT_LOCALE: isProduction ? projectLocale : undefined,
			TACOTRANSLATE_PROJECT_LOCALES: locales,
			WEBSITE_URL: process.env.WEBSITE_URL,
		},
	};
};
