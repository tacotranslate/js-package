# TacoTranslate

![https://npmjs.com/package/tacotranslate](https://img.shields.io/npm/v/tacotranslate) ![https://github.com/tacotranslate/js-package](https://img.shields.io/github/actions/workflow/status/tacotranslate/js-package/tests.yml)

Take your React application to new markets automatically with AI-powered and contextually aware translations and i18n. [Visit TacoTranslate.com](https://tacotranslate.com) for more information, and to create an account for free!

The only production dependenies are React and [sanitize-html](https://www.npmjs.com/package/sanitize-html) – a module that prevents against XSS attacks within your strings.

## Install [from npm](https://www.npmjs.com/package/tacotranslate)

```
npm install tacotranslate
```

## Usage

Check out [our examples folder on GitHub](https://github.com/tacotranslate/js-package/tree/master/examples/) to learn more.

```jsx
import createTacoTranslateClient from 'tacotranslate';
import {TacoTranslate, Translate} from 'tacotranslate/react';

const tacoTranslateClient = createTacoTranslateClient({apiKey: '1234567890'});

function Page() {
	return <Translate string="Hello, world!" />;
}

const App = () => (
	<TacoTranslate client={tacoTranslateClient} locale="es">
		<Page />
	</TacoTranslate>
);

export default App;
```

## Documentation

TacoTranslate automatically translates your React application to any of our currently 75 supported languages in minutes. It’s really easy to set up, and makes translation management a breeze. Say adiós to JSON-files, and learn to love a language request from your customers!

Visit [https://tacotranslate.com/documentation](https://tacotranslate.com/documentation) to view the full documentation.

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
