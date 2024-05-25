import React, {useCallback, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import createTacoTranslateClient from 'tacotranslate';
import TacoTranslate from 'tacotranslate/react';
import Page from './pages';

const tacoTranslate = createTacoTranslateClient({
	apiKey:
		process.env.REACT_APP_TACOTRANSLATE_SECRET_API_KEY ??
		process.env.REACT_APP_TACOTRANSLATE_PUBLIC_API_KEY ??
		'',
});

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [locale, setLocale] = useState(
		window.localStorage.getItem('locale') ??
			process.env.REACT_APP_TACOTRANSLATE_PROJECT_LOCALE ??
			'en'
	);

	const handleLocaleChange = useCallback((locale: string) => {
		setLocale(locale);
		window.localStorage.setItem('locale', locale);
	}, []);

	const [supportedLocales, setSupportedLocales] = useState([locale]);

	useEffect(() => {
		void tacoTranslate.getLocales().then((locales) => {
			setSupportedLocales(locales);
			setIsLoading(false);
		});
	}, []);

	return (
		<TacoTranslate
			client={tacoTranslate}
			locale={locale}
			origin={process.env.REACT_APP_TACOTRANSLATE_ORIGIN}
		>
			<Page
				isLoading={isLoading}
				locales={supportedLocales}
				onLocaleChange={handleLocaleChange}
			/>
		</TacoTranslate>
	);
}

const element = document.querySelector('#root');

if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
