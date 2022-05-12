import tacoTranslate from './tacotranslate.js';

export default async function getServerSideProps(context) {
	const path = context.resolvedUrl ?? context.url;
	let url = `localhost:3000${path}`;

	if (process.env.VERCEL_URL) {
		url = `${process.env.VERCEL_URL}${path}`;
	} else if (context.req?.headers?.host) {
		url = `${context.req.headers.host}${path}`;
	}

	const inputLocale = context.defaultLocale;
	const outputLocale = context.locale;
	const {getTranslations} = tacoTranslate({inputLocale, outputLocale});
	const translations = await getTranslations({url});

	return {
		props: {inputLocale, outputLocale, translations, url},
	};
}
