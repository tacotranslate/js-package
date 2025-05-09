'use client';

import React, {type ReactNode} from 'react';
import {
	type TranslationContextProperties,
	TacoTranslate as ImportedTacoTranslate,
} from 'tacotranslate/react';
import tacoTranslateClient from '@/tacotranslate-client';

export default function TacoTranslate({
	locale,
	origin,
	localizations,
	children,
}: TranslationContextProperties & {
	readonly children: ReactNode;
}) {
	return (
		<ImportedTacoTranslate
			client={tacoTranslateClient}
			locale={locale}
			origin={origin}
			localizations={localizations}
		>
			{children}
		</ImportedTacoTranslate>
	);
}
