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
		outputLocale="no"
	>
		<Page />
	</TranslationProvider>
);

export default App;
```

## Documentation

### Setting up your project
