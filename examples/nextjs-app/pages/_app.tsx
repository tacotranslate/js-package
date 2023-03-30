import React from 'react';
import {type AppProps} from 'next/app';
import {
	type Locale,
	TranslationProvider,
	type Translations,
} from 'tacotranslate';
import tacoTranslate from '../utilities/tacotranslate';
import '../global.css';

type PageProperties = {
	origin: string;
	locale: Locale;
	translations: Translations;
};

export default function App({Component, pageProps}: AppProps<PageProperties>) {
	const {origin, locale, translations} = pageProps;

	return (
		<TranslationProvider
			origin={origin}
			client={tacoTranslate}
			locale={locale ?? 'en'}
			translations={translations}
		>
			<Component {...pageProps} />
		</TranslationProvider>
	);
}
