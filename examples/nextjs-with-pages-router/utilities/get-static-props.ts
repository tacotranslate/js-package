import {type GetStaticPropsContext} from 'next';
import {type Origin} from 'tacotranslate';
import tacoTranslate from './tacotranslate';

export default async function customGetStaticProps(
	{
		locale = process.env.TACOTRANSLATE_DEFAULT_LOCALE,
		locales,
	}: GetStaticPropsContext,
	additionalOrigins: Origin[] = []
) {
	const origin = process.env.TACOTRANSLATE_ORIGIN;
	const origins = [origin, ...additionalOrigins];
	const localizations = await tacoTranslate.getLocalizations({locale, origins});

	return {
		props: {locale, locales, localizations, origin},
		revalidate: 60,
	};
}
