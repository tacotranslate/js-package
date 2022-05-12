const {locales} = require('tacotranslate');

module.exports = {
	env: {
		WEBSITE_URL: 'your-production-website-url',
	},
	i18n: {
		defaultLocale: 'en',
		locales: locales.map(([code]) => code),
	},
};
