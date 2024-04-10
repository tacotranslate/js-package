import createTacoTranslateClient from 'tacotranslate';

export const defaultLocale =
	process.env.TACOTRANSLATE_PROJECT_LOCALE ??
	process.env.TACOTRANSLATE_DEFAULT_LOCALE;

const tacoTranslate = createTacoTranslateClient({
	apiKey:
		process.env.TACOTRANSLATE_SECRET_API_KEY ??
		process.env.TACOTRANSLATE_PUBLIC_API_KEY ??
		process.env.TACOTRANSLATE_API_KEY ??
		"",
	projectLocale:
		process.env.TACOTRANSLATE_IS_PRODUCTION === 'true'
			? defaultLocale
			: undefined,
});

export default tacoTranslate;

export async function getLocales() {
	return tacoTranslate.getLocales().catch((error) => {
		console.error(error);
		return [defaultLocale];
	});
}
