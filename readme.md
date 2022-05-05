# TacoTranslate

Automatically translate your React application in minutes

## Install [from npm](https://www.npmjs.com/package/tacotranslate)

```
npm install tacotranslate
```

## Usage

Check out [our examples folder on GitHub](https://github.com/tacotranslate/npm-package/tree/master/examples/).

### Default

```jsx
import React from 'react';
import createTacoTranslateClient, {
	useTranslate,
	TranslationProvider,
} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

const Component = () => {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" />;
};

const Page = () => (
	<TranslationProvider
		client={tacoTranslate}
		inputLocale="en"
		outputLocale="no"
	>
		<Component />
	</TranslationProvider>
);

export default Page;
```
