export type TacoTranslateError = Error & {code?: string; type?: string};
export type Entry = {i?: string; s: string; o?: Origin; l?: Locale};
export type Translations = Record<string, string>;

export type VerboseEntry = {id?: string; string: string};
export const createEntry = (entry: VerboseEntry): Entry => ({
	i: entry.id,
	s: entry.string,
});

export const getEntryKey = (entry: Entry, client?: TacoTranslateClient) =>
	client?.getTranslationKey
		? client.getTranslationKey(entry)
		: entry.i
		? `${entry.i}:${entry.s}`
		: entry.s;

export const cleanString = (string: string) =>
	string.trim().replace(/\s+/g, ' ');

export const patchDefaultString = (string: string) =>
	string.replace(/\[{3}.*?]{3}/g, (match) => match.slice(3, -3));

export type TemplateVariables = Record<string, string>;

/**
 * Transform a string template
 * @param {string} input - the input string
 * @param {object} object - the template object
 *
 * @returns {string} the transformed output
 **/
export const template = (input = '', object: TemplateVariables = {}) =>
	input.replace(/{{[\w.]+}}/g, (templateIdentifier) => {
		const identifier = templateIdentifier.slice(2, -2);

		try {
			const value = object[identifier];

			if (typeof value === 'string') {
				return value;
			}
		} catch (error: unknown) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error);
			}
		}

		return '';
	});

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
	['zh', 'Chinese (Simplified)', 'Chinese'],
	['zh-tw', 'Chinese (Traditional)', 'Chinese'],
	['hr', 'Croatian'],
	['cs', 'Czech'],
	['da', 'Danish'],
	['fa-af', 'Dari'],
	['nl', 'Dutch'],
	['en', 'English'],
	['et', 'Estonian'],
	['fa', 'Farsi (Persian)', 'Farsi'],
	['tl', 'Filipino (Tagalog)', 'Filipino'],
	['fi', 'Finnish'],
	['fr', 'French'],
	['fr-ca', 'French (Canada)', 'French'],
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
	['no', 'Norwegian (Bokmål)', 'Norwegian'],
	['nn', 'Norwegian (Nynorsk)', 'Norwegian'],
	['ps', 'Pashto'],
	['pl', 'Polish'],
	['pt', 'Portuguese (Brazil)', 'Portuguese'],
	['pt-pt', 'Portuguese (Portugal)', 'Portuguese'],
	['pa', 'Punjabi'],
	['ro', 'Romanian'],
	['ru', 'Russian'],
	['sr', 'Serbian'],
	['si', 'Sinhala'],
	['sk', 'Slovak'],
	['sl', 'Slovenian'],
	['so', 'Somali'],
	['es', 'Spanish'],
	['es-mx', 'Spanish (Mexico)', 'Spanish'],
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

export type Locale = (typeof locales)[number][0];
export type Language = (typeof locales)[number][1];

export const localeCodes = locales.map(([code]) => code);
export const languages = locales.map(([, language]) => language);
export const rightToLeftLocaleCodes = ['ar', 'he', 'ps', 'fa', 'ur'];

export function isRightToLeftLocaleCode(locale: Locale) {
	return rightToLeftLocaleCodes.includes(locale);
}

