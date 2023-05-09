import {type Locale, createEntry, translateEntries} from 'tacotranslate';
import tacoTranslate, {getLocales} from './tacotranslate';

type GenerateMetadataOptions = {
	title?: string;
	description?: string;
};

export async function customGenerateMetadata(
	locale: Locale,
	path: string,
	options?: GenerateMetadataOptions
) {
	const locales = await getLocales();
	const title = createEntry({
		string:
			options?.title ??
			'Example of Next.js with [[[app/]]] router and TacoTranslate',
	});

	const description = createEntry({
		string:
			options?.description ??
			'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example of internationalizing a Next.js app using the [[[app/]]] router and TacoTranslate.',
	});

	const defaultBase = 'localhost:3000';
	const metadataBase = process.env.WEBSITE_URL
		? `https://${process.env.WEBSITE_URL}`
		: `http://${defaultBase}`;

	const origin = `${process.env.WEBSITE_URL ?? defaultBase}/${path}`;
	const translations = await translateEntries(tacoTranslate, {origin, locale}, [
		title,
		description,
	]);

	const languages: Record<string, string> = {};

	for (const locale of locales) {
		languages[locale] = `/${locale}/${path}`;
	}

	return {
		metadataBase: new URL(`${metadataBase}/${path}`),
		title: translations(title),
		description: translations(description),
		alternates: {
			languages,
		},
		openGraph: {
			title: translations(title),
			description: translations(description),
			locale,
			images: [
				{
					url: `/api/opengraph?locale=${locale}`,
					width: 1200,
					height: 600,
				},
			],
		},
	};
}
