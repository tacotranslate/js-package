import React, {type ReactElement, useEffect} from 'react';
import {type AppProps} from 'next/app';
import {type Localizations, type Locale} from 'tacotranslate';
import TacoTranslate, {useTacoTranslate} from 'tacotranslate/react';
import TacoTranslateHead from 'tacotranslate/next/head';
import tacoTranslateClient from '../utilities/tacotranslate';
import '../global.css';

function Page({children}: {children: ReactElement}) {
	const {isRightToLeft} = useTacoTranslate();

	useEffect(() => {
		document.documentElement.setAttribute('dir', isRightToLeft ? 'rtl' : 'ltr');
	}, [isRightToLeft]);

	return children;
}

export default function App({
	Component,
	pageProps,
}: AppProps<{
	origin: string;
	locale: Locale;
	locales: Locale[];
	localizations: Localizations;
}>) {
	const {origin, locale, locales, localizations} = pageProps;

	return (
		<TacoTranslate
			client={tacoTranslateClient}
			origin={origin}
			locale={locale}
			localizations={localizations}
		>
			<TacoTranslateHead
				rootUrl="https://nextjs-pages-router-demo.tacotranslate.com"
				locales={locales}
			/>

			<Page>
				<Component {...pageProps} />
			</Page>
		</TacoTranslate>
	);
}
