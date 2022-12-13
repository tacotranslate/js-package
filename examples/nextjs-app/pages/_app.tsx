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
	const {url, locale, translations} = pageProps;

	return (
		<TranslationProvider
			origin={url}
			client={tacoTranslate}
			locale={locale}
			translations={translations}
		>
			<Component {...pageProps} />
		</TranslationProvider>
	);
}
