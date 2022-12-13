import process from 'node:process';
import {type GetStaticPropsContext} from 'next';
import tacoTranslate from './tacotranslate';

export default async function getAppStaticProps(
	path: string,
	{locale}: GetStaticPropsContext
) {
	let url = `localhost:3000${path}`;

	if (process.env.VERCEL_URL) {
		url = `${process.env.VERCEL_URL}${path}`;
	} else if (process.env.WEBSITE_URL) {
		url = `${process.env.WEBSITE_URL}${path}`;
	}

	const {getTranslations} = tacoTranslate({locale});
	const translations = await getTranslations({origin: url}).catch((error) => {
		console.error(error);
		return {};
	});

	return {
		props: {locale, translations, url},
		revalidate: 10,
	};
}
