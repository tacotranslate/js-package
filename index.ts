export type TacoTranslateError = Error & {code?: string; type?: string};
export type Entry = {i?: string; s: string; l?: Locale};
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
	['tl', 'Filipino, Tagalog', 'Tagalog'],
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

export const localeCodes = locales.map(([code]) => code);
export const languages = locales.map(([, language]) => language);
export const rightToLeftLocaleCodes = ['ar', 'he', 'ps', 'fa', 'ur'];

export type Locale = (typeof locales)[number][0];
export type Language = (typeof locales)[number][1];

export function isRightToLeftLocaleCode(locale: Locale) {
	return rightToLeftLocaleCodes.includes(locale);
}

const localeToCountryCodeMap = {
	'af': 'za',
	'am': 'et',
	'ar': 'sa',
	'bn': 'bd',
	'bs': 'ba',
	'ca': 'es',
	'cs': 'cz',
	'cy': 'gb',
	'da': 'dk',
	'el': 'gr',
	'en': 'us',
	'es-mx': 'mx',
	'et': 'ee',
	'fa': 'ir',
	'fa-af': 'af',
	'fr-ca': 'ca',
	'ga': 'ie',
	'gu': 'in',
	'ha': 'ng',
	'he': 'il',
	'hi': 'in',
	'hy': 'am',
	'ja': 'jp',
	'ka': 'ge',
	'kk': 'kz',
	'kn': 'in',
	'ko': 'kr',
	'lt': 'lt',
	'ml': 'in',
	'mr': 'in',
	'ms': 'my',
	'pa': 'in',
	'ps': 'af',
	'pt': 'br',
	'pt-pt': 'pt',
	'si': 'lk',
	'sl': 'si',
	'sq': 'al',
	'sr': 'rs',
	'sv': 'se',
	'sw': 'ke',
	'ta': 'in',
	'te': 'in',
	'th': 'th',
	'tr': 'tr',
	'tl': 'ph',
	'uk': 'ua',
	'ur': 'pk',
	'uz': 'uz',
	'vi': 'vn',
	'zh': 'cn',
	'zh-tw': 'tw',
};

export function localeToCountryCode(locale: Locale) {
	return (
		localeToCountryCodeMap[locale as keyof typeof localeToCountryCodeMap] ??
		locale
	);
}

export type Localizations = Record<string, Record<Locale, Translations>>;

const defaultApiUrl = 'https://api.tacotranslate.com';
const maxUrlLength = 2048;

export type GetTranslationsParameters = {
	apiUrl: string;
	apiKey: string;
	locale: Locale;
	projectLocale?: Locale;
	entries?: Entry[];
	origin?: string;
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
						throwOnError: true,
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
										`<TacoTranslate> encountered an error when doing a \`getTranslations\` request:${
											error.code ? ` (${error.code})` : ''
										} ${error.message}`
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
			const error = new Error('<TacoTranslate> `getTranslations` timeout.');

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
		let hasTimedOut = false;
		const timeoutInstance = setTimeout(() => {
			const error = new Error('<TacoTranslate> `getLocales` timeout.');

			if (throwOnError) {
				reject(error);
			} else {
				console.error(error);
				resolve([process.env.TACOTRANSLATE_DEFAULT_LOCALE]);
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
						resolve([process.env.TACOTRANSLATE_DEFAULT_LOCALE]);
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
	origin?: string;
	throwOnError?: boolean;
};

const createTacoTranslateClient = ({
	apiUrl = defaultApiUrl,
	apiKey,
	projectLocale,
	isEnabled = true,
}: CreateTacoTranslateClientParameters) => ({
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
	getLocales: async (options?: Pick<GetLocalesParameters, 'throwOnError'>) =>
		isEnabled ? getLocales({...options, apiUrl, apiKey}) : localeCodes,
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
