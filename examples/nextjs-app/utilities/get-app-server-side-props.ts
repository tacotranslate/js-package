import process from 'node:process';
import {type GetServerSidePropsContext} from 'next';
import tacoTranslate from './tacotranslate';

export default async function getServerSideProps(
	context: GetServerSidePropsContext
) {
	const {resolvedUrl: path, locale} = context;
	let url = `localhost:3000${path}`;

	if (process.env.VERCEL_URL) {
		url = `${process.env.VERCEL_URL}${path}`;
	} else if (context.req?.headers?.host) {
		url = `${context.req.headers.host}${path}`;
	}

	const {getTranslations} = tacoTranslate({locale});
	const translations = await getTranslations({origin: url}).catch((error) => {
		console.error(error);
		return {};
	});

	return {
		props: {locale, translations, url},
	};
}