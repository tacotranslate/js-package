import {type GetServerSidePropsContext} from 'next';
import {type Origin} from 'tacotranslate';
import tacoTranslate from './tacotranslate';

export default async function customGetServerSideProps(
	context: GetServerSidePropsContext,
	additionalOrigins: Origin[] = []
) {
	const {locale = process.env.TACOTRANSLATE_DEFAULT_LOCALE, locales} = context;
	const origin = process.env.TACOTRANSLATE_ORIGIN;
	const origins = [origin, ...additionalOrigins];
	const localizations = await tacoTranslate.getLocalizations({locale, origins});

	return {
		props: {locale, locales, localizations, origin},
	};
}
