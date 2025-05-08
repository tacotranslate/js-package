import React, {type ReactNode} from 'react';
import {isRightToLeftLocaleCode, type Locale} from 'tacotranslate';
import generateTacoTranslateMetadata from 'tacotranslate/next/metadata';
import './global.css';
import TacoTranslate from './tacotranslate';
import tacoTranslateClient from '@/utilities/tacotranslate';

export async function generateStaticParams() {
	const locales = await tacoTranslateClient.getLocales();
	return locales.map((locale) => ({locale}));
}

type Parameters = Promise<{locale: Locale}>;

export async function generateMetadata({params}: {params: Parameters}) {
	const {locale} = await params;

	return generateTacoTranslateMetadata(
		tacoTranslateClient,
		locale,
		{
			canonical: '/',
			title: 'Example of Next.js with [[[App Router]]] and TacoTranslate',
			description:
				'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example of internationalizing a Next.js project using the [[[App Router]]] and TacoTranslate.',
		},
		{
			metadataBase: new URL('https://nextjs-with-app-router.tacotranslate.com'),
			openGraph: {
				images: [
					{
						url: `/opengraph?locale=${locale}`,
						width: 1200,
						height: 600,
					},
				],
			},
		}
	);
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