const localeToCountryCodeMap = {
	'af': 'za', // Afrikaans -> South Africa
	'am': 'et', // Amharic -> Ethiopia
	'ar': 'sa', // Arabic -> Saudi Arabia
	'bn': 'bd', // Bengali -> Bangladesh
	'bs': 'ba', // Bosnian -> Bosnia and Herzegovina
	'ca': 'es', // Catalan -> Spain
	'cs': 'cz', // Czech -> Czech Republic
	'cy': 'gb', // Welsh -> United Kingdom
	'da': 'dk', // Danish -> Denmark
	'el': 'gr', // Greek -> Greece
	'en': 'us', // English -> United States
	'es-mx': 'mx', // Spanish (Mexico) -> Mexico
	'et': 'ee', // Estonian -> Estonia
	'fa': 'ir', // Farsi (Persian) -> Iran
	'fa-af': 'af', // Dari -> Afghanistan
	'fr-ca': 'ca', // French (Canada) -> Canada
	'ga': 'ie', // Irish -> Ireland
	'gu': 'in', // Gujarati -> India
	'ha': 'ng', // Hausa -> Nigeria
	'he': 'il', // Hebrew -> Israel
	'hi': 'in', // Hindi -> India
	'hy': 'am', // Armenian -> Armenia
	'ja': 'jp', // Japanese -> Japan
	'ka': 'ge', // Georgian -> Georgia
	'kk': 'kz', // Kazakh -> Kazakhstan
	'kn': 'in', // Kannada -> India
	'ko': 'kr', // Korean -> Korea
	'lt': 'lt', // Lithuanian -> Lithuania
	'ml': 'in', // Malayalam -> India
	'mr': 'in', // Marathi -> India
	'ms': 'my', // Malay -> Malaysia
	'nn': 'no', // Norwegian (Nynorsk) -> Norway
	'pa': 'in', // Punjabi -> India
	'ps': 'af', // Pashto -> Afghanistan
	'pt': 'br', // Portuguese (Brazil) -> Brazil
	'pt-pt': 'pt', // Portuguese (Portugal) -> Portugal
	'si': 'lk', // Sinhala -> Sri Lanka
	'sl': 'si', // Slovenian -> Slovenia
	'sq': 'al', // Albanian -> Albania
	'sr': 'rs', // Serbian -> Serbia
	'sv': 'se', // Swedish -> Sweden
	'sw': 'ke', // Swahili -> Kenya
	'ta': 'in', // Tamil -> India
	'te': 'in', // Telugu -> India
	'th': 'th', // Thai -> Thailand
	'tr': 'tr', // Turkish -> Turkey
	'tl': 'ph', // Filipino (Tagalog) -> Philippines
	'uk': 'ua', // Ukrainian -> Ukraine
	'ur': 'pk', // Urdu -> Pakistan
	'uz': 'uz', // Uzbek -> Uzbekistan
	'vi': 'vn', // Vietnamese -> Vietnam
	'zh': 'cn', // Chinese (Simplified) -> China
	'zh-tw': 'tw', // Chinese (Traditional) -> Taiwan
};

export function localeToCountryCode(locale: Locale) {
	return (
		localeToCountryCodeMap[locale as keyof typeof localeToCountryCodeMap] ??
		locale
	);
}

export type LocaleData = {
	locale: Locale;
	baseLanguage: string;
	language: Language;
	variant?: string;
	countryCode: string;
	isLeftToRight: boolean;
};

export function getLocaleLanguageVariant(locale: Locale) {
	const data = locales.find(([code]) => code === locale);

	if (data) {
		return /\(([^)]+)\)/.exec(data[1])?.[1];
	}
}

export function getLocaleData(locale: Locale) {
	const data = locales.find(([code]) => code === locale);

	if (data) {
		return {
			locale,
			baseLanguage: data[2] ?? data[1],
			language: data[1],
			variant: getLocaleLanguageVariant(locale),
			countryCode: localeToCountryCode(locale),
			isLeftToRight: !isRightToLeftLocaleCode(locale),
		};
	}
}

export function localeToLanguage(locale: Locale): Language | undefined {
	return getLocaleData(locale)?.language;
}

export function localeToBaseLanguage(locale: Locale): string | undefined {
	return getLocaleData(locale)?.baseLanguage;
}

export type Origin = string;
export type Localizations = Record<Origin, Record<Locale, Translations>>;

const defaultApiUrl = 'https://api.tacotranslate.com';
const maxUrlLength = 2048;

