import {
	createEntry,
	getEntryFromTranslations,
	patchDefaultString,
	template,
} from '.';

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
