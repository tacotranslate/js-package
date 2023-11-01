import React, {type ReactNode} from 'react';
import {rightToLeftLocaleCodes} from 'tacotranslate';
import {getOrigin} from 'tacotranslate/next';
import './global.css';
import CustomTranslationProvider from '@/components/translation-provider';
import tacoTranslate, {getLocales} from '@/utilities/tacotranslate';
import {customGenerateMetadata} from '@/utilities/generate-metadata';

export async function generateStaticParams() {
	const locales = await getLocales();
	return locales.map((locale) => ({locale}));
}

type Parameters = {
	locale: string;
};

type MetadataProperties = {
	params: Parameters;
};

export async function generateMetadata({params: {locale}}: MetadataProperties) {
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
	const origin = getOrigin();
	const direction = rightToLeftLocaleCodes.includes(locale) ? 'rtl' : 'ltr';
	const translations = await tacoTranslate
		.getTranslations({locale, origin})
		.catch((error) => {
			console.error(error);
			return {};
		});

	return (
		<html lang={locale} dir={direction}>
			<body>
				<CustomTranslationProvider
					locale={locale}
					origin={origin}
					translations={translations}
				>
					<div id="content">{children}</div>
				</CustomTranslationProvider>
			</body>
		</html>
	);
}
