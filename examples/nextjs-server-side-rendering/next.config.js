const locales = require('./locales.json');

module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: locales.map(([code]) => code),
	},
};
