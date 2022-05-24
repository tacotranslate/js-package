# TacoTranslate

Automatically translate your React application in minutes.

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
	<TranslationProvider
		client={tacoTranslate}
		inputLocale="en"
		outputLocale="es"
	>
		<Page />
	</TranslationProvider>
);

export default App;
```

## Documentation

TacoTranslate automatically translates your React application to any of our currently 75 supported language in minutes. It’s really easy to set up, and makes translation management a breeze. Say adiós to JSON-files, and learn to love a language request from your customers!

### Setting up your project

Your application needs to be wrapped inside a `<TranslationProvider>` that is fed the properties `client`, `inputLocale`, and `outputLocale`.

For Next.js, we recommend doing this inside `_app.js`.

```jsx
import createTacoTranslateClient, {TranslationProvider} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

const App = ({Component, pageProps}) => {
	const {url, inputLocale, outputLocale, translations} = pageProps;

	return (
		<TranslationProvider
			url={url}
			client={tacoTranslate}
			inputLocale={inputLocale}
			outputLocale={outputLocale}
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

### `<TranslationProvider>`

- **`client`**
  	- `client` is a TacoTranslate client from the `createTacoTranslateClient` function that is provided an object with `apiKey`.
- **`inputLocale`** & **`outputLocale`**
 	- `inputLocale` and `outputLocale` are `locale` codes. `inputLocale` is the langauge you are translating from, `outputLocale` is the one you’re translating to. Refer to the exported `locales` object (from the `tacotranslate` package), or [visit the GitHub repository](https://github.com/tacotranslate/npm-package/blob/master/index.tsx) to see it in code.

In addition to those properties, `<TranslationProvider>` can also be fed the following:

- **`url`** (optional)
  	- The URL of the current page without its `protocol`. This is useful for server side rendering, where you’d want to request all the translations for the current page. If not set, TacoTranslate infers the current URL by running `window.location.host + window.location.pathname`.
  	- For example:
    	```jsx
    	<TranslationProvider url="tacotranslate.com/contact" />
    	```
  	- Check out [our `nextjs-server-side-rendering` example on GitHub](https://github.com/tacotranslate/npm-package/blob/master/examples/nextjs-server-side-rendering/pages/index.jsx) to see it used in code.
- **`translations`** (optional)
  	- An object with a list of initial translations to prevent a client side request when the page loads. Useful when rendering on the server. You can request a list of translations for the current URL by using `getTranslations` from a `client`.

### `<Translate>`

`<Translate>` is a component retrieved from the `useTranslate` hook inside your app. It can be fed the following properties:

- **`string`**
	- The text to translate. Needs to be written in the same language as your `inputLocale`. If you have segments like names or similar that you do not want to translate, you can wrap the segment in an HTML-element (like `span`) with the attribute `translate` set to `no`.
	- For example:
		```jsx
		<Translate string={`Hello, world! <span translate="no">Apple</span> is the name of company.`} />
		```
		Note that some language translations currently struggle with whitespace preservation when using HTML tags. This is unfortunately out of our hands, as we rely on Amazon Translate to handle the machine translation. To temporarily avoid missing whitespace, add extra whitespace inside the HTML tag, like this:
		```jsx
		<Translate string={`Hello, world! <span translate="no"> Apple </span> is the name of company.`} />
		```
- **`id`** (optional)
	- A translation ID. This is optional, but can be helpful for translating the same string into multiple, differing outputs. Then, later, [inside our web application](https://tacotranslate.com), you can edit the automatic translation.
	- For example:
		```jsx
		<>
			<Translate id="login-header" string="Login" />
			<Translate id="login-footer" string="Login" />
		</>
		```

### `getTranslations`

This function, retrieved from the `client` object, is useful when rendering your application from the server. The returned `translations` object can be fed into `<TranslationProvider>`, avoiding a client side request, and immediately displaying the correct language to your user.

For Next.js, setting this up is really easy with `getServerSideProps`.

```jsx
import createTacoTranslateClient from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

export async function getServerSideProps(context) {
	const path = context.resolvedUrl ?? context.url;
	let url = `localhost:3000${path}`;

	if (context.req?.headers?.host) {
		url = `${context.req.headers.host}${path}`;
	}

	const inputLocale = context.defaultLocale;
	const outputLocale = context.locale;
	const {getTranslations} = tacoTranslate({inputLocale, outputLocale});
	const translations = await getTranslations({url});

	return {
		props: {inputLocale, outputLocale, translations, url},
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