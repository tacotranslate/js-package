import React, {type ReactNode} from 'react';
import {rightToLeftLocaleCodes} from 'tacotranslate';
import './global.css';
import {getLocales} from '@/utilities/tacotranslate';

export type Parameters = {
	locale: string;
};

// eslint-disable-next-line  unicorn/prevent-abbreviations
export async function generateStaticParams() {
	const locales = await getLocales();
	return locales.map((locale) => ({locale}));
}

type RootLayoutParameters = {
	params: Parameters;
	children: ReactNode;
};

export default function RootLayout({children, params}: RootLayoutParameters) {
	const direction = rightToLeftLocaleCodes.includes(params.locale)
		? 'rtl'
		: 'ltr';

	return (
		<html lang={params.locale} dir={direction}>
			<body>{children}</body>
		</html>
	);
}
