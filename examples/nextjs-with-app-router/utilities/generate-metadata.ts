import {type Locale, createEntry, translateEntries} from 'tacotranslate';
import {
	getAbsoluteOriginPath,
	getOrigin,
	getWebsiteUrl,
} from 'tacotranslate/next';
import tacoTranslate, {getLocales} from './tacotranslate';

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
			'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example of internationalizing a Next.js app using the [[[app/]]] router and TacoTranslate.',
	});

	const origin = getOrigin();
	const [translations, locales] = await Promise.all([
		translateEntries(tacoTranslate, {origin, locale}, [title, description]),
		getLocales(),
	]);

	const absolutePath = getAbsoluteOriginPath();
	const languages: Record<string, string> = {};

	for (const locale of locales) {
		languages[locale] = `/${locale}/${absolutePath}`;
	}

	return {
		metadataBase: getWebsiteUrl().origin,
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
					url: `/opengraph?locale=${locale}`,
					width: 1200,
					height: 600,
				},
			],
		},
	};
}
