# TacoTranslate

![https://npmjs.com/package/tacotranslate](https://img.shields.io/npm/v/tacotranslate) ![https://github.com/tacotranslate/js-package](https://img.shields.io/github/actions/workflow/status/tacotranslate/js-package/tests.yml)

Take your React application to new markets automatically with AI-powered and contextually aware translations. [Visit TacoTranslate.com](https://tacotranslate.com) for more information, and to create an account for free!

The only production dependenies are React and [sanitize-html](https://www.npmjs.com/package/sanitize-html) – a module that prevents against XSS attacks within your strings.

## Install [from npm](https://www.npmjs.com/package/tacotranslate)

```
npm install tacotranslate
```

## Usage

Check out [our examples folder on GitHub](https://github.com/tacotranslate/js-package/tree/test/examples/) to learn more.

```jsx
import createTacoTranslateClient from 'tacotranslate';
import {Translate, TranslationProvider} from 'tacotranslate/react';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

function Page() {
	return <Translate string="Hello, world!" />;
}

const App = () => (
	<TranslationProvider client={tacoTranslate} locale="es">
		<Page />
	</TranslationProvider>
);

export default App;
```

## Documentation

TacoTranslate automatically translates your React application to any of our currently 75 supported languages in minutes. It’s really easy to set up, and makes translation management a breeze. Say adiós to JSON-files, and learn to love a language request from your customers!

### Setting up your project

Your application needs to be wrapped inside a `<TranslationProvider>` that is fed the properties `client` and `locale`. For Next.js, we recommend doing this inside `_app.js`. Check out [our examples folder on GitHub](https://github.com/tacotranslate/js-package/tree/test/examples/) for more information.

[Visit TacoTranslate.com](https://tacotranslate.com) to create API keys and translate to 1 language for free.

```jsx
import createTacoTranslateClient from 'tacotranslate';
import {TranslationProvider} from 'tacotranslate/react';

const tacoTranslate = createTacoTranslateClient({
	apiKey: '1234567890',
	projectLocale: 'en',
});

export default function App() {
	return (
		<TranslationProvider client={tacoTranslate} locale="es">
			...
		</TranslationProvider>
	);
}
```

Now, inside a component, simply use the `Translate` component. **And that’s it!**

```jsx
import {Translate} from 'tacotranslate/react';

export default function Component() {
	return <Translate string="Hello, world!" />;
}
```

To start seeing strings come in to TacoTranslate, set the language to anything but the project locale, and start browsing through your application.

### Opting out of `dangerouslySetInnerHTML`

By default, TacoTranslate will use `dangerouslySetInnerHTML` to render strings. However, if you don’t have or want HTML inside your strings, you can opt out of it like this:

#### On the component-level:

```jsx
export default function Component() {
	return (
		<Translate string="Hello, world!" useDangerouslySetInnerHTML={false} />
	);
}
```

#### On the context-level:

This will enforce not using `dangerouslySetInnerHTML` on all `<Translate>` components, unless a `<Translate>` component explicitly sets `useDangerouslySetInnerHTML` to `true` on the component level.

```jsx
export default function App() {
	return (
		<TranslationProvider
			client={tacoTranslate}
			locale="es"
			useDangerouslySetInnerHTML={false}
		>
			...
		</TranslationProvider>
	);
}
```

It is worth noting that strings are ran through [sanitize-html](https://www.npmjs.com/package/sanitize-html) before being rendered using `dangerouslySetInnerHTML`, a module that will prevent against XSS attacks within your strings.

### Opting out of translation

If you have segments like names or similar that you do not want to translate, you can wrap the segment in triple square brackets, like this: `[[[TacoTranslate]]]`. For example:

```jsx
<Translate string={`Hello, world! [[[Apple]]] is the name of a company.`} />
```

TacoTranslate will then preserve that text as-is. If you’re borrowing words from other languages in your strings, such as the Spanish "¡Hola!" that we like using, we strongly recommend labelling the string with it, like this:

```jsx
<Translate
	string={`[[[<span lang="es">Hola</span>]]], world! Welcome to TacoTranslate.`}
/>
```

This will improve the user experience of people using screen readers or similar tools to browse the web.

### Handling RTL (Right to Left) languages

If your application supports both left to right and right to left languages, you should implement the applicable styling. The current reading direction can be retrieved from the context, like this:

```jsx
import {Translate} from 'tacotranslate/react';

function Page() {
	const {isLeftToRight, isRightToLeft} = useTacoTranslate();

	return (
		<html dir={isRightToLeft ? 'rtl' : 'ltr'}>
			<Translate string="Hello, world!" />
		</html>
	);
}
```

### Display a loading indicator when client side loading

When loading translations on the client side (for example when the locale changes), you can display a loader (or anything else you’d like) by looking at the `isLoading` property from `useTacoTranslate` like this:

```jsx
import {Translate} from 'tacotranslate/react';

function Component() {
	const {isLoading} = useTacoTranslate();

	return (
		<div>
			<div>
				<Translate string="Hello, world!" />
			</div>

			{isLoading ? <span>Loading...</span> : null}
		</div>
	);
}
```

### With custom variables

Sometimes, your translations will include variables, such as usernames, that we don’t want to translate. Nor do we want to generate separate strings for every occurrence. With TacoTranslate, implementing support for that is simple:

```jsx
import {Translate} from 'tacotranslate/react';

function Component() {
	const name = 'Juan';
	return <Translate string="Hello, {{name}}!" variables={{name}} />;
}
```

On `<Translate>`, you can provide an object of values that will replace mustache-style template tags, like `{{name}}`.

**NOTE**: Be careful when rendering untrusted data. Ideally, you would [disable `dangerouslySetInnerHTML`](#opting-out-of-dangerouslysetinnerhtml) with untrusted variables, like this:

```jsx
import {Translate} from 'tacotranslate/react';

function Component() {
	const untrustedData = getUntrustedData();

	return (
		<Translate
			string="Hello, {{untrustedData}}!"
			variables={{untrustedData}}
			useDangerouslySetInnerHTML={false}
		/>
	);
}
```

It’s worth noting, however, that TacoTranslate always sanitizes strings through [sanitize-html](https://www.npmjs.com/package/sanitize-html) before rendering anything.

#### Dealing with variants, eg. numbers with plural labels

Currently, the best way to deal with plural labels or variants is to check the value programmatically, and then changing the output based on it.

```jsx
import {Translate} from 'tacotranslate/react';

function PhotoCount() {
	const count = 1;

	return count === 0 ? (
		<Translate string="You have no photos." />
	) : count === 1 ? (
		<Translate string="You have 1 photo." />
	) : (
		<Translate string="You have {{count}} photos." variables={{count}} />
	);
}
```

### Translating strings

To translate strings directly instead of through a React component, you can import the `useTranslation` hook. For example, use this to set the page `<title>`.

```jsx
import {useTranslation} from 'tacotranslate/react';

export default function Head() {
	return (
		<head>
			<title>{useTranslation('My page title')}</title>
		</head>
	);
}
```

Both `id` and `variables` can be set in an options object as the second parameter, like this:

```jsx
import {useTranslation} from 'tacotranslate/react';

function Page() {
	return (
		<head>
			<title>
				{useTranslation('Visitor count: {{count}}', {
					variables: {count: 123},
				})}
			</title>
		</head>
	);
}
```

String translations can also be assigned to variables, and used in (for example) hooks:

```jsx
import {useTranslation, Translate} from 'tacotranslate/react';

function Page() {
	const message = useTranslation('Something happened!');
	const handleClick = useCallback(() => {
		alert(message);
	}, [message]);

	return (
		<button onClick={handleClick}>
			<Translate string="Click me!" />
		</button>
	);
}
```

### Setting the project locale to avoid redundant network requests

TacoTranslate will request translation of all the strings in your application, even when they are the same language as that of your project. To avoid this request, set `projectLocale` in `createTacoTranslateClient`, like this:

```jsx
const tacoTranslate = createTacoTranslateClient({
	apiKey: '1234567890',
	projectLocale: 'es',
});
```

### `<TranslationProvider>`

- **`client`** - `client` is a TacoTranslate client from the `createTacoTranslateClient` function that is provided an object with `apiKey`.
- **`locale`**
  - `locale` is the langauge code of the language you are translating to. Refer to the exported `locales` object (from the `tacotranslate` package), or [visit the GitHub repository](https://github.com/tacotranslate/js-package/blob/test/index.tsx) to see it in code.

In addition to those properties, `<TranslationProvider>` can also be fed the following:

- **`origin`** (optional) - An identifier pointing to the current page or view – such as an URL. This is useful for server side rendering, where you’d want to request all the translations for the current page. If not set, TacoTranslate infers the current URL by running `window.location.host + window.location.pathname`. - For example:
  `jsx
<TranslationProvider origin="tacotranslate.com/contact" />
` - Check out [our `nextjs-with-pages-router` example on GitHub](https://github.com/tacotranslate/js-package/blob/test/examples/nextjs-with-pages-router/pages/index.jsx) to see it used in code.
- **`translations`** (optional) - An object with a list of initial translations to prevent a client side request when the page loads. Useful when rendering on the server. You can request a list of translations for the current URL (origin) by using `getTranslations` from a `client`.

### `<Translate>`

`<Translate>` is a component imported from `tacotranslate/react`. It can be fed the following properties:

- **`string`**
  - The text to translate. Needs to be written in the same language as your project `locale`.
- **`id`** (optional)
  - A translation ID. This is optional, but can be helpful for translating the same string into multiple, differing outputs in other languages. Then, later, [inside our web application](https://tacotranslate.com), you can edit the automatic translation.
  - For example:
    ```jsx
    <>
    	<Translate id="login-header" string="Login" />
    	<Translate id="login-footer" string="Login" />
    </>
    ```
- **`variables`** (optional)
  - An object containing key-value pairs that will replace mustache-style template tags, like `{{name}}`, in your strings. The variable names must satisfy a regular expression of `\w.`.
  - For example:
    ```jsx
    <Translate string="Hello, {{name}}!" variables={{name: 'Pedro'}} />
    ```

### `getTranslations`

This function, retrieved from the `client` object, is useful when rendering your application from the server. The returned `translations` object can be fed into `<TranslationProvider>`, avoiding a client side request, and immediately displaying the correct language to your user.

For Next.js, setting this up is really easy with `getServerSideProps` or `getStaticProps`. Check out [our `nextjs-with-pages-router` example](https://github.com/tacotranslate/js-package/tree/test/examples/nextjs-with-pages-router) to see it used in a server rendered application.

### `getLocales`

This function, also from the `client` object, can be used to retrieve a list of the locale codes supported by your project. **The first locale code in this list is the project locale.**

Check out [our `nextjs-with-pages-router` example](https://github.com/tacotranslate/js-package/tree/test/examples/nextjs-with-pages-router) to see it used in a server rendered application.

### Acting on errors

The `useTacoTranslate` hook includes an `error` object that will be populated with a JavaScript `Error` when an error occurs. Errors may be network errors, or errors thrown from the API.

Errors are always logged to the console during local development (`process.env.NODE_ENV === 'development'`).

```jsx
import {useTacoTranslate} from 'tacotranslate/react';

function Component() {
	const {error} = useTacoTranslate();

	useEffect(() => {
		if (error) {
			// some error handling
		}
	}, [error]);

	return null;
}
```

### Disabling TacoTranslate

To prevent requests towards TacoTranslate APIs while still using the `Translate` component within your application, you can set `isEnabled` to `false` on `createTacoTranslateClient`, like this:

```jsx
const tacoTranslate = createTacoTranslateClient({
	apiKey: '1234567890',
	isEnabled: false,
});
```

Strings will then just be output in the same language as they come in.

#### Bypassing TacoTranslate

You can also implement your own handling of translations (ie. _“roll your own”_) – only using TacoTranslate as a module. To do that, you’ll need to create and use a custom client, and have your own translation API. Here’s an example:

```tsx
async function getTranslations({
	locale,
	entries,
	origin,
}: Pick<
	GetTranslationsParameters,
	'locale' | 'entries' | 'origin'
>): Promise<Translations> {
	const url = new URL('https://your-api.com/translate');
	url.searchParams.set('locale', locale);
	url.searchParams.set('entries', JSON.stringify(entries));

	if (origin) {
		url.searchParams.set('origin', origin);
	}

	const request = await fetch(url.toString());

	// ... some custom handling code here, and then you return a simple flat object, like this:

	return {
		'My string': 'My translated string',
		'an_id:My string': 'My translated string with ID'
	};
}

const createCustomClient =
	({
		projectLocale,
		isEnabled = true,
	}: Pick<
		CreateTacoTranslateClientParameters,
		'projectLocale' | 'isEnabled'
	>) => ({
		getTranslations: async ({
			locale,
			entries,
			origin,
		}: ClientGetTranslationsParameters) =>
			isEnabled && locale !== projectLocale
				? getTranslations({locale, entries, origin})
				: {},
		getLocales: async () => ['en', 'es'],
	});

const customClient = createCustomClient({projectLocale: 'es'});

const App = () => (
	<TranslationProvider client={customClient} locale="es">
		<Page/>
	<TranslationProvider>
);
```

Your custom client should be a function taking `projectLocale` and `isEnabled` as input parameters in an object, returning an object with an asynchronous `getTranslations` function taking `locale`, `entries`, and `origin` as input parameters in an object.

The return data of `getTranslations` should look similar to this:

```jsx
{
	'My string': 'My translated string',
	'an_id:My string': 'My translated string with ID'
}
```

Left hand side is the original string, or `ID:ORIGINAL_STRING` if ID is set (the pair separated by a colon). Right hand side is the replacement.

If you wish to change how TacoTranslate resolves the left hand side key, you can set `getTranslationKey` when creating a custom client, like this:

```tsx
const createCustomClient = ({
	projectLocale,
	isEnabled = true,
}: Pick<
	CreateTacoTranslateClientParameters,
	'projectLocale' | 'isEnabled'
>) => ({
	getTranslations: async ({
		locale,
		entries,
		origin,
	}: ClientGetTranslationsParameters) =>
		isEnabled && locale !== projectLocale
			? getTranslations({locale, entries, origin})
			: {},
	getTranslationKey: (entry: Entry) =>
		entry.i ? `${entry.i}:${entry.s}` : entry.s,
	getLocales: async () => ['en', 'es'],
});
```

The default translation key resolution is, as above, `` id ? `${id}:${string}` : string ``.

`entries` are an array of objects containing properties `i` for `id`, `s` for `string`, and `l` for locale.

Also, a `getLocales` function is required. It should return an array of strings representing the locale codes of the languages you are supporting.

#### Uninstalling TacoTranslate

To uninstall, first remove the package:

```
npm uninstall tacotranslate
```

Then, within all your files, remove any TacoTranslate imports and hooks. For example, using a regular expression, your IDE could replace `<Translate>` with the original string like so:

- Replace:
  ```
  <Translate\s(?:.*?)string="([^"]*?)"(?:.*?)\/>
  ```
- With:
  ```
  "$1"
  ```

### Known issues

If you’re using Jest, you might get an error stating `ReferenceError: TextEncoder is not defined`, or `ReferenceError: TextDecoder is not defined`. To fix this, do the following:

1. Create or edit `jest.setup.js`:

   ```js
   const {TextEncoder, TextDecoder} = require('node:util');

   global.TextEncoder = TextEncoder;
   global.TextDecoder = TextDecoder;
   ```

2. Include the setup file in the `setupFiles` array within `jest.config.js`:

   ```js
   module.exports = {
   	preset: 'ts-jest',
   	testEnvironment: 'jsdom',
   	setupFiles: ['./jest.setup.js'],
   };
   ```

[Read more here.](https://github.com/kkomelin/sanitize-html/issues/91)

### Supported languages

TacoTranslate currently supports translation between the following 75 languages:

| Language              | Locale code |
| --------------------- | ----------- |
| Afrikaans             | af          |
| Albanian              | sq          |
| Amharic               | am          |
| Arabic                | ar          |
| Armenian              | hy          |
| Azerbaijani           | az          |
| Bengali               | bn          |
| Bosnian               | bs          |
| Bulgarian             | bg          |
| Catalan               | ca          |
| Chinese (Simplified)  | zh          |
| Chinese (Traditional) | zh-tw       |
| Croatian              | hr          |
| Czech                 | cs          |
| Danish                | da          |
| Dari                  | fa-af       |
| Dutch                 | nl          |
| English               | en          |
| Estonian              | et          |
| Farsi (Persian)       | fa          |
| Filipino, Tagalog     | tl          |
| Finnish               | fi          |
| French                | fr          |
| French (Canada)       | fr-ca       |
| Georgian              | ka          |
| German                | de          |
| Greek                 | el          |
| Gujarati              | gu          |
| Haitian Creole        | ht          |
| Hausa                 | ha          |
| Hebrew                | he          |
| Hindi                 | hi          |
| Hungarian             | hu          |
| Icelandic             | is          |
| Indonesian            | id          |
| Irish                 | ga          |
| Italian               | it          |
| Japanese              | ja          |
| Kannada               | kn          |
| Kazakh                | kk          |
| Korean                | ko          |
| Latvian               | lv          |
| Lithuanian            | lt          |
| Macedonian            | mk          |
| Malay                 | ms          |
| Malayalam             | ml          |
| Maltese               | mt          |
| Marathi               | mr          |
| Mongolian             | mn          |
| Norwegian (Bokmål)    | no          |
| Pashto                | ps          |
| Polish                | pl          |
| Portuguese (Brazil)   | pt          |
| Portuguese (Portugal) | pt-pt       |
| Punjabi               | pa          |
| Romanian              | ro          |
| Russian               | ru          |
| Serbian               | sr          |
| Sinhala               | si          |
| Slovak                | sk          |
| Slovenian             | sl          |
| Somali                | so          |
| Spanish               | es          |
| Spanish (Mexico)      | es-mx       |
| Swahili               | sw          |
| Swedish               | sv          |
| Tamil                 | ta          |
| Telugu                | te          |
| Thai                  | th          |
| Turkish               | tr          |
| Ukrainian             | uk          |
| Urdu                  | ur          |
| Uzbek                 | uz          |
| Vietnamese            | vi          |
| Welsh                 | cy          |
