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
import {sanitize} from 'isomorphic-dompurify';

type TacoTranslateError = Error & {code?: string; type?: string};

export type Entry = {k?: string; s: string; l?: Locale};
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
	['no', 'Norwegian (bokmål)'],
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

export const rightToLeftLocaleCodes = ['ar', 'ha', 'he', 'ps', 'fa', 'ur'];

export type Locale = (typeof locales)[number][0];
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
	projectLocale,
	entries,
	origin,
}: {
	apiUrl: string;
	apiKey: string;
	locale: Locale;
	projectLocale?: Locale;
	entries?: Entry[];
	origin?: string;
}): Promise<Translations> {
	if (locale === projectLocale) {
		return {};
	}

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
					entries: excludedEntries.map((entry) => ({
						...entry,
						k: entry.k ?? entry.s,
					})),
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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Object.assign({}, ...translations);
}

export type CreateTacoTranslateClientParameters = {
	apiUrl?: string;
	apiKey: string;
	projectLocale?: Locale;
	isEnabled?: boolean;
};

export type TacoTranslateClientParameters = {locale: Locale};
export type GetTranslationsParameters = {entries?: Entry[]; origin?: string};

const createTacoTranslateClient =
	({
		apiUrl = defaultApiUrl,
		apiKey,
		projectLocale,
		isEnabled = true,
	}: CreateTacoTranslateClientParameters) =>
	({locale}: TacoTranslateClientParameters) => ({
		getTranslations: async ({entries, origin}: GetTranslationsParameters) =>
			isEnabled
				? getTranslations({
						apiUrl,
						apiKey,
						locale,
						projectLocale,
						entries,
						origin,
				  })
				: {},
	});

export default createTacoTranslateClient;

export type TranslateOptions = {
	id?: string;
	variables?: Record<string, string>;
};

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
			// eslint-disable-next-line no-new-func, @typescript-eslint/no-unsafe-assignment
			const value: string = new Function(
				'object',
				`return object.${identifier};`
			)(object);

			if (typeof value === 'string') {
				return value;
			}

			return templateIdentifier;
		} catch (error: unknown) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error);
			}

			return templateIdentifier;
		}
	});

function useTranslateStringFunction(
	inputString: string,
	options?: TranslateOptions
) {
	const {id, variables} = options ?? {};
	const {translations, locale, createEntry} = useContext(TranslationContext);

	if (process.env.NODE_ENV === 'development') {
		if (typeof inputString !== 'string') {
			throw new TypeError('<TacoTranslate> `string` must be a string.');
		} else if (inputString.length > 1500) {
			throw new TypeError(
				`<TacoTranslate> 'string' is too long at ${inputString.length}. Max length is 1500 characters. Please split the string across multiple <TacoTranslate> components/functions.`
			);
		}

		if (inputString.includes('  ')) {
			console.warn(
				`<TacoTranslate> Detected a 'string' with multiple spaces. This may lead to unintenional side-effects in the translation: '${inputString}'`
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
			createEntry({k: key, s: string, l: locale});
		}
	}, [translation, createEntry, key, string, locale]);

	return output;
}

export type TranslateComponentProperties = HTMLAttributes<HTMLSpanElement> &
	TranslateOptions & {as?: keyof HTMLElementTagNameMap; string: string};

function Translate({
	id,
	string,
	variables,
	as = 'span',
	...parameters
}: TranslateComponentProperties) {
	const output = useTranslateStringFunction(string, {id, variables});
	const sanitized = useMemo(
		// eslint-disable-next-line @typescript-eslint/naming-convention
		() => sanitize(output, {USE_PROFILES: {html: true}}),
		[output]
	);

	return createElement(as, {
		...parameters,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		dangerouslySetInnerHTML: {__html: sanitized},
	});
}

export type TranslationContextProperties = {
	origin?: string;
	client?: ReturnType<typeof createTacoTranslateClient>;
	locale?: Locale;
	isLeftToRight?: boolean;
	isRightToLeft?: boolean;
	entries?: Entry[];
	translations?: Translations;
	createEntry?: (entry: Entry) => void;
	Translate?: typeof Translate;
	translate?: typeof useTranslateStringFunction;
	error?: Error;
};

const TranslationContext = createContext<TranslationContextProperties>({});

const {Provider, Consumer: TranslationConsumer} = TranslationContext;
export {TranslationContext, TranslationConsumer};

export const useTacoTranslate = () => {
	const context = useContext(TranslationContext);

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			if (!context.client) {
				throw new TypeError(
					'<TacoTranslate> is unable to find required <TranslateProvider>.'
				);
			} else if (!context.locale) {
				throw new TypeError(
					'<TacoTranslate> `locale` is not set on <TranslateProvider>.'
				);
			}
		}
	}, [context]);

	return context;
};

export const useTranslateString = () => {
	const {translate} = useTacoTranslate();
	return translate;
};

export const useTranslate = () => {
	const {Translate} = useTacoTranslate();
	return Translate;
};

export const useLocale = () => {
	const {locale} = useTacoTranslate();
	return locale;
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

	const [error, setError] = useState<Error>();
	const [currentLocale, setCurrentLocale] = useState(locale);
	const [entries, setEntries] = useState<Entry[]>([]);
	const [localizations, setLocalizations] = useState<Localizations>(() =>
		locale ? {[locale]: inputTranslations ?? {}} : {}
	);

	const createEntry = useCallback((inputEntry: Entry) => {
		const {l, ...entry} = inputEntry;
		setEntries((previousEntries) => [...previousEntries, entry]);
	}, []);

	const isRightToLeft = useMemo(
		() => (locale ? rightToLeftLocaleCodes.includes(locale) : undefined),
		[locale]
	);

	const isLeftToRight = useMemo(() => !isRightToLeft, [isRightToLeft]);

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
					if (process.env.NODE_ENV === 'development') {
						console.error(error);
					}

					setError(error);
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
		() => (currentLocale ? localizations[currentLocale] ?? {} : {}),
		[localizations, currentLocale]
	);

	const value = useMemo(
		() => ({
			client,
			locale,
			isLeftToRight,
			isRightToLeft,
			entries,
			translations,
			createEntry,
			Translate,
			translate: useTranslateStringFunction,
			error,
		}),
		[
			client,
			locale,
			isLeftToRight,
			isRightToLeft,
			entries,
			translations,
			createEntry,
			error,
		]
	);

	return <Provider value={value}>{children}</Provider>;
}
