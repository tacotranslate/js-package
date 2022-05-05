# TacoTranslate

**Translate your React application in minutes**

## Install

```
npm install tacotranslate
```

## Usage

Check out [our examples folder on GitHub](https://github.com/tacotranslate/npm-package/examples).

### Default

```jsx
import React from 'react';
import createTacoTranslateClient, {
	useTranslate,
	TranslationProvider,
} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '23423489729834792'});

const MyComponent = () => {
	const Translate = useTranslate();
	return <Translate>{'Hello, world!'}</Translate>;
};

const MyPage = () => (
	<TranslationProvider
		client={tacoTranslate}
		inputLocale="en"
		outputLocale="no"
	>
		<MyComponent />
	</TranslationProvider>
);

export default MyPage;
```
