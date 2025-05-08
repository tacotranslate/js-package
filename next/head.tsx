import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {type Locale} from '..';

export default function TacoTranslateHead({
	rootUrl = '',
	locales,
	hasTrailingSlash = false,
	hasCanonical = true,
}: {
	readonly rootUrl?: string;
	readonly locales: Locale[];
	readonly hasTrailingSlash?: boolean;
	readonly hasCanonical?: boolean;
}) {
	const {asPath} = useRouter();
	const currentPath = asPath === '/' ? (hasTrailingSlash ? '/' : '') : asPath;

	return (
		<Head>
			{locales.map((locale, index) => (
				<link
					key={locale}
					rel="alternate"
					hrefLang={locale}
					href={
						index === 0
							? rootUrl + currentPath
							: `${rootUrl}/${locale + currentPath}`
					}
				/>
			))}

			<link rel="alternate" hrefLang="x-default" href={rootUrl + currentPath} />

			{hasCanonical ? (
				<link rel="canonical" href={rootUrl + currentPath} />
			) : null}
		</Head>
	);
}
