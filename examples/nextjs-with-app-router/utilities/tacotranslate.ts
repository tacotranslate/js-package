import createTacoTranslateClient, {
	type GetTranslationsParameters,
} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({
	apiKey:
		process.env.TACOTRANSLATE_SECRET_API_KEY ??
		process.env.TACOTRANSLATE_PUBLIC_API_KEY ??
		process.env.TACOTRANSLATE_API_KEY,
	projectLocale: process.env.TACOTRANSLATE_PROJECT_LOCALE,
});

export default tacoTranslate;

export function getOrigin(path: string) {
	let origin = `localhost:3000${path}`;

	if (process.env.WEBSITE_URL) {
		origin = `${process.env.WEBSITE_URL}${path}`;
	} else if (process.env.VERCEL_URL) {
		origin = `${process.env.VERCEL_URL}${path}`;
	}

	return origin;
}

export async function getLocales() {
	const locales = await tacoTranslate.getLocales().catch((error) => {
		console.error(error);
		return [];
	});

	return locales;
}

export async function getTranslations({
	locale,
	origin,
}: Pick<GetTranslationsParameters, 'locale'> & {origin: string}) {
	const translations = await tacoTranslate
		.getTranslations({locale, origin})
		.catch((error) => {
			console.error(error);
			return {};
		});

	return translations;
}
