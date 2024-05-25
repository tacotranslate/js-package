'use client';

import React, {type ReactNode} from 'react';
import {
	type TranslationContextProperties,
	TacoTranslate as ImportedTacoTranslate,
} from 'tacotranslate/react';
import tacoTranslate from '@/utilities/tacotranslate';

export default function TacoTranslate({
	locale,
	origin,
	translations,
	children,
}: TranslationContextProperties & {
	readonly children: ReactNode;
}) {
	return (
		<ImportedTacoTranslate
			client={tacoTranslate}
			locale={locale}
			origin={origin}
			translations={translations}
		>
			{children}
		</ImportedTacoTranslate>
	);
}
