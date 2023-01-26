import createTacoTranslateClient from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({
	apiKey: '123-456-789',
	projectLocale: 'en',
});

export default tacoTranslate;
