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
	localizations,
	children,
}: TranslationContextProperties & {
	readonly children: ReactNode;
}) {
	return (
		<ImportedTacoTranslate
			client={tacoTranslate}
			locale={locale}
			origin={origin}
			localizations={localizations}
		>
			{children}
		</ImportedTacoTranslate>
	);
}
