import http from 'node:http';
import React, {useEffect, useState} from 'react';
import {render, screen, waitFor} from '@testing-library/react';
// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom';
import {act} from 'react-dom/test-utils';
import createTacoTranslateClient, {
	type CreateTacoTranslateClientParameters,
	type Translations,
	localeCodes,
	type ClientGetTranslationsParameters,
	type Entry,
	type ClientGetLocalizationsParameters,
	type Localizations,
	type Origin,
} from '..';
import {
	TacoTranslate,
	useTacoTranslate,
	useTranslation,
	Translate,
	merge,
} from '.';

const translations: Translations = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'some_text_id': 'Hello, there!',
	'Hello, world!': 'Hallo, verden!',
	'Hello, [[[{{name}}]]]!': 'Hallo, {{name}}!',
};

async function getTranslations(): Promise<Translations> {
	return translations;
}

async function getLocalizations(): Promise<Localizations> {
	return {};
}

const createClient = ({
	projectLocale,
	isEnabled = true,
}: Pick<
	CreateTacoTranslateClientParameters,
	'projectLocale' | 'isEnabled'
>) => ({
	origins: [] as Origin[],
	entries: [] as Entry[],
	getTranslations: async ({locale}: ClientGetTranslationsParameters) =>
		isEnabled && locale !== projectLocale ? getTranslations() : {},
	getLocalizations: async ({locale}: ClientGetLocalizationsParameters) =>
		isEnabled && locale !== projectLocale ? getLocalizations() : {},
	getLocales: async () => localeCodes,
});

const client = createClient({projectLocale: 'en'});

const createErrorClient = ({
	projectLocale,
	isEnabled = true,
}: Pick<
	CreateTacoTranslateClientParameters,
	'projectLocale' | 'isEnabled'
>) => ({
	origins: [] as Origin[],
	entries: [] as Entry[],
	async getTranslations({locale}: ClientGetTranslationsParameters) {
		if (isEnabled && locale !== projectLocale) {
			throw new Error('Some error');
		}

		return {};
	},
	async getLocalizations({locale}: ClientGetLocalizationsParameters) {
		if (isEnabled && locale !== projectLocale) {
			throw new Error('Some error');
		}

		return {};
	},
	async getLocales() {
		if (isEnabled) {
			throw new Error('Some error');
		}

		return [];
	},
});

const errorClient = createErrorClient({projectLocale: 'en'});

test('merge two objects', () => {
	expect(merge({foo: '1'}, {bar: '2'})).toStrictEqual({foo: '1', bar: '2'});
});

test('deep merge two objects', () => {
	expect(
		merge(
			{foo: {no: '1'}, bar: {no: {test: '2'}}},
			{foo: {en: '2'}, bar: {no: {test: '3'}}}
		)
	).toStrictEqual({foo: {no: '1', en: '2'}, bar: {no: {test: '3'}}});
});

test('renders the context', () => {
	render(
		<TacoTranslate client={client} locale="no">
			<span>Hello, world!</span>
		</TacoTranslate>
	);
});

