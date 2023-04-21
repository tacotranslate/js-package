import {
	type ClientGetTranslationsParameters,
	type CreateTacoTranslateClientParameters,
	type Translations,
	createEntry,
	getEntryFromTranslations,
	localeCodes,
	patchDefaultString,
	template,
	translateEntries,
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

const createClient = ({
	projectLocale,
	isEnabled = true,
}: Pick<
	CreateTacoTranslateClientParameters,
	'projectLocale' | 'isEnabled'
>) => ({
	getTranslations: async ({locale}: ClientGetTranslationsParameters) =>
		isEnabled && locale !== projectLocale ? getTranslations() : {},
	getLocales: async () => localeCodes,
});

test('template strings should be replaced', () => {
	expect(template('Hello, {{name}}!', {name: 'Pedro'})).toBe('Hello, Pedro!');
});

test('default strings should be patched', () => {
	expect(patchDefaultString('Hello, [[[Pedro]]]!')).toBe('Hello, Pedro!');
});

test('get entry from translation by string', () => {
	const translations = {'Hello, [[[Pablo]]]!': 'Hallo, Pablo!'};
	const entry = createEntry({string: 'Hello, [[[Pablo]]]!'});
	expect(getEntryFromTranslations(entry, translations)).toBe('Hallo, Pablo!');
});

test('get entry from missing translation', () => {
	const translations = {};
	const entry = createEntry({string: 'Hello, [[[Pablo]]]!'});
	expect(getEntryFromTranslations(entry, translations)).toBe('Hello, Pablo!');
});

test('get translations from translateEntries', async () => {
	const translationKey = 'Hello, world!';
	const client = createClient({projectLocale: 'en'});
	const text = createEntry({string: translations[translationKey]});
	const t = await translateEntries(client, {origin: '*', locale: 'es'}, [text]);

	expect(t(text)).toEqual(translations[translationKey]);
});

test('get missing translation from translateEntries', async () => {
	const client = createClient({projectLocale: 'en'});
	const text = createEntry({string: 'missing'});
	const t = await translateEntries(client, {origin: '*', locale: 'es'}, [text]);

	expect(t(text)).toEqual('missing');
});

test('get translations from translateEntries with variables', async () => {
	const translationKey = 'Hello, {{name}}!';
	const client = createClient({projectLocale: 'en'});
	const text = createEntry({string: translations[translationKey]});
	const t = await translateEntries(client, {origin: '*', locale: 'es'}, [text]);

	expect(t(text, {name: 'Pablo'})).toEqual('Hallo, Pablo!');
});

test('get missing translation from translateEntries with variables', async () => {
	const client = createClient({projectLocale: 'en'});
	const text = createEntry({string: 'missing {{name}}'});
	const t = await translateEntries(client, {origin: '*', locale: 'es'}, [text]);

	expect(t(text, {name: 'Pablo'})).toEqual('missing Pablo');
});
