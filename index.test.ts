import {template} from '.';

test('template strings should be replaced', () => {
	expect(template('Hello, {{name}}!', {name: 'Pedro'})).toBe('Hello, Pedro!');
});