test('missing translations should be fetched', async () => {
	const fetchedEntries: Entry[] = [];

	await act(async () => {
		const createClient = () => ({
			origins: [] as Origin[],
			entries: [] as Entry[],
			async getTranslations({entries}: ClientGetTranslationsParameters) {
				if (entries) {
					fetchedEntries.push(...entries);
				}

				return {};
			},
			async getLocalizations() {
				return {};
			},
			getLocales: async () => localeCodes,
		});

		const client = createClient();

		function Component() {
			return (
				<div role="text">
					<Translate string="Hello!" />
					<Translate string="Another string." />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(JSON.stringify(fetchedEntries)).toBe(
		'[{"s":"Hello!"},{"s":"Another string."}]'
	);
});

test('present translations should not be fetched', async () => {
	const fetchedEntries: Entry[] = [];

	await act(async () => {
		const createClient = () => ({
			origins: [] as Origin[],
			entries: [] as Entry[],
			async getTranslations({entries}: ClientGetTranslationsParameters) {
				if (entries) {
					fetchedEntries.push(...entries);
				}

				return {};
			},
			async getLocalizations() {
				return {};
			},
			getLocales: async () => localeCodes,
		});

		const client = createClient();

		function Component() {
			return (
				<div role="text">
					<Translate string="Hello, world!" />
					<Translate string="Another string." />
				</div>
			);
		}

		return render(
			<TacoTranslate
				client={client}
				locale="no"
				translations={{'Hello, world!': 'Hallo, verden!'}}
			>
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(JSON.stringify(fetchedEntries)).toBe('[{"s":"Another string."}]');
});

test('get translations using a custom translation key', async () => {
	const fetchedEntries: Entry[] = [];

	await act(async () => {
		const createClient = () => ({
			origins: [] as Origin[],
			entries: [] as Entry[],
			async getTranslations({entries}: ClientGetTranslationsParameters) {
				if (entries) {
					fetchedEntries.push(...entries);
				}

				return {};
			},
			async getLocalizations() {
				return {};
			},
			getTranslationKey: (entry: Entry) => entry.i ?? 'hello',
			getLocales: async () => localeCodes,
		});

		const client = createClient();

		function Component() {
			return (
				<div role="text">
					<Translate id="hello1" string="Hello, world!" />
				</div>
			);
		}

		return render(
			<TacoTranslate
				client={client}
				locale="no"
				translations={{hello1: 'Hallo, verden!'}}
			>
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe('Hallo, verden!');
});

test('translations should be replaced', async () => {
	const textContent = 'Hello, world!';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(translations[textContent]);
});

test('string translations should be replaced', async () => {
	const textContent = 'Hello, world!';

	await act(() => {
		function Component() {
			return <div role="text">{useTranslation(textContent)}</div>;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(translations[textContent]);
});

test('strings should be cleaned before rendered', async () => {
	const textContent = `
		<p>Hello,      {{name}}!
	
</p>		`;

	const name = 'Pedro';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} variables={{name}} />
				</div>
			);
		}

		return render(
			<TacoTranslate locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').innerHTML).toBe(
		`<span><p>Hello, ${name}! </p></span>`
	);
});

test('string translations with variables should be replaced', async () => {
	const textContent = 'Hello, {{name}}!';
	const name = 'Pedro';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					{useTranslation(textContent, {variables: {name}})}
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(`Hallo, ${name}!`);
});

test('string translations with variables should be replaced when translations injected', async () => {
	const textContent = 'Hello, {{name}}!';
	const name = 'Pedro';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					{useTranslation(textContent, {variables: {name}})}
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(`Hallo, ${name}!`);
});

test('should render html if useDangerouslySetInnerHTML is not set on the component nor context', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe('Hello, world! testing');
});

test('should not render html if useDangerouslySetInnerHTML is false on the component', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} useDangerouslySetInnerHTML={false} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe(textContent);
});

test('should not render html if useDangerouslySetInnerHTML is false on the context', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} />
				</div>
			);
		}

		return render(
			<TacoTranslate
				client={client}
				locale="no"
				useDangerouslySetInnerHTML={false}
			>
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe(textContent);
});

test('should render html if useDangerouslySetInnerHTML is false on the context, but true on the component', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate useDangerouslySetInnerHTML string={textContent} />
				</div>
			);
		}

		return render(
			<TacoTranslate
				client={client}
				locale="no"
				useDangerouslySetInnerHTML={false}
			>
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe('Hello, world! testing');
});

test('variables should be replaced', async () => {
	const textContent = 'Hello, {{name}}!';
	const name = 'Pedro';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} variables={{name}} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(`Hallo, ${name}!`);
});

test('variables should be replaced when translations are injected', async () => {
	const textContent = 'Hello, {{name}}!';
	const name = 'Pedro';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} variables={{name}} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(`Hallo, ${name}!`);
});

test('unmatched variables should be removed', async () => {
	const textContent = 'Hello, {{name}}!';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string={textContent} variables={{something: 'test'}} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe('Hallo, !');
});

test('ids should be supported', async () => {
	const textContent = 'Hello, there!';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate id="some_text_id" string={textContent} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(translations.some_text_id);
});

test('id with capital letters should be supported', async () => {
	const textContent = 'Hello, there!';

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate id="SOME_TEST_ID" string={textContent} />
				</div>
			);
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(translations.some_text_id);
});

test('invalid ids should throw', () => {
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	expect(() =>
		act(() => {
			function Component() {
				return <Translate id="-" string="Hello, world!" />;
			}

			return render(
				<TacoTranslate client={client} locale="no">
					<Component />
				</TacoTranslate>
			);
		})
	).toThrow('`id` format is invalid');
});

test('the locale should be set', async () => {
	let locale = '';

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			locale = tacoTranslate.locale ?? '';

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	expect(locale).toBe('no');
});

test('the langauge should be set', async () => {
	let language = '';

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			language = tacoTranslate.language ?? '';

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	expect(language).toBe('Norwegian (Bokmål)');
});

