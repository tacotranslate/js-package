import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

type TacoTranslateError = Error & {code?: string; type?: string};
export type Entry = {k: string; s: string};
export type Translations = Record<string, string>;

const defaultApiUrl =
	process.env.TACOTRANSLATE_API_URL ?? 'https://api.tacotranslate.com';

async function getTranslations({
	apiUrl = defaultApiUrl,
	apiKey,
	inputLocale,
	outputLocale,
	entries,
	url: translationUrl,
}: {
	apiUrl: string;
	apiKey: string;
	inputLocale: string;
	outputLocale: string;
	entries?: Entry[];
	url?: string;
}): Promise<Translations> {
	let url = `${apiUrl}/api/t?a=${apiKey}&i=${inputLocale}&o=${outputLocale}`;

	if (entries) {
		const preparedEntries = entries
			.filter(
				(entry, index, self) =>
					index === self.findIndex((thing) => thing.k === entry.k)
			)
			.map((entry) => ({k: entry.k, s: entry.s}));

		url += `&s=${encodeURIComponent(JSON.stringify(preparedEntries))}`;
	}

	if (translationUrl) {
		url += `&u=${encodeURIComponent(translationUrl)}`;
	}

	return fetch(url)
		.then(async (response) => response.json())
		.then((data) => {
			if (data.success) {
				return data.translations as Translations;
			}

			const error: TacoTranslateError = new Error(data.error.message);
			error.code = data.error.code as string;
			error.type = data.error.type as string;
			throw error;
		});
}

export type CreateTacoTranslateClientParameters = {
	apiUrl?: string;
	apiKey: string;
};

type TacoTranslateClientParameters = {
	inputLocale: string;
	outputLocale: string;
};

export type GetTranslationsParameters = {entries?: Entry[]; url?: string};

export default function translate({
	apiUrl = defaultApiUrl,
	apiKey,
}: CreateTacoTranslateClientParameters) {
	return ({inputLocale, outputLocale}: TacoTranslateClientParameters) => ({
		getTranslations: async ({entries, url}: GetTranslationsParameters) =>
			getTranslations({
				apiUrl,
				apiKey,
				inputLocale,
				outputLocale,
				entries,
				url,
			}),
	});
}

export type TranslateProperties = {
	id?: string;
	string: string;
};

export type TranslationContextProperties = {
	url?: string;
	client?: ReturnType<typeof translate>;
	inputLocale?: string;
	outputLocale?: string;
	entries?: Entry[];
	translations?: Translations;
	Translate?: (properties: TranslateProperties) => JSX.Element;
};

const TranslationContext = createContext<TranslationContextProperties>({});
const {Provider, Consumer: TranslationConsumer} = TranslationContext;
export {TranslationContext, TranslationConsumer};

function getPatchedTranslationsObject(
	localePair: string,
	translations: Translations
) {
	const patchedTranslations: Translations = {};

	for (const [key, value] of Object.entries(translations)) {
		patchedTranslations[`${localePair}:${key}`] = value;
	}

	return patchedTranslations;
}

export const TranslationProvider = (
	properties: TranslationContextProperties & {
		children: ReactNode;
	}
) => {
	const {
		url,
		client,
		inputLocale,
		outputLocale,
		translations: inputTranslations,
		children,
	} = properties;

	const localePair = useMemo(
		() => `${inputLocale ?? ''}-${outputLocale ?? ''}`,
		[inputLocale, outputLocale]
	);

	const [currentLocalePair, setCurrentLocalePair] = useState(localePair);
	const [entries, setEntries] = useState<Entry[]>([]);
	const [translations, setTranslations] = useState<Translations>(() => {
		if (inputTranslations) {
			return getPatchedTranslationsObject(localePair, inputTranslations);
		}

		return {};
	});

	const Translate = useCallback(
		({id, string}: TranslateProperties) => {
			if (typeof string !== 'string') {
				throw new TypeError('<Translate> `string` must be a string');
			}

			const currentString = useMemo(() => string.trim(), [string]);
			const key = useMemo(() => (id ? id : currentString), [id, currentString]);

			const entry: Entry = useMemo(
				() => ({
					k: key,
					s: currentString,
					localePair,
				}),
				[key, currentString, localePair]
			);

			const currentTranslation = translations[`${localePair}:${key}`];
			const oldTranslation = translations[`${currentLocalePair}:${key}`];

			useEffect(() => {
				if (!currentTranslation) {
					setEntries((previousEntries) => {
						previousEntries.push(entry);
						return previousEntries;
					});
				}
			}, [entry]);

			const output = currentTranslation || oldTranslation || string;
			return <span dangerouslySetInnerHTML={{__html: output}} />;
		},
		[translations, localePair, currentLocalePair]
	);

	useEffect(() => {
		if (!client || !inputLocale || !outputLocale || !localePair) {
			return;
		}

		if (typeof window !== 'undefined' && entries.length > 0) {
			const currentUrl = url ?? window.location.host + window.location.pathname;
			const {getTranslations} = client({inputLocale, outputLocale});

			getTranslations({entries, url: currentUrl})
				.then((translations) => {
					const patchedTranslations = getPatchedTranslationsObject(
						localePair,
						translations
					);

					setTranslations((previousTranslations) => ({
						...previousTranslations,
						...patchedTranslations,
					}));

					setCurrentLocalePair(localePair);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [entries, client, inputLocale, outputLocale, localePair]);

	const value = useMemo(
		() => ({
			client,
			inputLocale,
			outputLocale,
			entries,
			translations,
			Translate,
		}),
		[client, inputLocale, outputLocale, entries, translations, Translate]
	);

	return <Provider value={value}>{children}</Provider>;
};

export const useTranslate = () => {
	const {Translate} = useContext(TranslationContext);
	return Translate;
};

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
	['zh-TW', 'Chinese (Traditional)'],
	['hr', 'Croatian'],
	['cs', 'Czech'],
	['da', 'Danish'],
	['fa-AF', 'Dari'],
	['nl', 'Dutch'],
	['en', 'English'],
	['et', 'Estonian'],
	['fa', 'Farsi (Persian)'],
	['tl', 'Filipino, Tagalog'],
	['fi', 'Finnish'],
	['fr', 'French'],
	['fr-CA', 'French (Canada)'],
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
	['pt-PT', 'Portuguese (Portugal)'],
	['pa', 'Punjabi'],
	['ro', 'Romanian'],
	['ru', 'Russian'],
	['sr', 'Serbian'],
	['si', 'Sinhala'],
	['sk', 'Slovak'],
	['sl', 'Slovenian'],
	['so', 'Somali'],
	['es', 'Spanish'],
	['es-MX', 'Spanish (Mexico)'],
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
