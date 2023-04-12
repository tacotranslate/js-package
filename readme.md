# TacoTranslate

![https://npmjs.com/package/tacotranslate](https://img.shields.io/npm/v/tacotranslate) ![https://github.com/tacotranslate/npm-package](https://img.shields.io/github/actions/workflow/status/tacotranslate/npm-package/tests.yml)

Take your React application to new markets automatically with AI-powered and contextually aware translations. [Visit TacoTranslate.com](https://tacotranslate.com) for more information, and to create an account for free!

The only production dependenies are React and [Isomporphic DOMPurify](https://www.npmjs.com/package/isomorphic-dompurify) – a module that prevents against XSS attacks within your strings.

## Install [from npm](https://www.npmjs.com/package/tacotranslate)

```
npm install tacotranslate
```

## Usage

Check out [our examples folder on GitHub](https://github.com/tacotranslate/npm-package/tree/test/examples/) to learn more.

```jsx
import createTacoTranslateClient, {
	useTranslate,
	TranslationProvider,
} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

function Page() {
	const Translate = useTranslate();
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

TacoTranslate automatically translates your React application to any of our currently 75 supported language in minutes. It’s really easy to set up, and makes translation management a breeze. Say adiós to JSON-files, and learn to love a language request from your customers!

### Setting up your project

Your application needs to be wrapped inside a `<TranslationProvider>` that is fed the properties `client` and `locale`. For Next.js, we recommend doing this inside `_app.js`. Check out [our examples folder on GitHub](https://github.com/tacotranslate/npm-package/tree/test/examples/) for more information.

[Visit TacoTranslate.com](https://tacotranslate.com) to create an API key and translate to 1 language for free.

```jsx
import createTacoTranslateClient, {TranslationProvider} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({
	apiKey: '1234567890',
	projectLocale: 'en'
});

export default function App() {
	return (
		<TranslationProvider client={tacoTranslate} locale="es">
			...
		</TranslationProvider>
	);
}
```

Now, inside a component, simply import the `useTranslate` hook. **And that’s it!**

```jsx
import {useTranslate} from 'tacotranslate';

export default function Component() {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" />;
}
```

To start seeing strings come in to TacoTranslate, set the language to anything but the project locale, and start browsing through your application.

### Opting out of `dangerouslySetInnerHTML`

By default, TacoTranslate will use `dangerouslySetInnerHTML` to render strings. However, if you don’t have or want HTML inside your strings, you can opt out of it like this:

#### On the component-level:

```jsx
export default function Component() {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" useDangerouslySetInnerHTML={false} />;
}
```

#### On the context-level:

This will enforce not using `dangerouslySetInnerHTML` on all `<Translate>` components, unless a `<Translate>` component explicitly sets `useDangerouslySetInnerHTML` to `true` on the component level.

```jsx
export default function App() {
	return (
		<TranslationProvider client={tacoTranslate} locale="es" useDangerouslySetInnerHTML={false}>
			...
		</TranslationProvider>
	);
}
```

It is worth noting that strings are ran through [Isomporphic DOMPurify](https://www.npmjs.com/package/isomorphic-dompurify) before being rendered using `dangerouslySetInnerHTML`, a module that will prevent against XSS attacks within your strings.

### Opting out of translation

If you have segments like names or similar that you do not want to translate, you can wrap the segment in triple square brackets, like this: `[[[TacoTranslate]]]`. For example:

```jsx
<Translate string={`Hello, world! [[[Apple]]] is the name of a company.`} />
```

TacoTranslate will then preserve that text as-is. If you’re borrowing words from other languages in your strings, such as the Spanish "¡Hola!" that we like using, we strongly recommend labelling the string with it, like this:

```jsx
<Translate string={`<span lang="es">[[[Hola]]]</span>, world! Welcome to TacoTranslate.`} />
```

This will improve the user experience of people using screen readers or similar tools to browse the web.

### Handling RTL (Right to Left) languages

If your application supports both left to right and right to left languages, you should implement the applicable styling. The current reading direction can be retrieved from the context, like this:

```jsx
function Page() {
	const {Translate, isLeftToRight, isRightToLeft} = useTacoTranslate();
	
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
function Component() {
	const {Translate, isLoading} = useTacoTranslate();
	
	return (
		<div>
			<div>
				<Translate string="Hello, world!" />
			</div>
			
			{isLoading ? (
				<span>Loading...</span>
			) : null}
		</div>
	);
}
```

### With custom variables

Sometimes, your translations will include variables, such as usernames, that we don’t want to translate. Nor do we want to generate separate strings for every occurrence. With TacoTranslate, implementing support for that is simple:

```jsx
function Component() {
	const Translate = useTranslate();
	const name = 'Juan';

	return <Translate string="Hello, {{name}}!" variables={{name}} />;
}
```

On `<Translate>`, you can provide an object of values that will replace mustache-style template tags, like `{{name}}`.

### Translating strings

To translate strings directly instead of through a React component, you can import the `useTranslateString` hook. For example, use this to set the page `<title>`.

```jsx
import {useTranslateString} from 'tacotranslate';

export default function Head() {
	const translate = useTranslateString();
	
	return (
		<head>
			<title>{translate('My page title')}</title>
		</head>
	);
}
```

Both `id` and `variables` can be set in an options object as the second parameter, like this:

```jsx
function Page() {
	const translate = useTranslateString();

	return (
		<p>{translate('Visitor count: {{count}}', {count: 123})}</p>
	);
}
```

### Setting the project locale to avoid redundant network requests

TacoTranslate will request translation of all the strings in your application, even when they are the same language as that of your project. To avoid this request, set `projectLocale` in `createTacoTranslateClient`, like this:

```jsx
const tacoTranslate = createTacoTranslateClient({
	apiKey: '1234567890', 
	projectLocale: 'es'
});
```

### `<TranslationProvider>`

- **`client`**
  	- `client` is a TacoTranslate client from the `createTacoTranslateClient` function that is provided an object with `apiKey`.
- **`locale`**
 	- `locale` is the langauge code of the language you are translating to. Refer to the exported `locales` object (from the `tacotranslate` package), or [visit the GitHub repository](https://github.com/tacotranslate/npm-package/blob/test/index.tsx) to see it in code.

In addition to those properties, `<TranslationProvider>` can also be fed the following:

- **`origin`** (optional)
  	- An identifier pointing to the current page or view – such as an URL. This is useful for server side rendering, where you’d want to request all the translations for the current page. If not set, TacoTranslate infers the current URL by running `window.location.host + window.location.pathname`.
  	- For example:
    	```jsx
    	<TranslationProvider origin="tacotranslate.com/contact" />
    	```
  	- Check out [our `nextjs-app` example on GitHub](https://github.com/tacotranslate/npm-package/blob/test/examples/nextjs-app/pages/index.jsx) to see it used in code.
- **`translations`** (optional)
  	- An object with a list of initial translations to prevent a client side request when the page loads. Useful when rendering on the server. You can request a list of translations for the current URL (origin) by using `getTranslations` from a `client`.

### `<Translate>`

`<Translate>` is a component retrieved from the `useTranslate` hook inside your app. It can be fed the following properties:

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

For Next.js, setting this up is really easy with `getServerSideProps` or `getStaticProps`.

```jsx
import createTacoTranslateClient from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

export async function getServerSideProps(context) {
	const {resolvedUrl: path, locale} = context;
	let origin = `localhost:3000${path}`;

	if (context.req?.headers?.host) {
		origin = `${context.req.headers.host}${path}`;
	}

	const {getTranslations} = tacoTranslate({locale});
	const translations = await getTranslations({origin}).catch((error) => {
		console.error(error);
		return {};
	});

	return {
		props: {locale, translations, origin},
	};
}
```

Check out [our `nextjs-app` example](https://github.com/tacotranslate/npm-package/tree/test/examples/nextjs-app) to see it used in a server rendered application. 

### `getLocales`

This function, also from the `client` object, can be used to retrieve a list of the locale codes supported by your project. **The first locale code in this list is the project locale.**

Check out [our `nextjs-app` example](https://github.com/tacotranslate/npm-package/tree/test/examples/nextjs-app) to see it used in a server rendered application. 

### Acting on errors

The `useTacoTranslate` hook includes an `error` object that will be populated with a JavaScript `Error` when an error occurs. Errors may be network errors, or errors thrown from the API. 

Errors are always logged to the console during local development (`process.env.NODE_ENV === 'development'`).

```jsx
import {useTacoTranslate} from 'tacotranslate';

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
	isEnabled: false
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
	>) =>
	({locale}: TacoTranslateClientParameters) => ({
		getTranslations: async ({
			entries,
			origin,
		}: ClientGetTranslationsParameters) =>
			isEnabled && locale !== projectLocale
				? getTranslations({locale, entries, origin})
				: {},
		getLocales: async () => ['en', 'es']
	});

const customClient = createCustomClient({projectLocale: 'es'});

const App = () => (
	<TranslationProvider client={customClient} locale="es">
		<Page/>
	<TranslationProvider>
);
```

Your custom client should be a function taking `projectLocale` and `isEnabled` as input parameters in an object, returning a function taking `locale` as an input parameter in an object, finally returning an object with an asynchronous `getTranslations` function taking `entries` and `origin` as input parameters in an object.

The return data of `getTranslations` should look similar to this:

```jsx
{
	'My string': 'My translated string',
	'an_id:My string': 'My translated string with ID'
}
```

Left hand side is the original string, or `ID:ORIGINAL_STRING` if ID is set (the pair separated by a colon). Right hand side is the replacement.

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

### Supported languages

TacoTranslate currently supports translation between the following 75 languages:

| Language | Locale code |
| -------- | ----------- |
| Afrikaans | af |
| Albanian | sq |
| Amharic | am |
| Arabic | ar |
| Armenian | hy |
| Azerbaijani | az |
| Bengali | bn |
| Bosnian | bs |
| Bulgarian | bg |
| Catalan | ca |
| Chinese (Simplified) | zh |
| Chinese (Traditional) | zh-tw |
| Croatian | hr |
| Czech | cs |
| Danish | da |
| Dari | fa-af |
| Dutch | nl |
| English | en |
| Estonian | et |
| Farsi (Persian) | fa |
| Filipino, Tagalog | tl |
| Finnish | fi |
| French | fr |
| French (Canada) | fr-ca |
| Georgian | ka |
| German | de |
| Greek | el |
| Gujarati | gu |
| Haitian Creole | ht |
| Hausa | ha |
| Hebrew | he |
| Hindi | hi |
| Hungarian | hu |
| Icelandic | is |
| Indonesian | id |
| Irish | ga |
| Italian | it |
| Japanese | ja |
| Kannada | kn |
| Kazakh | kk |
| Korean | ko |
| Latvian | lv |
| Lithuanian | lt |
| Macedonian | mk |
| Malay | ms |
| Malayalam | ml |
| Maltese | mt |
| Marathi | mr |
| Mongolian | mn |
| Norwegian (Bokmål) | no |
| Pashto | ps |
| Polish | pl |
| Portuguese (Brazil) | pt |
| Portuguese (Portugal) | pt-pt |
| Punjabi | pa |
| Romanian | ro |
| Russian | ru |
| Serbian | sr |
| Sinhala | si |
| Slovak | sk |
| Slovenian | sl |
| Somali | so |
| Spanish | es |
| Spanish (Mexico) | es-mx |
| Swahili | sw |
| Swedish | sv |
| Tamil | ta |
| Telugu | te |
| Thai | th |
| Turkish | tr |
| Ukrainian | uk |
| Urdu | ur |
| Uzbek | uz |
| Vietnamese | vi |
| Welsh | cy |