test('left to right should be true when applicable', async () => {
	let isLeftToRight = false;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			isLeftToRight = tacoTranslate.isLeftToRight ?? false;

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	expect(isLeftToRight).toBe(true);
});

test('right to left should be true when applicable', async () => {
	let isRightToLeft = false;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			isRightToLeft = tacoTranslate.isRightToLeft ?? false;

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="ar">
				<Component />
			</TacoTranslate>
		);
	});

	expect(isRightToLeft).toBe(true);
});

test('error should be set when encountered', async () => {
	let error: Error | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			error = tacoTranslate.error;

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={errorClient} locale="ar">
				<Component />
			</TacoTranslate>
		);
	});

	expect(error).toBeInstanceOf(Error);
});

test('isLoading should be set when loading', async () => {
	let isLoading: boolean | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();

			if (isLoading !== true) {
				isLoading = tacoTranslate.isLoading;
			}

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	expect(isLoading).toBe(true);
});

test('get origin from child component', async () => {
	let origin: string | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			origin = tacoTranslate.origin;
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} origin="test" locale="no">
				<Component />
			</TacoTranslate>
		);
	});

	expect(origin).toBe('test');
});

test('allow multiple TacoTranslates', async () => {
	let origin: string | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			origin = tacoTranslate.origin;
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} origin="test" locale="no">
				<TacoTranslate origin="override">
					<Component />
				</TacoTranslate>
			</TacoTranslate>
		);
	});

	expect(origin).toBe('override');
});

test('allow multiple TacoTranslates, and get locale from parent', async () => {
	let locale: string | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			locale = tacoTranslate.locale;
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<TacoTranslate>
					<Component />
				</TacoTranslate>
			</TacoTranslate>
		);
	});

	expect(locale).toBe('no');
});

test('allow multiple TacoTranslates, and override locale', async () => {
	let locale: string | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			locale = tacoTranslate.locale;
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} locale="no">
				<TacoTranslate locale="es">
					<Component />
				</TacoTranslate>
			</TacoTranslate>
		);
	});

	expect(locale).toBe('es');
});

test('allow multiple TacoTranslates, and override locale, but get origin from parent', async () => {
	let origin: string | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			origin = tacoTranslate.origin;
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} origin="test" locale="no">
				<TacoTranslate locale="es">
					<Component />
				</TacoTranslate>
			</TacoTranslate>
		);
	});

	expect(origin).toBe('test');
});

test('allow multiple TacoTranslates, and let child locale update when parent locale updates', async () => {
	const results: string[] = [];

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();

			if (tacoTranslate.locale) {
				results.push(tacoTranslate.locale);
			}

			return <Translate string="Hello, world!" />;
		}

		function Page() {
			const [locale, setLocale] = useState('en');

			useEffect(() => {
				setLocale('no');
			}, []);

			return (
				<TacoTranslate client={client} origin="test" locale={locale}>
					<TacoTranslate origin="foo">
						<Component />
					</TacoTranslate>
				</TacoTranslate>
			);
		}

		return render(<Page />);
	});

	expect(results.includes('en')).toBe(true);
	expect(results.includes('no')).toBe(true);
});

test('allow multiple TacoTranslates, and let child origin update when parent origin updates', async () => {
	const results: string[] = [];

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();

			if (tacoTranslate.origin) {
				results.push(tacoTranslate.origin);
			}

			return <Translate string="Hello, world!" />;
		}

		function Page() {
			const [origin, setOrigin] = useState('test');

			useEffect(() => {
				setOrigin('foo');
			}, []);

			return (
				<TacoTranslate client={client} origin={origin} locale="en">
					<TacoTranslate locale="no">
						<Component />
					</TacoTranslate>
				</TacoTranslate>
			);
		}

		return render(<Page />);
	});

	expect(results.includes('test')).toBe(true);
	expect(results.includes('foo')).toBe(true);
});

test('get translations from the localization object', async () => {
	const localizations = {test: {es: {input: 'output'}}};
	let results: string | undefined;

	await act(() => {
		function Component() {
			results = useTranslation('input');
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="test"
				locale="es"
			>
				<Component />
			</TacoTranslate>
		);
	});

	expect(results).toBe('output');
});

test('get translations from the translations object', async () => {
	const translations = {input: 'output'};
	let results: string | undefined;

	await act(() => {
		function Component() {
			results = useTranslation('input');
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate
				client={client}
				translations={translations}
				origin="test"
				locale="es"
			>
				<Component />
			</TacoTranslate>
		);
	});

	expect(results).toBe('output');
});