export type GetTranslationsParameters = {
	apiUrl: string;
	apiKey: string;
	locale: Locale;
	projectLocale?: Locale;
	entries?: Entry[];
	origin?: Origin;
	timeout?: number;
	/** @default false */
	throwOnError?: boolean;
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

const getTranslationsQueue: Record<string, Promise<Translations>> = {};

async function getTranslations({
	apiUrl = defaultApiUrl,
	apiKey,
	locale,
	entries,
	origin,
	timeout = 10_000,
	throwOnError = false,
}: GetTranslationsParameters): Promise<Translations> {
	return new Promise((resolve, reject) => {
		const requests: Array<Promise<Translations>> = [];
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

				if (process.env.NODE_ENV === 'development' && entry.s.includes('  ')) {
					console.warn(
						`<TacoTranslate> Detected a \`string\` with multiple spaces. This may lead to unintenional side-effects in the translation. Consider using \`cleanString()\` first: \`${entry.s}\``
					);
				}

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
						throwOnError: true,
					})
				);
			}
		}

		if (url in getTranslationsQueue) {
			requests.push(getTranslationsQueue[url]);
		} else {
			const promise = fetch(url)
				.then(async (response) => response.json())
				.then((data: GetTranslationsResponse) => {
					if (url in getTranslationsQueue) {
						// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
						delete getTranslationsQueue[url];
					}

					if (data.success) {
						if (process.env.NODE_ENV === 'development' && data.errors) {
							for (const error of data.errors) {
								console.error(
									new Error(
										`<TacoTranslate> encountered an error when doing a \`getTranslations\` request (${JSON.stringify(
											{locale, origin}
										)}):${error.code ? ` (${error.code})` : ''} ${
											error.message
										}`
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
				});

			getTranslationsQueue[url] = promise;
			requests.push(promise);
		}

		let hasTimedOut = false;
		const timeoutInstance = setTimeout(() => {
			const error = new Error(
				`<TacoTranslate> \`getTranslations\` timeout (${JSON.stringify({
					locale,
					origin,
				})}).`
			);

			if (throwOnError) {
				reject(error);
			} else {
				console.error(error);
				resolve({});
			}

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
					clearTimeout(timeoutInstance);

					if (throwOnError) {
						reject(error);
					} else {
						console.error(error);
						resolve({});
					}
				}
			});
	});
}

export type GetLocalesParameters = {
	apiUrl: string;
	apiKey: string;
	timeout?: number;
	/** @default false */
	throwOnError?: boolean;
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
	throwOnError = false,
}: GetLocalesParameters): Promise<Locale[]> {
	return new Promise((resolve, reject) => {
		const url = `${apiUrl}/api/v1/l?a=${apiKey}`;
		const fallback = process.env.TACOTRANSLATE_DEFAULT_LOCALE
			? [process.env.TACOTRANSLATE_DEFAULT_LOCALE]
			: [];

		let hasTimedOut = false;
		const timeoutInstance = setTimeout(() => {
			const error = new Error('<TacoTranslate> `getLocales` timeout.');

			if (throwOnError) {
				reject(error);
			} else {
				console.error(error);
				resolve(fallback);
			}

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
					if (throwOnError) {
						reject(error);
					} else {
						console.error(error);
						resolve(fallback);
					}
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

export type ClientGetTranslationsParameters = {
	locale: Locale;
	entries?: Entry[];
	origin?: Origin;
	throwOnError?: boolean;
};

export type ClientGetLocalizationsParameters = {
	locale?: Locale;
	locales?: Locale[];
	origin?: Origin;
	origins?: Origin[];
	throwOnError?: boolean;
};

const createTacoTranslateClient = ({
	apiUrl = defaultApiUrl,
	apiKey,
	projectLocale,
	isEnabled = true,
}: CreateTacoTranslateClientParameters) => ({
	origins: [] as Origin[],
	entries: [] as Entry[],
	getTranslations: async ({
		locale,
		entries,
		origin,
		throwOnError,
	}: ClientGetTranslationsParameters) =>
		isEnabled && locale !== projectLocale
			? getTranslations({
					apiUrl,
					apiKey,
					locale,
					projectLocale,
					entries,
					origin,
					throwOnError,
			  })
			: {},
	async getLocalizations({
		locale,
		locales,
		origin,
		origins,
		throwOnError,
	}: ClientGetLocalizationsParameters) {
		if (!isEnabled) {
			return {};
		}

		const originsToFetch = new Set(origin ? [origin] : origins ?? []);
		const localesToFetch = new Set(locale ? [locale] : locales ?? []);

		if (originsToFetch.size === 0 || localesToFetch.size === 0) {
			return {};
		}

		const promises: Array<Promise<void>> = [];
		const localizations: Localizations = {};

		for (const origin of originsToFetch) {
			for (const locale of localesToFetch) {
				promises.push(
					getTranslations({
						apiUrl,
						apiKey,
						locale,
						projectLocale,
						origin,
						throwOnError,
					}).then((translations) => {
						localizations[origin] = {
							...localizations?.[origin],
							[locale]: {
								...localizations[origin]?.[locale],
								...translations,
							},
						};
					})
				);
			}
		}

		await Promise.all(promises);
		return localizations;
	},
	getLocales: async (options?: Pick<GetLocalesParameters, 'throwOnError'>) =>
		isEnabled
			? getLocales({...options, apiUrl, apiKey})
			: process.env.TACOTRANSLATE_DEFAULT_LOCALE
			? [process.env.TACOTRANSLATE_DEFAULT_LOCALE]
			: [],
});

export default createTacoTranslateClient;

export const getEntryFromTranslations = (
	entry: Entry,
	translations: Translations,
	client?: TacoTranslateClient
) => translations[getEntryKey(entry, client)] ?? patchDefaultString(entry.s);

export type TacoTranslateClient = ReturnType<
	typeof createTacoTranslateClient
> & {getTranslationKey?: (entry: Entry) => string};

export async function translateEntries(
	client: TacoTranslateClient,
	{origin, locale}: Pick<ClientGetTranslationsParameters, 'origin' | 'locale'>,
	entries: Entry[]
) {
	const translations = await client.getTranslations({origin, locale, entries});

	return (entry: Entry, variables?: TemplateVariables) => {
		const result = getEntryFromTranslations(entry, translations, client);

		if (variables) {
			return template(result, variables);
		}

		return result;
	};
}
