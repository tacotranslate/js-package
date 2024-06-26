import React, {type ReactNode} from 'react';
import {isRightToLeftLocaleCode} from 'tacotranslate';
import './global.css';
import tacoTranslate from '@/utilities/tacotranslate';
import TacoTranslate from '@/components/tacotranslate';
import {customGenerateMetadata} from '@/utilities/generate-metadata';

export async function generateStaticParams() {
	const locales = await tacoTranslate.getLocales();
	return locales.map((locale) => ({locale}));
}

type Parameters = {
	locale: string;
};

export async function generateMetadata({
	params: {locale},
}: {
	params: Parameters;
}) {
	return customGenerateMetadata(locale);
}

type RootLayoutParameters = {
	readonly params: Parameters;
	readonly children: ReactNode;
};

export default async function RootLayout({
	params: {locale},
	children,
}: RootLayoutParameters) {
	const origin = process.env.TACOTRANSLATE_ORIGIN;
	const direction = isRightToLeftLocaleCode(locale) ? 'rtl' : 'ltr';
	const translations = await tacoTranslate.getTranslations({locale, origin});

	return (
		<html lang={locale} dir={direction}>
			<body>
				<TacoTranslate
					locale={locale}
					origin={origin}
					translations={translations}
				>
					<div id="content">{children}</div>
				</TacoTranslate>
			</body>
		</html>
	);
}