test('get translations from the parent localization object inside a child provider', async () => {
	const localizations = {bar: {es: {input: 'output'}}};
	let results: string | undefined;

	await act(() => {
		function Component() {
			results = useTranslation('input');
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="foo"
				locale="no"
			>
				<TacoTranslate origin="bar" locale="es">
					<Component />
				</TacoTranslate>
			</TacoTranslate>
		);
	});

	expect(results).toBe('output');
});

test('get translations from the parent localization object inside multiple child providers', async () => {
	const localizations = {
		bar: {es: {input: '1'}},
		baz: {en: {input: '2'}},
		foo: {sv: {input: '3'}},
	};

	const results: string[] = [];

	await act(() => {
		function Component() {
			results.push(useTranslation('input'));
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="foo"
				locale="no"
			>
				<TacoTranslate origin="baz" locale="en">
					<Component />

					<TacoTranslate origin="bar" locale="es">
						<Component />
					</TacoTranslate>
				</TacoTranslate>

				<TacoTranslate locale="sv">
					<Component />
				</TacoTranslate>
			</TacoTranslate>
		);
	});

	expect(results.includes('1')).toBe(true);
	expect(results.includes('2')).toBe(true);
	expect(results.includes('3')).toBe(true);
});

test('allow adding new localizations during runtime', async () => {
	const results: string[] = [];

	await act(async () => {
		function Component() {
			results.push(useTranslation('input'));
			return <Translate string="Hello, world!" />;
		}

		function Page() {
			const [state, setState] = useState(0);
			const [localizations, setLocalizations] = useState<Localizations>({
				bar: {es: {input: '2'}},
				baz: {en: {input: '1'}},
			});

			useEffect(() => {
				if (state === 0) {
					setState(1);
					setLocalizations({
						foo: {sv: {input: '5'}},
						bar: {es: {input: '4'}},
						baz: {en: {input: '3'}},
					});
				}
			}, [state]);

			useEffect(() => {
				if (state === 1) {
					setLocalizations({
						foo: {sv: {input: '8'}},
						bar: {es: {input: '7'}},
						baz: {en: {input: '6'}},
					});
				}
			}, [state]);

			return (
				<TacoTranslate
					client={client}
					localizations={localizations}
					origin="foo"
					locale="no"
				>
					<TacoTranslate origin="baz" locale="en">
						<Component />

						<TacoTranslate origin="bar" locale="es">
							<Component />
						</TacoTranslate>
					</TacoTranslate>

					<TacoTranslate locale="sv">
						<Component />
					</TacoTranslate>
				</TacoTranslate>
			);
		}

		return render(<Page />);
	});

	expect(JSON.stringify(results)).toBe(
		'["1","2","input","3","4","5","6","7","8","6","7","8"]'
	);
});

test('get updated localization during first render', async () => {
	const results: string[] = [];

	await act(async () => {
		function Component() {
			results.push(useTranslation('input'));
			return null;
		}

		function Page() {
			const [localizations, setLocalizations] = useState<Localizations>({
				foo: {es: {input: '1'}},
			});

			useEffect(() => {
				setLocalizations({
					foo: {es: {input: '2'}},
				});
			}, []);

			return (
				<TacoTranslate
					client={client}
					localizations={localizations}
					origin="foo"
					locale="es"
				>
					<Component />
				</TacoTranslate>
			);
		}

		return render(<Page />);
	});

	expect(JSON.stringify(results)).toBe('["1","2"]');
});

test('get updated localization during first render in a child provider', async () => {
	const results: string[] = [];

	await act(async () => {
		function Component() {
			results.push(useTranslation('input'));
			return null;
		}

		function Page() {
			const [localizations, setLocalizations] = useState<Localizations>({
				bar: {es: {input: '1'}},
			});

			useEffect(() => {
				setLocalizations({
					bar: {es: {input: '2'}},
				});
			}, []);

			return (
				<TacoTranslate
					client={client}
					localizations={localizations}
					origin="foo"
					locale="es"
				>
					<TacoTranslate origin="bar">
						<Component />
					</TacoTranslate>
				</TacoTranslate>
			);
		}

		return render(<Page />);
	});

	expect(JSON.stringify(results)).toBe('["1","2"]');
});

