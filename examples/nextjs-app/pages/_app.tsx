import React from 'react';
import {type AppProps} from 'next/app';
import {TranslationProvider, type Translations} from 'tacotranslate';
import tacoTranslate from '../utilities/tacotranslate';
import '../global.css';

type PageProperties = {
	url: string;
	locale: string;
	translations: Translations;
};

export default function App({
	Component,
	pageProps,
}: AppProps & {pageProps: PageProperties}) {
	const {origin, locale, translations} = pageProps;

	return (
		<TranslationProvider
			origin={origin}
			client={tacoTranslate}
			locale={locale}
			translations={translations}
		>
			<Component {...pageProps} />
		</TranslationProvider>
	);
}
