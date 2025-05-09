import {type Locale} from 'next/dist/compiled/@vercel/og/satori';
import {type ReactNode} from 'react';
import generateTacoTranslateMetadata from 'tacotranslate/next/metadata';
import tacoTranslateClient from '@/tacotranslate-client';

export async function generateMetadata({
	params,
}: {
	params: Promise<{locale: Locale}>;
}) {
	const {locale} = await params;

	return generateTacoTranslateMetadata(tacoTranslateClient, locale, {
		canonical: '/hello-world',
		title:
			'Another page in the example of Next.js with [[[App Router]]] and TacoTranslate',
	});
}

export default async function Layout({children}: {children: ReactNode}) {
	return children;
}
