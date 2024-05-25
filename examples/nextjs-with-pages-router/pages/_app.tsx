import React, {type ReactElement, useEffect} from 'react';
import {type AppProps} from 'next/app';
import {type Localizations, type Locale} from 'tacotranslate';
import TacoTranslate, {useTacoTranslate} from 'tacotranslate/react';
import tacoTranslate from '../utilities/tacotranslate';
import '../global.css';

type PageProperties = {
	origin: string;
	locale: Locale;
	locales: Locale[];
	localizations: Localizations;
};

function Page({children}: {children: ReactElement}) {
	const {isRightToLeft} = useTacoTranslate();

	useEffect(() => {
		document.documentElement.setAttribute('dir', isRightToLeft ? 'rtl' : 'ltr');
	}, [isRightToLeft]);

	return children;
}

export default function App({Component, pageProps}: AppProps<PageProperties>) {
	const {origin, locale, localizations} = pageProps;

	return (
		<TacoTranslate
			client={tacoTranslate}
			origin={origin}
			locale={locale}
			localizations={localizations}
		>
			<Page>
				<Component {...pageProps} />
			</Page>
		</TacoTranslate>
	);
}
