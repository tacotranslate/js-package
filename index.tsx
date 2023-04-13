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

export type Entry = {i?: string; s: string; l?: Locale};
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
	['no', 'Norwegian (Bokmål)'],
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

export const localeCodes = locales.map(([code]) => code);
export const languages = locales.map(([, language]) => language);
export const rightToLeftLocaleCodes = ['ar', 'ha', 'he', 'ps', 'fa', 'ur'];

export type Locale = (typeof locales)[number][0];
export type Localizations = Record<string, Record<Locale, Translations>>;

const defaultApiUrl =
	process.env.TACOTRANSLATE_API_URL ?? 'https://api.tacotranslate.com';
const maxUrlLength = 2048;

const patchDefaultString = (string: string) =>
	string.replace(/\[{3}.*?]{3}/g, (match) => match.slice(3, -3));

export type GetTranslationsParameters = {
	apiUrl: string;
	apiKey: string;
	locale: Locale;
	projectLocale?: Locale;
	entries?: Entry[];
	origin?: string;
	timeout?: number;
};

type GetTranslationsResponse =
	| {
			success: false;
			error: TacoTranslateError;
	  }
	| {
			success: true;
			inputLocale: Locale;
			outputLocale: Locale;
			translations: Translations;
			errors: TacoTranslateError[];
	  };

async function getTranslations({
	apiUrl = defaultApiUrl,
	apiKey,
	locale,
	entries,
	origin,
	timeout = 2000,
}: GetTranslationsParameters): Promise<Translations> {
	return new Promise((resolve, reject) => {
		const requests = [];
		let url = `${apiUrl}/api/v1/t?a=${apiKey}&l=${locale}`;

		if (origin) {
			url += `&o=${encodeURIComponent(origin)}`;
		}

		if (entries) {
			const preparedEntries = entries.map((entry) =>
				entry.i === entry.s ? {s: entry.s} : {i: entry.i, s: entry.s}
			);

			preparedEntries.sort((a, b) => a.s.localeCompare(b.s));

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
				.then((data: GetTranslationsResponse) => {
					if (data.success) {
						if (process.env.NODE_ENV === 'development' && data.errors) {
							for (const error of data.errors) {
								console.error(
									new Error(
										`<TacoTranslate> encountered an error when doing a \`getTranslations\` request: ${error.message}`
									)
								);
							}
						}

						return data.translations;
					}

					if (data.error.code === 'locale_is_source_locale') {
						return {};
					}

					const error: TacoTranslateError = new Error(data.error.message);
					error.code = data.error.code;
					error.type = data.error.type;
					throw error;
				})
		);

		let hasTimedOut = false;
		const timeoutInstance = setTimeout(() => {
			reject(new Error('<TacoTranslate> `getTranslations` timeout.'));
			hasTimedOut = true;
		}, timeout);

		void Promise.all(requests)
			.then((translations) => {
				if (!hasTimedOut) {
					clearTimeout(timeoutInstance);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					resolve(Object.assign({}, ...translations));
				}
			})
			.catch((error) => {
				if (!hasTimedOut) {
					reject(error);
				}
			});
	});
}

export type GetLocalesParameters = {
	apiUrl: string;
	apiKey: string;
	timeout?: number;
};

type GetLocalesResponse =
	| {
			success: false;
			error: TacoTranslateError;
	  }
	| {
			success: true;
			locales: Locale[];
	  };

async function getLocales({
	apiUrl = defaultApiUrl,
	apiKey,
	timeout = 2000,
}: GetLocalesParameters) {
	return new Promise((resolve, reject) => {
		const url = `${apiUrl}/api/v1/l?a=${apiKey}`;
		let hasTimedOut = false;
		const timeoutInstance = setTimeout(() => {
			reject(new Error('<TacoTranslate> `getLocales` timeout.'));
			hasTimedOut = true;
		}, timeout);

		fetch(url)
			.then(async (response) => response.json())
			.then((data: GetLocalesResponse) => {
				if (!hasTimedOut) {
					clearTimeout(timeoutInstance);

					if (data.success) {
						resolve(data.locales);
						return;
					}

					const error: TacoTranslateError = new Error(data.error.message);
					error.code = data.error.code;
					error.type = data.error.type;
					reject(error);
				}
			})
			.catch((error) => {
				if (!hasTimedOut) {
					reject(error);
				}
			});
	});
}

export type CreateTacoTranslateClientParameters = {
	apiUrl?: string;
	apiKey: string;
	projectLocale?: Locale;
	isEnabled?: boolean;
};

export type TacoTranslateClientParameters = {locale: Locale};
export type ClientGetTranslationsParameters = {
	entries?: Entry[];
	origin?: string;
};

const getEntryKey = (entry: Entry) =>
	entry.i ? `${entry.i}:${entry.s}` : entry.s;

