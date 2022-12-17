# TacoTranslate

Automatically translate your React application in minutes. [Visit TacoTranslate.com](https://tacotranslate.com) for more information and to create an account for free!

Zero additional dependencies!

## Install [from npm](https://www.npmjs.com/package/tacotranslate)

```
npm install tacotranslate
```

## Usage

Check out [our examples folder on GitHub](https://github.com/tacotranslate/npm-package/tree/master/examples/) to learn more.

```jsx
import createTacoTranslateClient, {
	useTranslate,
	TranslationProvider,
} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

const Page = () => {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" />;
};

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

Your application needs to be wrapped inside a `<TranslationProvider>` that is fed the properties `client` and `locale`. For Next.js, we recommend doing this inside `_app.js`. Check out [our examples folder on GitHub](https://github.com/tacotranslate/npm-package/tree/master/examples/) for more.

```jsx
import createTacoTranslateClient, {TranslationProvider} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});
const App = ({Component, pageProps}) => {
	const {url, locale, translations} = pageProps;

	return (
		<TranslationProvider
			url={url}
			client={tacoTranslate}
			locale={locale}
			translations={translations}
		>
			<Component {...pageProps} />
		</TranslationProvider>
	);
};

export default App;
```

Now, inside a component, simply import the `useTranslate` hook. **And that’s it!**

```jsx
import {useTranslate} from 'tacotranslate';

const Component = () => {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" />;
};

export default Component;
```

### Opting out of translation

If you have segments like names or similar that you do not want to translate, you can wrap the segment in triple square brackets, like this: `[[[TacoTranslate]]]`. For example:

```jsx
<Translate string={`Hello, world! [[[Apple]]] is the name of a company.`} />
```

TacoTranslate will then preserve that text as-is. If you’re borrowing words from other languages in your strings, such as the Spanish "¡Hola!" that we like using, we strongly recommend labelling the string with it, like this:

```jsx
<Translate string={`[[[<span lang="es">Hola</span>]]], world! Welcome to TacoTranslate.`} />
```

This will improve the user experience of people using screen readers or similar tools to browse the web.

### With custom variables

Sometimes, your translations include variables, such as usernames, that we don’t want to translate. Nor to generate separate strings for every occurrence. With TacoTranslate, implementing support for that is simple:

```jsx
const Component = () => {
	const Translate = useTranslate();
	const name = 'Juan';

	return <Translate string="Hello, {{name}}!" variables={{name}} />;
};
```

On `<Translate>`, you can provide an object of values that will replace mustache-style template tags, like `{{name}}`.

### Translating strings

To translate strings directly instead of through a React component, you can import the `useTranslateString` hook. For example, use this to set the page `<title>`.

```jsx
import {useTranslateString} from 'tacotranslate';

const Page = () => {
	const translate = useTranslateString();
	
	return (
		<title>{translate({string: 'My page title'})}</title>
	);
};

export default Page;
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
 	- `locale` is the langauge code of the language you are translating to. Refer to the exported `locales` object (from the `tacotranslate` package), or [visit the GitHub repository](https://github.com/tacotranslate/npm-package/blob/master/index.tsx) to see it in code.

In addition to those properties, `<TranslationProvider>` can also be fed the following:

- **`origin`** (optional)
  	- An identifier pointing to the current page or view – such as an URL. This is useful for server side rendering, where you’d want to request all the translations for the current page. If not set, TacoTranslate infers the current URL by running `window.location.host + window.location.pathname`.
  	- For example:
    	```jsx
    	<TranslationProvider url="tacotranslate.com/contact" />
    	```
  	- Check out [our `nextjs-server-side-rendering` example on GitHub](https://github.com/tacotranslate/npm-package/blob/master/examples/nextjs-server-side-rendering/pages/index.jsx) to see it used in code.
- **`translations`** (optional)
  	- An object with a list of initial translations to prevent a client side request when the page loads. Useful when rendering on the server. You can request a list of translations for the current URL (origin) by using `getTranslations` from a `client`.

### `<Translate>`

`<Translate>` is a component retrieved from the `useTranslate` hook inside your app. It can be fed the following properties:

- **`string`**
	- The text to translate. Needs to be written in the same language as your project `locale`. 
- **`id`** (optional)
	- A translation ID. This is optional, but can be helpful for translating the same string into multiple, differing outputs. Then, later, [inside our web application](https://tacotranslate.com), you can edit the automatic translation.
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
	let url = `localhost:3000${path}`;

	if (context.req?.headers?.host) {
		url = `${context.req.headers.host}${path}`;
	}

	const {getTranslations} = tacoTranslate({locale});
	const translations = await getTranslations({origin: url}).catch((error) => {
		console.error(error);
		return {};
	});

	return {
		props: {locale, translations, url},
	};
}
```

Check out [our `nextjs-app` example](https://github.com/tacotranslate/npm-package/tree/master/examples/nextjs-app) to see it used in a server rendered application. 

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
| Norwegian | no |
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