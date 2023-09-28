'use client';

import React, {type ReactNode} from 'react';
import {
	type TranslationContextProperties,
	TranslationProvider,
} from 'tacotranslate/react';
import tacoTranslate from '@/utilities/tacotranslate';

export default function CustomTranslationProvider({
	locale,
	origin,
	translations,
	children,
}: TranslationContextProperties & {
	readonly children: ReactNode;
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
