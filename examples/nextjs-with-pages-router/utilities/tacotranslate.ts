import createTacoTranslateClient from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({
	apiKey:
		process.env.TACOTRANSLATE_SECRET_API_KEY ??
		process.env.TACOTRANSLATE_PUBLIC_API_KEY ??
		process.env.TACOTRANSLATE_API_KEY,
	projectLocale: process.env.TACOTRANSLATE_PROJECT_LOCALE,
});

export default tacoTranslate;
