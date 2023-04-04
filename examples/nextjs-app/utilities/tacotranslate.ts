import createTacoTranslateClient from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({
	apiKey: process.env.TACOTRANSLATE_API_KEY,
	projectLocale: process.env.TACOTRANSLATE_PROJECT_LOCALE,
});

export default tacoTranslate;
