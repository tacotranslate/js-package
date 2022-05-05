import {useCallback, useState} from 'react';
import {useRouter} from 'next/router.js';
import createTacoTranslateClient, {
	useTranslate,
	TranslationProvider,
} from 'tacotranslate';
import locales from '../locales.json';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

const Component = () => {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" />;
};

const Page = ({url, inputLocale, outputLocale, translations}) => {
	const router = useRouter();
	const [currentInput, setCurrentInput] = useState(outputLocale);

	const handleChange = useCallback(
		(event) => {
			const locale = event.target.value;
			setCurrentInput(locale);
			document.cookie = `NEXT_LOCALE=${locale.toLowerCase()}; Max-Age=31560000; SameSite=Lax; Path=/;`;

			router.push(router.pathname, router.pathname, {
				locale: locale.toLowerCase(),
			});
		},
		[router]
	);

	return (
		<TranslationProvider
			url={url}
			client={tacoTranslate}
			inputLocale={inputLocale}
			outputLocale={outputLocale}
			translations={translations}
		>
			<select value={currentInput} onChange={handleChange}>
				{locales.map(([locale, name]) => (
					<option key={locale} value={locale}>
						{name}
					</option>
				))}
			</select>

			<Component />
		</TranslationProvider>
	);
};

export async function getStaticProps(context) {
	const path = 'with-locale-selector';
	let url = `localhost:3000/${path}`;

	if (process.env.VERCEL_URL) {
		url = `${process.env.VERCEL_URL}/${path}`;
	} else if (process.env.WEBSITE_URL) {
		url = `${process.env.WEBSITE_URL}/${path}`;
	}

	const inputLocale = context.defaultLocale;
	const outputLocale = context.locale;
	const {getTranslations} = tacoTranslate({inputLocale, outputLocale});
	const translations = await getTranslations({url});

	return {
		props: {inputLocale, outputLocale, translations, url},
		revalidate: 10,
	};
}

export default Page;
