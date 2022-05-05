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

const MyPage = ({url, inputLocale, outputLocale, translations}) => {
	return (
		<TranslationProvider
			url={url}
			client={tacoTranslate}
			inputLocale={inputLocale}
			outputLocale={outputLocale}
			translations={translations}
		>
			<MyComponent />
		</TranslationProvider>
	);
};

export async function getServerSideProps(context) {
	const path = context.resolvedUrl ?? context.url;
	let url = `localhost:3000/${path}`;

	if (process.env.VERCEL_URL) {
		url = `${process.env.VERCEL_URL}/${path}`;
	} else if (context.request?.headers?.host) {
		url = `${context.request.headers.host}/${path}`;
	}

	const inputLocale = context.defaultLocale;
	const outputLocale = context.locale;
	const {getTranslations} = tacoTranslate({inputLocale, outputLocale});
	const translations = await getTranslations({url});

	return {
		props: {inputLocale, outputLocale, translations, url},
	};
}

export default MyPage;
