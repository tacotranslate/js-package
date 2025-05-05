import React, {type ReactNode} from 'react';
import {isRightToLeftLocaleCode} from 'tacotranslate';
import './global.css';
import TacoTranslate from './tacotranslate';
import tacoTranslateClient from '@/utilities/tacotranslate';
import {customGenerateMetadata} from '@/utilities/generate-metadata';

export async function generateStaticParams() {
	const locales = await tacoTranslateClient.getLocales();
	return locales.map((locale) => ({locale}));
}

type Parameters = Promise<{locale: string}>;

export async function generateMetadata({params}: {params: Parameters}) {
	const {locale} = await params;
	return customGenerateMetadata(locale);
}

export default async function RootLayout({
	params,
	children,
}: {
	readonly params: Parameters;
	readonly children: ReactNode;
}) {
	const {locale} = await params;
	const origin = process.env.TACOTRANSLATE_ORIGIN;
	const localizations = await tacoTranslateClient.getLocalizations({
		locale,
		origins: [origin /* , other origins to fetch */],
	});

	return (
		<html lang={locale} dir={isRightToLeftLocaleCode(locale) ? 'rtl' : 'ltr'}>
			<body>
				<div id="content">
					<TacoTranslate
						locale={locale}
						origin={origin}
						localizations={localizations}
					>
						{children}
					</TacoTranslate>
				</div>
			</body>
		</html>
	);
}
