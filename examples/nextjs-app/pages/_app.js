import {TranslationProvider} from 'tacotranslate';
import tacoTranslate from '../utilities/tacotranslate.js';
import '../global.css';

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
