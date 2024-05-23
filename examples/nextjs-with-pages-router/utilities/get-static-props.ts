import {type GetStaticPropsContext} from 'next';
import tacoTranslate from './tacotranslate';

export default async function customGetStaticProps(
	path: string,
	{
		locale = process.env.TACOTRANSLATE_DEFAULT_LOCALE,
		locales,
	}: GetStaticPropsContext
) {
	const origin = process.env.TACOTRANSLATE_ORIGIN + path;
	const translations = await tacoTranslate.getTranslations({locale, origin});

	return {
		props: {locale, locales, translations, origin},
		revalidate: 60,
	};
}
