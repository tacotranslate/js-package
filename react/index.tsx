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
	isRightToLeftLocaleCode,
	template,
	type TemplateVariables,
	type TacoTranslateClient,
	type Origin,
} from '..';

export type TranslationContextProperties = {
	client?: TacoTranslateClient;
	origin?: Origin;
	locale?: Locale;
	translations?: Translations;
	localizations?: Localizations;
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

export const useTacoTranslate = () => useContext(TacoTranslateContext);
export type TranslateOptions = {
	readonly id?: string;
	readonly variables?: TemplateVariables;
	readonly origin?: Origin;
	readonly locale?: Origin;
};

export type TranslateComponentProperties = HTMLAttributes<HTMLSpanElement> &
	TranslateOptions & {
		readonly as?: keyof HTMLElementTagNameMap;
		readonly string: string;
		// eslint-disable-next-line react/boolean-prop-naming
		readonly useDangerouslySetInnerHTML?: boolean;
	};

export function useTranslation(
	inputString: string,
	options?: TranslateOptions
) {
	const {
		id,
		variables,
		origin: originOption,
		locale: localeOption,
	} = options ?? {};

	const {client, localizations, translations, origin, locale, createEntry} =
		useTacoTranslate();

	if (
		process.env.NODE_ENV === 'development' ||
		process.env.NODE_ENV === 'test'
	) {
		if (typeof inputString !== 'string') {
			throw new TypeError('<TacoTranslate> `string` must be a string.');
		} else if (inputString.length > 1500) {
			throw new TypeError(
				`<TacoTranslate> \`string\` is too long at ${
					inputString.length
				}. Max length is 1500 characters. Please split the string across multiple <TacoTranslate> components/functions: \`${inputString.slice(
					0,
					100
				)}...\``
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
					`<TacoTranslate> \`id\` is too long at ${id.length}. Max length is 50 characters: \`${id}\``
				);
			} else if (!/^[a-z_][\w-]*$/i.test(id)) {
				throw new TypeError(
					`<TacoTranslate> \`id\` format is invalid. Must satisfy \`/^[a-z_][\\w-]*$/i\`: \`${id}\``
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

	const entry = useMemo(
		() => ({i: id, s: string, o: originOption, l: localeOption}),
		[id, string, originOption, localeOption]
	);

	const key = useMemo(() => getEntryKey(entry, client), [entry, client]);
	const selectedOrigin = originOption ?? origin;
	const selectedLocale = localeOption ?? locale;
	const translation = useMemo(
		() =>
			localizations && selectedOrigin && selectedLocale
				? localizations?.[selectedOrigin]?.[selectedLocale]?.[key]
				: translations?.[key],
		[localizations, selectedOrigin, selectedLocale, key, translations]
	);

	const output = useMemo(() => {
		const value = translation ?? patchDefaultString(string);

		if (variables) {
			return template(value, variables);
		}

		return value;
	}, [translation, string, variables]);

	useEffect(() => {
		if (!translation && createEntry) {
			createEntry(entry);
		}
	}, [translation, createEntry, entry]);

	return output;
}

export function Translate({
	id,
	string,
	variables,
	origin,
	locale,
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

	const output = useTranslation(string, {id, variables, origin, locale});
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

export const useLanguage = () => {
	const {language} = useTacoTranslate();
	return language;
};

type AnyObject = Record<string, unknown>;

function isObject(object: any): object is AnyObject {
	return Boolean(
		object && typeof object === 'object' && !Array.isArray(object)
	);
}

export function merge<Target extends AnyObject, Source extends AnyObject>(
	target: Target,
	source: Source
): Target & Source {
	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key]) {
				(target as AnyObject)[key] = {};
			}

			if (isObject(target[key])) {
				merge(target[key] as AnyObject, source[key] as AnyObject);
			} else {
				(target as AnyObject)[key] = source[key];
			}
		} else {
			(target as AnyObject)[key] = source[key];
		}
	}

	return target as Target & Source;
}

export function TacoTranslate(
	properties: TranslationContextProperties & {
		children: ReactNode;
	}
) {
	const {
		client: parentClient,
		origin: parentOrigin,
		locale: parentLocale,
		localizations: parentLocalizations,
		useDangerouslySetInnerHTML: parentUseDangerouslySetInnerHtml,
	} = useTacoTranslate();

	const {
		client = parentClient,
		origin,
		locale,
		translations: inputTranslations,
		localizations: inputLocalizations = parentLocalizations,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		useDangerouslySetInnerHTML = parentUseDangerouslySetInnerHtml ?? true,
		children,
	} = properties;

	const [isLoading, setIsLoading] = useState<boolean>();
	const [error, setError] = useState<Error>();
	const localeOrParentLocale = locale ?? parentLocale;
	const [currentLocale, setCurrentLocale] = useState(localeOrParentLocale);

	const currentLanguage: Language | undefined = useMemo(
		() => locales.find(([localeCode]) => localeCode === currentLocale)?.[1],
		[currentLocale]
	);

	const originOrParentOrigin = origin ?? parentOrigin;
	const [currentOrigin, setCurrentOrigin] = useState(() => {
		if (typeof window === 'undefined') {
			return originOrParentOrigin ?? '*';
		}

		return originOrParentOrigin ?? window.location.host;
	});

	if (origin) {
		if (origin !== currentOrigin) {
			setCurrentOrigin(origin);
		}
	} else if (!origin && parentOrigin) {
		if (currentOrigin !== parentOrigin) {
			setCurrentOrigin(parentOrigin);
		}
	} else if (typeof window !== 'undefined') {
		const currentHost = window.location.host;

		if (currentOrigin !== currentHost) {
			setCurrentOrigin(currentHost);
		}
	}

	useEffect(() => {
		if (
			(process.env.NODE_ENV === 'development' ||
				process.env.NODE_ENV === 'test') &&
			inputLocalizations &&
			currentOrigin &&
			currentLocale &&
			!inputLocalizations[currentOrigin]?.[currentLocale]
		) {
			console.warn(
				`<TacoTranslate> Missing initial translations for origin \`${currentOrigin}\` in locale \`${currentLocale}\`. Consider pre-fetching them on the server side. See https://tacotranslate.com/documentation/server-side-rendering.`
			);
		}
	}, [inputLocalizations, currentOrigin, currentLocale]);

	const [localizations, setLocalizations] = useState<Localizations>(
		() =>
			inputLocalizations ??
			(currentLocale
				? {[currentOrigin]: {[currentLocale]: inputTranslations ?? {}}}
				: {})
	);

	const [entries, setEntries] = useState<Entry[]>([]);
	const createEntry = useCallback((inputEntry: Entry) => {
		const {l, ...entry} = inputEntry;
		setEntries((previousEntries) => [...previousEntries, entry]);
	}, []);

	const isRightToLeft = useMemo(
		() => (currentLocale ? isRightToLeftLocaleCode(currentLocale) : undefined),
		[currentLocale]
	);

	const isLeftToRight = useMemo(() => !isRightToLeft, [isRightToLeft]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (entries.length > 0) {
				if (!isLoading && client && localeOrParentLocale) {
					setIsLoading(true);

					const entryGroups = [
						{
							origin: currentOrigin,
							locale: localeOrParentLocale,
							entries: [] as Entry[],
							keys: new Set<string>(),
						},
					];

					for (const entry of entries) {
						const entryKey = getEntryKey(entry);
						const entryOrigin = entry.o ?? currentOrigin;
						const entryLocale = entry.l ?? localeOrParentLocale;

						let entryGroup = entryGroups.find(
							(group) =>
								group.origin === entryOrigin && group.locale === entryLocale
						);

						if (!entryGroup) {
							const length = entryGroups.push({
								origin: entryOrigin,
								locale: entryLocale,
								entries: [],
								keys: new Set(),
							});

							entryGroup = entryGroups[length - 1];
						}

						if (!entryGroup.keys.has(entryKey)) {
							entryGroup.keys.add(entryKey);
							entryGroup.entries.push({i: entry.i, s: entry.s});
						}
					}

					setEntries((previousEntries) =>
						previousEntries.filter(
							(entry) =>
								!entryGroups.some(
									(group) =>
										(entry.o ?? currentOrigin) === group.origin &&
										(entry.l ?? localeOrParentLocale) === group.locale &&
										group.keys.has(getEntryKey(entry))
								)
						)
					);

					const promises: Array<Promise<void>> = [];
					const results: Localizations = {};

					for (const group of entryGroups) {
						promises.push(
							client
								.getTranslations({
									origin: group.origin,
									locale: group.locale,
									entries: group.entries,
									throwOnError: true,
								})
								.then((response) => {
									merge(results, {
										[group.origin]: {
											[group.locale]: response,
										},
									});
								})
						);
					}

					Promise.all(promises)
						.then(() => {
							setLocalizations((previousLocalizations) => {
								const updatedLocalizations = merge(
									merge({}, previousLocalizations),
									results
								);

								return updatedLocalizations;
							});

							setCurrentLocale(localeOrParentLocale);
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
			} else if (currentLocale !== localeOrParentLocale) {
				setCurrentLocale(localeOrParentLocale);
			}
		}
	}, [
		client,
		currentOrigin,
		entries,
		isLoading,
		currentLocale,
		localeOrParentLocale,
	]);

	const patchedLocalizations = useMemo(() => {
		if (originOrParentOrigin && localeOrParentLocale) {
			let result = merge({}, localizations);

			if (inputLocalizations) {
				result = merge(result, inputLocalizations);
			}

			if (inputTranslations) {
				result = merge(result, {
					[originOrParentOrigin]: {
						[localeOrParentLocale]: inputTranslations,
					},
				});
			}

			return result;
		}

		return localizations;
	}, [
		originOrParentOrigin,
		localeOrParentLocale,
		localizations,
		inputTranslations,
		inputLocalizations,
	]);

	const translations = useMemo(
		() =>
			currentLocale
				? patchedLocalizations?.[currentOrigin]?.[currentLocale] ?? {}
				: {},
		[patchedLocalizations, currentOrigin, currentLocale]
	);

	const value = useMemo(
		() => ({
			client,
			origin: currentOrigin,
			locale: currentLocale,
			language: currentLanguage,
			isLoading,
			isLeftToRight,
			isRightToLeft,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			useDangerouslySetInnerHTML,
			entries,
			translations,
			localizations: patchedLocalizations,
			createEntry,
			error,
		}),
		[
			client,
			currentOrigin,
			currentLocale,
			currentLanguage,
			isLoading,
			isLeftToRight,
			isRightToLeft,
			useDangerouslySetInnerHTML,
			entries,
			translations,
			patchedLocalizations,
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

export default TacoTranslate;
