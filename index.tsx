import React, {
	createContext,
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	createElement,
} from 'react';

type TacoTranslateError = Error & {code?: string; type?: string};

export type Entry = {k?: string; s: string};
export type Translations = Record<string, string>;

export const locales = [
	['af', 'Afrikaans'],
	['sq', 'Albanian'],
	['am', 'Amharic'],
	['ar', 'Arabic'],
	['hy', 'Armenian'],
	['az', 'Azerbaijani'],
	['bn', 'Bengali'],
	['bs', 'Bosnian'],
	['bg', 'Bulgarian'],
	['ca', 'Catalan'],
	['zh', 'Chinese (Simplified)'],
	['zh-tw', 'Chinese (Traditional)'],
	['hr', 'Croatian'],
	['cs', 'Czech'],
	['da', 'Danish'],
	['fa-af', 'Dari'],
	['nl', 'Dutch'],
	['en', 'English'],
	['et', 'Estonian'],
	['fa', 'Farsi (Persian)'],
	['tl', 'Filipino, Tagalog'],
	['fi', 'Finnish'],
	['fr', 'French'],
	['fr-ca', 'French (Canada)'],
	['ka', 'Georgian'],
	['de', 'German'],
	['el', 'Greek'],
	['gu', 'Gujarati'],
	['ht', 'Haitian Creole'],
	['ha', 'Hausa'],
	['he', 'Hebrew'],
	['hi', 'Hindi'],
	['hu', 'Hungarian'],
	['is', 'Icelandic'],
	['id', 'Indonesian'],
	['ga', 'Irish'],
	['it', 'Italian'],
	['ja', 'Japanese'],
	['kn', 'Kannada'],
	['kk', 'Kazakh'],
	['ko', 'Korean'],
	['lv', 'Latvian'],
	['lt', 'Lithuanian'],
	['mk', 'Macedonian'],
	['ms', 'Malay'],
	['ml', 'Malayalam'],
	['mt', 'Maltese'],
	['mr', 'Marathi'],
	['mn', 'Mongolian'],
	['no', 'Norwegian'],
	['ps', 'Pashto'],
	['pl', 'Polish'],
	['pt', 'Portuguese (Brazil)'],
	['pt-pt', 'Portuguese (Portugal)'],
	['pa', 'Punjabi'],
	['ro', 'Romanian'],
	['ru', 'Russian'],
	['sr', 'Serbian'],
	['si', 'Sinhala'],
	['sk', 'Slovak'],
	['sl', 'Slovenian'],
	['so', 'Somali'],
	['es', 'Spanish'],
	['es-mx', 'Spanish (Mexico)'],
	['sw', 'Swahili'],
	['sv', 'Swedish'],
	['ta', 'Tamil'],
	['te', 'Telugu'],
	['th', 'Thai'],
	['tr', 'Turkish'],
	['uk', 'Ukrainian'],
	['ur', 'Urdu'],
	['uz', 'Uzbek'],
	['vi', 'Vietnamese'],
	['cy', 'Welsh'],
];

export type Locale = typeof locales[number][0];
export type Localizations = Record<Locale, Translations>;

const defaultApiUrl =
	process.env.TACOTRANSLATE_API_URL ?? 'https://api.tacotranslate.com';
const maxUrlLength = 2048;

const patchDefaultString = (string: string) =>
	string.replace(/\[{3}.*?]{3}/g, (match) => match.slice(3, -3));

async function getTranslations({
	apiUrl = defaultApiUrl,
	apiKey,
	locale,
	entries,
	origin,
}: {
	apiUrl: string;
	apiKey: string;
	locale: Locale;
	entries?: Entry[];
	origin?: string;
}): Promise<Translations> {
	const requests = [];
	let url = `${apiUrl}/api/v1/t?a=${apiKey}&l=${locale}`;

	if (origin) {
		url += `&o=${encodeURIComponent(origin)}`;
	}

	if (entries) {
		const preparedEntries = entries
			.filter(
				(entry, index, self) =>
					index === self.findIndex((thing) => thing.k === entry.k)
			)
			.map((entry) =>
				entry.k === entry.s ? {s: entry.s} : {k: entry.k, s: entry.s}
			);

		const includedEntries: Entry[] = [];
		const excludedEntries: Entry[] = [];

		for (const entry of preparedEntries) {
			const attemptedUrl = `${url}&s=${encodeURIComponent(
				JSON.stringify([...includedEntries, entry])
			)}`;

			if (attemptedUrl.length < maxUrlLength) {
				includedEntries.push(entry);
			} else {
				excludedEntries.push(entry);
			}
		}

		url += `&s=${encodeURIComponent(JSON.stringify(includedEntries))}`;

		if (excludedEntries.length > 0) {
			requests.push(
				getTranslations({
					apiUrl,
					apiKey,
					locale,
					entries: excludedEntries,
					origin,
				})
			);
		}
	}

	requests.push(
		fetch(url)
			.then(async (response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.translations as Translations;
				}

				if (data.error.code === 'locale_is_source_locale') {
					return {};
				}

				const error: TacoTranslateError = new Error(data.error.message);
				error.code = data.error.code as string;
				error.type = data.error.type as string;
				throw error;
			})
	);

	const translations: Translations[] = await Promise.all(requests);
	return Object.assign({}, ...translations);
}

export type CreateTacoTranslateClientParameters = {
	apiUrl?: string;
	apiKey: string;
};

type TacoTranslateClientParameters = {locale: Locale};
export type GetTranslationsParameters = {entries?: Entry[]; origin?: string};

const createTacoTranslateClient =
	({apiUrl = defaultApiUrl, apiKey}: CreateTacoTranslateClientParameters) =>
	({locale}: TacoTranslateClientParameters) => ({
		getTranslations: async ({entries, origin}: GetTranslationsParameters) =>
			getTranslations({
				apiUrl,
				apiKey,
				locale,
				entries,
				origin,
			}),
	});

