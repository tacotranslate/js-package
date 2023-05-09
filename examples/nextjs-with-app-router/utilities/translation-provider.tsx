'use client';

import React, {type ReactNode} from 'react';
import createTacoTranslateClient from 'tacotranslate';
import {
	type TranslationContextProperties,
	TranslationProvider,
} from 'tacotranslate/react';

const tacoTranslate = createTacoTranslateClient({
	apiKey: process.env.TACOTRANSLATE_API_KEY,
	projectLocale: process.env.TACOTRANSLATE_PROJECT_LOCALE,
});

export default function CustomTranslationProvider({
	locale,
	origin,
	translations,
	children,
}: TranslationContextProperties & {
	children: ReactNode;
}) {
	return (
		<TranslationProvider
			client={tacoTranslate}
			locale={locale}
			origin={origin}
			translations={translations}
		>
			{children}
		</TranslationProvider>
	);
}
