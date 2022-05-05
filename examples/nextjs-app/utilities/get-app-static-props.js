import tacoTranslate from './tacotranslate';

export default async function getAppStaticProps(path, context) {
	let url = `localhost:3000${path}`;

	if (process.env.VERCEL_URL) {
		url = `${process.env.VERCEL_URL}${path}`;
	} else if (process.env.WEBSITE_URL) {
		url = `${process.env.WEBSITE_URL}${path}`;
	}

	const inputLocale = context.defaultLocale;
	const outputLocale = context.locale;
	const {getTranslations} = tacoTranslate({inputLocale, outputLocale});
	const translations = await getTranslations({url});

	return {
		props: {inputLocale, outputLocale, translations, url},
		revalidate: 10,
	};
}
