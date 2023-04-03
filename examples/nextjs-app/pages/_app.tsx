import React, {type ReactElement, useEffect} from 'react';
import {type AppProps} from 'next/app';
import {
	type Locale,
	TranslationProvider,
	type Translations,
	useTacoTranslate,
} from 'tacotranslate';
import tacoTranslate from '../utilities/tacotranslate';
import '../global.css';

type PageProperties = {
	origin: string;
	locale: Locale;
	translations: Translations;
};

function Page({children}: {children: ReactElement}) {
	const {isRightToLeft} = useTacoTranslate();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			document.documentElement.setAttribute(
				'dir',
				isRightToLeft ? 'rtl' : 'ltr'
			);
		}
	}, [isRightToLeft]);

	return children;
}

export default function App({Component, pageProps}: AppProps<PageProperties>) {
	const {origin, locale, translations} = pageProps;

	return (
		<TranslationProvider
			origin={origin}
			client={tacoTranslate}
			locale={locale ?? 'en'}
			translations={translations}
		>
			<Page>
				<Component {...pageProps} />
			</Page>
		</TranslationProvider>
	);
}
