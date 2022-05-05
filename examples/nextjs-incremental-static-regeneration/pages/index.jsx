import createTacoTranslateClient, {
	useTranslate,
	TranslationProvider,
} from 'tacotranslate';

const tacoTranslate = createTacoTranslateClient({apiKey: '1234567890'});

const Component = () => {
	const Translate = useTranslate();
	return <Translate string="Hello, world!" />;
};

const Page = ({url, inputLocale, outputLocale, translations}) => (
	<TranslationProvider
		url={url}
		client={tacoTranslate}
		inputLocale={inputLocale}
		outputLocale={outputLocale}
		translations={translations}
	>
		<Component />
	</TranslationProvider>
);

export async function getStaticProps(context) {
	const path = '';
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
