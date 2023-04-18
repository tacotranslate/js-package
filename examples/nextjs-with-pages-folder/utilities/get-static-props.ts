import process from 'node:process';
import {type GetStaticPropsContext} from 'next';
import tacoTranslate from './tacotranslate';

export default async function getStaticProps(
	path: string,
	{
		locale = process.env.TACOTRANSLATE_PROJECT_LOCALE,
		locales,
	}: GetStaticPropsContext
) {
	let origin = `localhost:3000${path}`;

	if (process.env.WEBSITE_URL) {
		origin = `${process.env.WEBSITE_URL}${path}`;
	} else if (process.env.VERCEL_URL) {
		origin = `${process.env.VERCEL_URL}${path}`;
	}

	const translations = await tacoTranslate
		.getTranslations({locale, origin})
		.catch((error) => {
			console.error(error);
			return {};
		});

	return {
		props: {locale, locales, translations, origin},
		revalidate: 10,
	};
}
