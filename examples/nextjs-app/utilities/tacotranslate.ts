import createTacoTranslateClient from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({
	apiUrl: 'http://localhost:3000',
	apiKey: 'adef3efb-d3df-4a71-83ea-f1edeb832e60',
	projectLocale: 'en'
});

export default tacoTranslate;
