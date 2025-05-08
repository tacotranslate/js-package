import {type Metadata} from 'next';
import {
	createEntry,
	type Entry,
	type Locale,
	type Origin,
	type TacoTranslateClient,
	type TemplateVariables,
	translateEntries,
} from '..';

export default async function generateTacoTranslateMetadata(
	client: TacoTranslateClient,
	locale: Locale,
	options?: {
		origin?: Origin;
		title?: string | {string: string; variables?: TemplateVariables};
		description?: string | {string: string; variables?: TemplateVariables};
		canonical?: string;
		hasTrailingSlash?: boolean;
	},
	metadata?: Metadata | ((metadata: Metadata) => Metadata | Promise<Metadata>)
) {
	const entries: Entry[] = [];
	const result: Metadata = {};

	let title: Entry | undefined;
	let description: Entry | undefined;

	if (options?.title) {
		title = createEntry({
			string:
				typeof options.title === 'string'
					? options.title
					: options.title.string,
		});

		entries.push(title);
	}

	if (options?.description) {
		description = createEntry({
			string:
				typeof options.description === 'string'
					? options.description
					: options.description.string,
		});

		entries.push(description);
	}

	if (title ?? description) {
		const translations = await translateEntries(
			client,
			{origin: options?.origin ?? 'metadata', locale},
			entries
		);

		const openGraph: Metadata['openGraph'] = {locale};

		if (title) {
			result.title = translations(title);
			openGraph.title = translations(title);
		}

		if (description) {
			result.description = translations(description);
			openGraph.description = translations(description);
		}

		result.openGraph = openGraph;
	}

	const metadataResult =
		(typeof metadata === 'function' ? await metadata(result) : metadata) ?? {};

	Object.assign(result, metadataResult);

	if (options?.canonical) {
		const currentPath =
			options?.canonical === '/'
				? options?.hasTrailingSlash
					? '/'
					: ''
				: options?.canonical;

		result.alternates = {
			canonical: currentPath,
			...metadataResult.alternates,
		};

		const locales = await client.getLocales();
		const languages: Record<Locale, string> = {};
		let isProjectLocale = true;

		for (const locale of locales) {
			languages[locale] = isProjectLocale ? currentPath : locale + currentPath;
			isProjectLocale = false;
		}

		result.alternates.languages = languages;
	}

	return result;
}
