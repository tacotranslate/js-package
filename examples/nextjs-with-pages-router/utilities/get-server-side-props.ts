import {type GetServerSidePropsContext} from 'next';
import tacoTranslate from './tacotranslate';

export default async function customGetServerSideProps(
	context: GetServerSidePropsContext
) {
	const {
		resolvedUrl,
		locale = process.env.TACOTRANSLATE_DEFAULT_LOCALE,
		locales,
	} = context;

	const [path] = resolvedUrl.split('?');
	const origin = process.env.TACOTRANSLATE_ORIGIN + path;
	const translations = await tacoTranslate.getTranslations({locale, origin});

	return {
		props: {locale, locales, translations, origin},
	};
}
