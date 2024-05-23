const tacoTranslate = require('./utilities/tacotranslate');

module.exports = async () => {
	const locales = await tacoTranslate.getLocales();
	const isProduction =
		process.env.TACOTRANSLATE_ENV === 'production' ||
		process.env.VERCEL_ENV === 'production' ||
		(!(process.env.TACOTRANSLATE_ENV || process.env.VERCEL_ENV) &&
			process.env.NODE_ENV === 'production');

	const [projectLocale] = locales;

	return {
		env: {
			TACOTRANSLATE_ORIGIN: process.env.TACOTRANSLATE_ORIGIN,
			TACOTRANSLATE_API_KEY: isProduction
				? process.env.TACOTRANSLATE_PUBLIC_API_KEY
				: process.env.TACOTRANSLATE_SECRET_API_KEY,
			TACOTRANSLATE_DEFAULT_LOCALE: isProduction ? projectLocale : undefined,
		},
		i18n: {
			defaultLocale: projectLocale,
			locales,
		},
	};
};
