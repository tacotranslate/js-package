import http from 'node:http';
import createTacoTranslateClient, {
	type ClientGetLocalizationsParameters,
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

async function getLocalizations() {
	return {};
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
	getLocalizations: async ({locale}: ClientGetLocalizationsParameters) =>
		isEnabled && locale !== projectLocale ? getLocalizations() : {},
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

test('equal requests should be batched', async () => {
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

	const locale = 'en';
	const origin = 'test';
	const promises: Array<Promise<Translations>> = [
		client.getTranslations({locale: 'no', origin, entries: [{s: 'Hello!'}]}),
		client.getTranslations({locale, origin: 'foo', entries: [{s: 'Hello!'}]}),
	];

	for (let iteration = 0; iteration < 25; iteration += 1) {
		promises.push(
			client.getTranslations({locale, origin, entries: [{s: 'Hello!'}]})
		);
	}

	await Promise.all(promises);
	expect(requests.length).toBe(3);

	expect(
		requests.includes(
			'/api/v1/t?a=test&l=no&o=test&s=%5B%7B%22s%22%3A%22Hello!%22%7D%5D'
		)
	).toBe(true);

	expect(
		requests.includes(
			'/api/v1/t?a=test&l=en&o=foo&s=%5B%7B%22s%22%3A%22Hello!%22%7D%5D'
		)
	).toBe(true);

	expect(
		requests.includes(
			'/api/v1/t?a=test&l=en&o=test&s=%5B%7B%22s%22%3A%22Hello!%22%7D%5D'
		)
	).toBe(true);
});
