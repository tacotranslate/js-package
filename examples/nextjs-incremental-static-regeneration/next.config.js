const {locales} = require('tacotranslate');

module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: locales.map(([code]) => code),
	},
};
