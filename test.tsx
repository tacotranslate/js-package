import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom';
import {act} from 'react-dom/test-utils';
import {
	type CreateTacoTranslateClientParameters,
	type TacoTranslateClientParameters,
	type Translations,
	TranslationProvider,
	useTacoTranslate,
	useTranslate,
	localeCodes,
} from '.';

const translations: Translations = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'some_text_id': 'Hello, there!',
	'Hello, world!': 'Hallo, verden!',
	'Hello, {{name}}!': 'Hallo, {{name}}!',
};

async function getTranslations(): Promise<Translations> {
	return translations;
}

const createClient =
	({
		projectLocale,
		isEnabled = true,
	}: Pick<
		CreateTacoTranslateClientParameters,
		'projectLocale' | 'isEnabled'
	>) =>
	({locale}: TacoTranslateClientParameters) => ({
		getTranslations: async () =>
			isEnabled && locale !== projectLocale ? getTranslations() : {},
		getLocales: async () => localeCodes,
	});

const client = createClient({projectLocale: 'en'});

const createErrorClient =
	({
		projectLocale,
		isEnabled = true,
	}: Pick<
		CreateTacoTranslateClientParameters,
		'projectLocale' | 'isEnabled'
	>) =>
	({locale}: TacoTranslateClientParameters) => ({
		async getTranslations() {
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

test('renders the context', () => {
	render(
		<TranslationProvider client={client} locale="no">
			<span>Hello, world!</span>
		</TranslationProvider>
	);
});

test('translations should be replaced', async () => {
	const textContent = 'Hello, world!';

	await act(() => {
		function Component() {
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate string={textContent} />
				</div>
			);
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(translations[textContent]);
});

test('should render html if useDangerouslySetInnerHTML is not set on the component nor context', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate string={textContent} />
				</div>
			);
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe('Hello, world! testing');
});

test('should not render html if useDangerouslySetInnerHTML is false on the component', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate string={textContent} useDangerouslySetInnerHTML={false} />
				</div>
			);
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe(textContent);
});

test('should not render html if useDangerouslySetInnerHTML is false on the context', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate string={textContent} />
				</div>
			);
		}

		return render(
			<TranslationProvider
				client={client}
				locale="no"
				useDangerouslySetInnerHTML={false}
			>
				<Component />
			</TranslationProvider>
		);
	});

	await waitFor(() => screen.getByRole('text'));
	expect(screen.getByRole('text').textContent).toBe(textContent);
});

test('should render html if useDangerouslySetInnerHTML is false on the context, but true on the component', async () => {
	const textContent = 'Hello, world! <b>testing</b>';

	await act(() => {
		function Component() {
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate useDangerouslySetInnerHTML string={textContent} />
				</div>
			);
		}

		return render(
			<TranslationProvider
				client={client}
				locale="no"
				useDangerouslySetInnerHTML={false}
			>
				<Component />
			</TranslationProvider>
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
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate string={textContent} variables={{name}} />
				</div>
			);
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(`Hello, ${name}!`);
});

test('ids should be supported', async () => {
	const textContent = 'Hello, there!';

	await act(() => {
		function Component() {
			const Translate = useTranslate();

			return (
				<div role="text">
					<Translate id="some_text_id" string={textContent} />
				</div>
			);
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	await waitFor(() => screen.getByRole('text'));

	expect(screen.getByRole('text').textContent).toBe(translations.some_text_id);
});

test('the locale should be set', async () => {
	let locale = '';

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			const {Translate} = tacoTranslate;

			locale = tacoTranslate.locale ?? '';

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	expect(locale).toBe('no');
});

test('left to right should be true when applicable', async () => {
	let isLeftToRight = false;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			const {Translate} = tacoTranslate;

			isLeftToRight = tacoTranslate.isLeftToRight ?? false;

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	expect(isLeftToRight).toBe(true);
});

test('right to left should be true when applicable', async () => {
	let isRightToLeft = false;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			const {Translate} = tacoTranslate;

			isRightToLeft = tacoTranslate.isRightToLeft ?? false;

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TranslationProvider client={client} locale="ar">
				<Component />
			</TranslationProvider>
		);
	});

	expect(isRightToLeft).toBe(true);
});

test('error should be set when encountered', async () => {
	let error: Error | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			const {Translate} = tacoTranslate;

			error = tacoTranslate.error;

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TranslationProvider client={errorClient} locale="ar">
				<Component />
			</TranslationProvider>
		);
	});

	expect(error).toBeInstanceOf(Error);
});

test('isLoading should be set when loading', async () => {
	let isLoading: boolean | undefined;

	await act(() => {
		function Component() {
			const tacoTranslate = useTacoTranslate();
			const {Translate} = tacoTranslate;

			if (isLoading !== true) {
				isLoading = tacoTranslate.isLoading;
			}

			return <Translate string="Hello, world!" />;
		}

		return render(
			<TranslationProvider client={client} locale="no">
				<Component />
			</TranslationProvider>
		);
	});

	expect(isLoading).toBe(true);
});
