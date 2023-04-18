const process = require('node:process');
const {default: createTacoTranslateClient} = require('tacotranslate');

module.exports = async () => {
	const apiKey = process.env.TACOTRANSLATE_API_KEY;
	const {getLocales} = createTacoTranslateClient({apiKey});
	const locales = await getLocales();
	const [projectLocale] = locales;

	return {
		env: {
			TACOTRANSLATE_API_KEY: apiKey,
			TACOTRANSLATE_PROJECT_LOCALE: projectLocale,
		},
		i18n: {
			defaultLocale: projectLocale,
			locales,
		},
	};
};
