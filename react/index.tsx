'use client';

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
import sanitize from 'sanitize-html';
import {
	type Entry,
	type Language,
	type Locale,
	type Localizations,
	type Translations,
	getEntryKey,
	locales,
	patchDefaultString,
	rightToLeftLocaleCodes,
	template,
	type TemplateVariables,
} from '..';
import type createTacoTranslateClient from '..';

export type TranslationContextProperties = {
	origin?: string;
	client?: ReturnType<typeof createTacoTranslateClient>;
	locale?: Locale;
	translations?: Translations;
	useDangerouslySetInnerHTML?: boolean;
};

export type TacoTranslateContextProperties = TranslationContextProperties & {
	language?: Language;
	isLoading?: boolean;
	isLeftToRight?: boolean;
	isRightToLeft?: boolean;
	entries: Entry[];
	createEntry: (entry: Entry) => void;
	error?: Error;
};

const initialContext: TacoTranslateContextProperties = {
	entries: [],
	createEntry: () => undefined,
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

export type TranslateOptions = {
	id?: string;
	variables?: TemplateVariables;
};

export type TranslateComponentProperties = HTMLAttributes<HTMLSpanElement> &
	TranslateOptions & {
		as?: keyof HTMLElementTagNameMap;
		string: string;
		// eslint-disable-next-line react/boolean-prop-naming
		useDangerouslySetInnerHTML?: boolean;
	};

export function useTranslation(
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
			} else if (!/^[a-zA-Z_][a-z\d\-_]*$/.test(id)) {
				throw new TypeError(
					`<TacoTranslate> \`id\` format is invalid. Must satisfy \`[a-zA-Z_][a-z0-9\\-_]*\`.`
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

export function Translate({
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

	const output = useTranslation(string, {id, variables});
	const sanitized = useMemo(
		() => (useDangerouslySetInnerHtml ? sanitize(output) : output),
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
	const currentLanguage: Language | undefined = useMemo(
		() => locales.find(([localeCode]) => localeCode === currentLocale)?.[1],
		[currentLocale]
	);

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

					client
						.getTranslations({
							locale,
							entries: currentEntries,
							origin: currentOrigin,
						})
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
			locale: currentLocale,
			language: currentLanguage,
			isLoading,
			isLeftToRight,
			isRightToLeft,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			useDangerouslySetInnerHTML,
			entries,
			translations,
			createEntry,
			error,
		}),
		[
			client,
			currentLocale,
			currentLanguage,
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
