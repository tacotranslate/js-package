import {type Locale, createEntry, translateEntries} from 'tacotranslate';
import tacoTranslateClient from './tacotranslate';

type GenerateMetadataOptions = {
	title?: string;
	description?: string;
	openGraph?: {
		title?: string;
		description?: string;
	};
};

export async function customGenerateMetadata(
	locale: Locale,
	options?: GenerateMetadataOptions
) {
	const title = createEntry({
		string:
			options?.title ??
			'Example of Next.js with [[[App Router]]] and TacoTranslate',
	});

	const description = createEntry({
		string:
			options?.description ??
			'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example of internationalizing a Next.js project using the [[[App Router]]] and TacoTranslate.',
	});

	const translations = await translateEntries(
		tacoTranslateClient,
		{origin: process.env.TACOTRANSLATE_ORIGIN, locale},
		[title, description]
	);

	return {
		title: translations(title),
		description: translations(description),
		openGraph: {
			title: translations(title),
			description: translations(description),
			locale,
			images: [
				{
					url: `/opengraph?locale=${locale}`,
					width: 1200,
					height: 600,
				},
			],
		},
	};
}
