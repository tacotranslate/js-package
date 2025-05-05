const {default: createTacoTranslateClient} = require('tacotranslate');

const tacoTranslateClient = createTacoTranslateClient({
	apiKey:
		process.env.TACOTRANSLATE_SECRET_API_KEY ??
		process.env.TACOTRANSLATE_PUBLIC_API_KEY ??
		process.env.TACOTRANSLATE_API_KEY ??
		'',
	projectLocale:
		process.env.TACOTRANSLATE_IS_PRODUCTION === 'true'
			? process.env.TACOTRANSLATE_PROJECT_LOCALE ??
			  process.env.TACOTRANSLATE_DEFAULT_LOCALE ??
			  ''
			: undefined,
});

module.exports = tacoTranslateClient;