export default createTacoTranslateClient;

export type TranslateProperties = {
	id?: string;
	string: string;
	variables?: Record<string, string>;
};

export type TranslateComponentProperties = HTMLAttributes<HTMLSpanElement> &
	TranslateProperties & {as?: keyof HTMLElementTagNameMap};

export type TranslationContextProperties = {
	origin?: string;
	client?: ReturnType<typeof createTacoTranslateClient>;
	locale?: Locale;
	entries?: Entry[];
	translations?: Translations;
	createEntry?: (entry: Entry) => void;
	Translate?: typeof Translate;
	translate?: typeof useTranslateStringFunction;
};

const TranslationContext = createContext<TranslationContextProperties>({});
const {Provider, Consumer: TranslationConsumer} = TranslationContext;
export {TranslationContext, TranslationConsumer};

/**
 * Transform a string template
 * @param {string} input - the input string
 * @param {object} object - the template object
 *
 * @returns {string} the transformed output
 **/
const template = (input = '', object: Record<string, string> = {}) =>
	input.replace(/{{[\w.]+}}/g, (templateIdentifier) => {
		const identifier = templateIdentifier.slice(2, -2);

		try {
			// eslint-disable-next-line no-new-func
			const value = new Function('object', `return object.${identifier};`)(
				object
			);

			if (typeof value === 'string') {
				return value;
			}

			return templateIdentifier;
		} catch (error: unknown) {
			console.error(error);
			return templateIdentifier;
		}
	});

function useTranslateStringFunction({
	id,
	string: inputString,
	variables,
}: TranslateProperties) {
	const {translations, createEntry} = useContext(TranslationContext);

	if (process.env.NODE_ENV === 'development') {
		if (typeof inputString !== 'string') {
			throw new TypeError('<Translate> `string` must be a string');
		} else if (inputString.length > 1500) {
			throw new TypeError(
				`<Translate> \`string\` is too long at ${inputString.length}. Max length is 1500 characters. Please split the string across multiple <Translate> components.`
			);
		}
	}

	const string = useMemo(() => {
		if (variables) {
			return inputString.replace(/{{\s*[\w.]+\s*}}/g, (match) => {
				const identifier = match.slice(2, -2);
				return `[[[{{${identifier}}}]]]`;
			});
		}

		return inputString;
	}, [variables, inputString]);

	const key = id ?? string;
	const translation = translations?.[key];
	const output = useMemo(() => {
		const value = translation ?? patchDefaultString(string);

		if (variables) {
			return template(value, variables);
		}

		return value;
	}, [translation, string, variables]);

	useEffect(() => {
		if (!translation && createEntry) {
			createEntry({k: key, s: string});
		}
	}, [translation, createEntry, key, string]);

	return output;
}

export const useTranslateString = () => {
	const {translate} = useContext(TranslationContext);
	return translate;
};

function Translate({
	id,
	string,
	variables,
	as = 'span',
	...parameters
}: TranslateComponentProperties) {
	const output = useTranslateStringFunction({id, string, variables});

	return createElement(as, {
		...parameters,
		dangerouslySetInnerHTML: {__html: output},
	});
}

export const useTranslate = () => {
	const {Translate} = useContext(TranslationContext);
	return Translate;
};

export function TranslationProvider(
	properties: TranslationContextProperties & {
		children: ReactNode;
	}
) {
	const {
		origin,
		client,
		locale,
		translations: inputTranslations,
		children,
	} = properties;

	const [currentLocale, setCurrentLocale] = useState(locale);
	const [entries, setEntries] = useState<Entry[]>([]);
	const [localizations, setLocalizations] = useState<Localizations>(() =>
		locale ? {[locale]: inputTranslations ?? {}} : {}
	);

	const createEntry = useCallback((entry: Entry) => {
		setEntries((previousEntries) => [...previousEntries, entry]);
	}, []);

	useEffect(() => {
		if (!client || !locale) {
			return;
		}

		if (typeof window !== 'undefined' && entries.length > 0) {
			const currentOrigin =
				origin ?? window.location.host + window.location.pathname;
			const {getTranslations} = client({locale});
			const currentEntries = [...entries];
			const currentEntryKeys = new Set(
				currentEntries.map((entry) => entry.k ?? entry.s)
			);

			setEntries((previousEntries) => [
				...previousEntries.filter(
					(entry) => !currentEntryKeys.has(entry.k ?? entry.s)
				),
			]);

			getTranslations({entries: currentEntries, origin: currentOrigin})
				.then((translations) => {
					setLocalizations((previousLocalizations) => ({
						...previousLocalizations,
						[locale]: {
							...previousLocalizations[locale],
							...translations,
						},
					}));

					setCurrentLocale(locale);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [client, locale, entries, origin]);

	useEffect(() => {
		if (locale) {
			setCurrentLocale(locale);

			if (inputTranslations && Object.keys(inputTranslations).length > 0) {
				setLocalizations((previousLocalizations) => ({
					...previousLocalizations,
					[locale]: {
						...previousLocalizations[locale],
						...inputTranslations,
					},
				}));
			}
		}
	}, [locale, inputTranslations]);

	const translations = useMemo(
		() => (currentLocale ? localizations[currentLocale] : {}),
		[localizations, currentLocale]
	);

	const value = useMemo(
		() => ({
			client,
			locale,
			entries,
			translations,
			createEntry,
			Translate,
			translate: useTranslateStringFunction,
		}),
		[client, locale, entries, translations, createEntry]
	);

	return <Provider value={value}>{children}</Provider>;
}

export const useTacoTranslate = () => useContext(TranslationContext);
