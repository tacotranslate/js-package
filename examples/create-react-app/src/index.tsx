import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';
import createTacoTranslateClient from 'tacotranslate';
import {TranslationProvider} from 'tacotranslate/react';
import Page from './pages';

declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {
		TACOTRANSLATE?: {
			locales?: string[];
			translations?: Record<string, string>;
		};
	}
}

const tacoTranslate = createTacoTranslateClient({
	apiKey:
		process.env.REACT_APP_TACOTRANSLATE_SECRET_API_KEY ??
		process.env.REACT_APP_TACOTRANSLATE_PUBLIC_API_KEY ??
		'',
});

function App() {
	const [locale, setLocale] = useState(
		process.env.REACT_APP_TACOTRANSLATE_PROJECT_LOCALE ?? 'en'
	);

	const handleLocaleChange = useCallback((locale: string) => {
		setLocale(locale);
		document.cookie = `locale=${locale.toLowerCase()}; Max-Age=31560000; SameSite=Lax; Path=/;`;
	}, []);

	return (
		<TranslationProvider
			client={tacoTranslate}
			locale={locale}
			origin={process.env.REACT_APP_WEBSITE_URL}
			translations={window.TACOTRANSLATE?.translations}
		>
			<Page onLocaleChange={handleLocaleChange} />
		</TranslationProvider>
	);
}

const element = document.querySelector('#root');

if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