test('get updated localization during first render in multiple child providers', async () => {
	const results: string[] = [];

	await act(async () => {
		function Component() {
			results.push(useTranslation('input'));
			return null;
		}

		function Page() {
			const [localizations, setLocalizations] = useState<Localizations>({
				bar: {es: {input: '1'}},
			});

			useEffect(() => {
				setLocalizations({
					bar: {es: {input: '2'}},
				});
			}, []);

			return (
				<TacoTranslate
					client={client}
					localizations={localizations}
					origin="foo"
					locale="es"
				>
					<TacoTranslate origin="baz">
						<TacoTranslate origin="bar">
							<Component />
						</TacoTranslate>
					</TacoTranslate>
				</TacoTranslate>
			);
		}

		return render(<Page />);
	});

	expect(JSON.stringify(results)).toBe('["1","2"]');
});

test('allow overriding origin on the hook level', async () => {
	const localizations = {
		foo: {en: {input: '1'}},
		bar: {en: {input: '2'}},
	};

	const results: string[] = [];

	await act(() => {
		function Component() {
			results.push(useTranslation('input', {origin: 'bar'}));
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="foo"
				locale="en"
			>
				<Component />
			</TacoTranslate>
		);
	});

	expect(results.includes('1')).toBe(false);
	expect(results.includes('2')).toBe(true);
});

test('allow overriding origin on the hook level, and fetch translations for the origin', async () => {
	const requests: Array<string | undefined> = [];
	const instance = http.createServer((request, response) => {
		requests.push(request.url);
		response.writeHead(200, {'content-type': 'application/json'});
		response.end(JSON.stringify({success: true, translations}));
	});

	const port: number = await new Promise((resolve, reject) => {
		const server = instance.listen(0, () => {
			const address = server.address();

			if (address && typeof address === 'object') {
				resolve(address.port);
			}

			reject(new Error('Missing port'));
		});
	});

	const client = createTacoTranslateClient({
		apiUrl: `http://localhost:${port}`,
		apiKey: 'test',
	});

	const results: string[] = [];

	await act(async () => {
		function Component() {
			results.push(useTranslation('input', {origin: 'bar'}));
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} origin="foo" locale="en">
				<Component />
			</TacoTranslate>
		);
	});

	await act(async () => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (requests.length > 0) {
					resolve();
					clearInterval(interval);
				}
			}, 200);
		});
	});

	expect(requests.some((request) => request?.includes('&o=bar'))).toBe(true);
});

test('allow overriding origin on the component level', async () => {
	const localizations = {
		foo: {en: {input: '1'}},
		bar: {en: {input: '2'}},
	};

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string="input" origin="bar" />
				</div>
			);
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="foo"
				locale="en"
			>
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe('2');
});

test('allow overriding locale on the hook level', async () => {
	const localizations = {
		foo: {en: {input: '1'}, no: {input: '2'}},
	};

	const results: string[] = [];

	await act(() => {
		function Component() {
			results.push(useTranslation('input', {locale: 'no'}));
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="foo"
				locale="en"
			>
				<Component />
			</TacoTranslate>
		);
	});

	expect(results.includes('1')).toBe(false);
	expect(results.includes('2')).toBe(true);
});

test('allow overriding locale on the hook level, and fetch translations for the locale', async () => {
	const requests: Array<string | undefined> = [];
	const instance = http.createServer((request, response) => {
		requests.push(request.url);
		response.writeHead(200, {'content-type': 'application/json'});
		response.end(JSON.stringify({success: true, translations}));
	});

	const port: number = await new Promise((resolve, reject) => {
		const server = instance.listen(0, () => {
			const address = server.address();

			if (address && typeof address === 'object') {
				resolve(address.port);
			}

			reject(new Error('Missing port'));
		});
	});

	const client = createTacoTranslateClient({
		apiUrl: `http://localhost:${port}`,
		apiKey: 'test',
	});

	const results: string[] = [];

	await act(async () => {
		function Component() {
			results.push(useTranslation('input', {locale: 'no'}));
			return <Translate string="Hello, world!" />;
		}

		return render(
			<TacoTranslate client={client} origin="foo" locale="en">
				<Component />
			</TacoTranslate>
		);
	});

	await act(async () => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (requests.length > 0) {
					resolve();
					clearInterval(interval);
				}
			}, 200);
		});
	});

	expect(requests.some((request) => request?.includes('&l=no'))).toBe(true);
});

test('allow overriding locale on the component level', async () => {
	const localizations = {
		foo: {en: {input: '1'}, no: {input: '2'}},
	};

	await act(() => {
		function Component() {
			return (
				<div role="text">
					<Translate string="input" locale="no" />
				</div>
			);
		}

		return render(
			<TacoTranslate
				client={client}
				localizations={localizations}
				origin="foo"
				locale="en"
			>
				<Component />
			</TacoTranslate>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe('2');
});
