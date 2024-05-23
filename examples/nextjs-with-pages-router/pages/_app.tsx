import React, {type ReactElement, useEffect} from 'react';
import {type AppProps} from 'next/app';
import {type Locale, type Translations} from 'tacotranslate';
import {TranslationProvider, useTacoTranslate} from 'tacotranslate/react';
import tacoTranslate from '../utilities/tacotranslate';
import '../global.css';

type PageProperties = {
	origin: string;
	locale: Locale;
	locales: Locale[];
	translations: Translations;
};

function Page({children}: {children: ReactElement}) {
	const {isRightToLeft} = useTacoTranslate();

	useEffect(() => {
		document.documentElement.setAttribute('dir', isRightToLeft ? 'rtl' : 'ltr');
	}, [isRightToLeft]);

	return children;
}

export default function App({Component, pageProps}: AppProps<PageProperties>) {
	const {origin, locale, translations} = pageProps;

	return (
		<TranslationProvider
			origin={origin}
			client={tacoTranslate}
			locale={locale}
			translations={translations}
		>
			<Page>
				<Component {...pageProps} />
			</Page>
		</TranslationProvider>
	);
}
