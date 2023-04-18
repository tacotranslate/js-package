import process from 'node:process';
import {type GetServerSidePropsContext} from 'next';
import tacoTranslate from './tacotranslate';

export default async function getServerSideProps(
	context: GetServerSidePropsContext
) {
	const {
		resolvedUrl,
		locale = process.env.TACOTRANSLATE_PROJECT_LOCALE,
		locales,
	} = context;

	const [path] = resolvedUrl.split('?');
	let origin = `localhost:3000${path}`;

	if (context.req?.headers?.host) {
		origin = `${context.req.headers.host}${path}`;
	} else if (process.env.WEBSITE_URL) {
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
	};
}