const createTacoTranslateClient =
	({
		apiUrl = defaultApiUrl,
		apiKey,
		projectLocale,
		isEnabled = true,
	}: CreateTacoTranslateClientParameters) =>
	({locale}: TacoTranslateClientParameters) => ({
		getTranslations: async ({
			entries,
			origin,
		}: ClientGetTranslationsParameters) =>
			isEnabled && locale !== projectLocale
				? getTranslations({
						apiUrl,
						apiKey,
						locale,
						projectLocale,
						entries,
						origin,
				  })
				: {},
		getLocales: async () =>
			isEnabled
				? getLocales({apiUrl, apiKey}).catch((error) => {
						console.error(error);
						return localeCodes;
				  })
				: localeCodes,
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
				`return object['${identifier}'];`
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

export type TranslationContextProperties = {
	origin?: string;
	client?: ReturnType<typeof createTacoTranslateClient>;
	locale?: Locale;
	translations?: Translations;
	useDangerouslySetInnerHTML?: boolean;
};

export type TacoTranslateContextProperties = TranslationContextProperties & {
	isLoading?: boolean;
	isLeftToRight?: boolean;
	isRightToLeft?: boolean;
	entries: Entry[];
	createEntry: (entry: Entry) => void;
	Translate: typeof Translate;
	translate: typeof useTranslateStringFunction;
	error?: Error;
};

const initialContext: TacoTranslateContextProperties = {
	entries: [],
	createEntry: () => undefined,
	Translate,
	translate: (inputString: string) => inputString,
};

const TacoTranslateContext =
	createContext<TacoTranslateContextProperties>(initialContext);

const TranslationContext = createContext<TranslationContextProperties>({});

export const useTacoTranslate = () => {
	const context = useContext(TacoTranslateContext);

	if (process.env.NODE_ENV === 'development') {
		if (!context.client) {
			throw new TypeError(
				'<TacoTranslate> is unable to find required <TranslationProvider>. `client` is not set.'
			);
		} else if (!context.locale) {
			throw new TypeError(
				'<TacoTranslate> `locale` is required on <TranslationProvider>.'
			);
		}
	}

	return context;
};

export type TranslateComponentProperties = HTMLAttributes<HTMLSpanElement> &
	TranslateOptions & {
		as?: keyof HTMLElementTagNameMap;
		string: string;
		// eslint-disable-next-line react/boolean-prop-naming
		useDangerouslySetInnerHTML?: boolean;
	};

function useTranslateStringFunction(
	inputString: string,
	options?: TranslateOptions
) {
	const {id, variables} = options ?? {};
	const {translations, locale, createEntry} = useTacoTranslate();

	if (process.env.NODE_ENV === 'development') {
		if (typeof inputString !== 'string') {
			throw new TypeError('<TacoTranslate> `string` must be a string.');
		} else if (inputString.length > 1500) {
			throw new TypeError(
				`<TacoTranslate> \`string\` is too long at ${inputString.length}. Max length is 1500 characters. Please split the string across multiple <TacoTranslate> components/functions.`
			);
		}

		if (inputString.includes('  ')) {
			console.warn(
				`<TacoTranslate> Detected a \`string\` with multiple spaces. This may lead to unintenional side-effects in the translation: \`${inputString}\``
			);
		}

		if (id) {
			if (typeof id !== 'string') {
				throw new TypeError('<TacoTranslate> `id` must be a string.');
			} else if (id.length > 50) {
				throw new TypeError(
					`<TacoTranslate> \`id\` is too long at ${id.length}. Max length is 50 characters.`
				);
			} else if (!/^[a-zA-Z_][a-z\d-_]*$/.test(id)) {
				throw new TypeError(
					`<TacoTranslate> \`id\` format is invalid. Must satisfy \`[a-zA-Z_][a-z0-9-_]*\`.`
				);
			}
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

	const translation = translations?.[id ? `${id}:${string}` : string];
	const output = useMemo(() => {
		const value = translation ?? patchDefaultString(string);

		if (variables) {
			return template(value, variables);
		}

		return value;
	}, [translation, string, variables]);

	useEffect(() => {
		if (!translation && createEntry) {
			createEntry({i: id, s: string, l: locale});
		}
	}, [translation, createEntry, id, string, locale]);

	return output;
}

function Translate({
	id,
	string,
	variables,
	as = 'span',
	useDangerouslySetInnerHTML: componentUseDangerouslySetInnerHtml,
	...parameters
}: TranslateComponentProperties) {
	const {useDangerouslySetInnerHTML: contextUseDangerouslySetInnerHtml} =
		useTacoTranslate();
	const useDangerouslySetInnerHtml =
		componentUseDangerouslySetInnerHtml === undefined
			? contextUseDangerouslySetInnerHtml ?? false
			: componentUseDangerouslySetInnerHtml ?? false;

	const output = useTranslateStringFunction(string, {id, variables});
	const sanitized = useMemo(
		() =>
			useDangerouslySetInnerHtml
				? // eslint-disable-next-line @typescript-eslint/naming-convention
				  sanitize(output, {USE_PROFILES: {html: true}})
				: output,
		[useDangerouslySetInnerHtml, output]
	);

	if (useDangerouslySetInnerHtml) {
		return createElement(as, {
			...parameters,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			dangerouslySetInnerHTML: {__html: sanitized},
		});
	}

	return createElement(as, parameters, output);
}

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
		// eslint-disable-next-line @typescript-eslint/naming-convention
		useDangerouslySetInnerHTML = true,
		children,
	} = properties;

	const [isLoading, setIsLoading] = useState<boolean>();
	const [error, setError] = useState<Error>();
	const [currentLocale, setCurrentLocale] = useState(locale);
	const [entries, setEntries] = useState<Entry[]>([]);
	const [currentOrigin, setCurrentOrigin] = useState(() => {
		if (typeof window === 'undefined') {
			return origin ?? '*';
		}

		return origin ?? window.location.host + window.location.pathname;
	});

	if (origin) {
		if (origin !== currentOrigin) {
			setCurrentOrigin(origin);
		}
	} else if (typeof window !== 'undefined') {
		const currentUrl = window.location.host + window.location.pathname;

		if (currentOrigin !== currentUrl) {
			setCurrentOrigin(currentUrl);
		}
	}

	const [localizations, setLocalizations] = useState<Localizations>(() =>
		locale ? {[currentOrigin]: {[locale]: inputTranslations ?? {}}} : {}
	);

	const createEntry = useCallback((inputEntry: Entry) => {
		const {l, ...entry} = inputEntry;
		setEntries((previousEntries) => [...previousEntries, entry]);
	}, []);

	const isRightToLeft = useMemo(
		() =>
			currentLocale
				? rightToLeftLocaleCodes.includes(currentLocale)
				: undefined,
		[currentLocale]
	);

	const isLeftToRight = useMemo(() => !isRightToLeft, [isRightToLeft]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (entries.length > 0) {
				if (!isLoading && client && locale) {
					setIsLoading(true);

					const {getTranslations} = client({locale});
					const currentEntryKeys = new Set<string>();
					const currentEntries: Entry[] = [];

					for (const entry of entries) {
						const entryKey = getEntryKey(entry);

						if (!currentEntryKeys.has(entryKey)) {
							currentEntryKeys.add(entryKey);
							currentEntries.push(entry);
						}
					}

					setEntries((previousEntries) =>
						previousEntries.filter(
							(entry) => !currentEntryKeys.has(getEntryKey(entry))
						)
					);

					getTranslations({entries: currentEntries, origin: currentOrigin})
						.then((translations) => {
							setLocalizations((previousLocalizations) => ({
								...previousLocalizations,
								[currentOrigin]: {
									...previousLocalizations[currentOrigin],
									[locale]: {
										...previousLocalizations[currentOrigin]?.[locale],
										...translations,
									},
								},
							}));

							setCurrentLocale(locale);
							setIsLoading(false);
						})
						.catch((error: unknown) => {
							if (process.env.NODE_ENV === 'development') {
								console.error(error);
							}

							if (error instanceof Error) {
								setError(error);
							}

							setIsLoading(false);
						});
				}
			} else {
				setCurrentLocale(locale);
			}
		}
	}, [client, currentOrigin, entries, isLoading, locale]);

	const patchedLocalizations = useMemo(
		() =>
			origin && locale
				? {
						...localizations,
						[origin]: {
							...localizations[origin],
							[locale]: {
								...localizations[origin]?.[locale],
								...inputTranslations,
							},
						},
				  }
				: localizations,
		[origin, locale, inputTranslations, localizations]
	);

	const translations = useMemo(
		() =>
			currentLocale
				? patchedLocalizations[currentOrigin]?.[currentLocale] ?? {}
				: {},
		[patchedLocalizations, currentOrigin, currentLocale]
	);

	const value = useMemo(
		() => ({
			client,
			locale,
			isLoading,
			isLeftToRight,
			isRightToLeft,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			useDangerouslySetInnerHTML,
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
			isLoading,
			isLeftToRight,
			isRightToLeft,
			useDangerouslySetInnerHTML,
			entries,
			translations,
			createEntry,
			error,
		]
	);

	return (
		<TranslationContext.Provider value={value}>
			<TacoTranslateContext.Provider value={value}>
				{children}
			</TacoTranslateContext.Provider>
		</TranslationContext.Provider>
	);
}
