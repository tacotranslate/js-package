import {type GetServerSidePropsContext} from 'next';
import {type TacoTranslateClient, type Origin} from '../';

export default async function getTacoTranslateServerSideProps<Type>(
	{
		locale = process.env.TACOTRANSLATE_DEFAULT_LOCALE,
		locales,
	}: GetServerSidePropsContext,
	options: {client: TacoTranslateClient; origins: Origin[]},
	serverSideProps?: {
		props?: Type;
	}
) {
	const origin = process.env.TACOTRANSLATE_ORIGIN;
	const localizations = await options.client.getLocalizations({
		locale,
		origins: [origin, ...options.origins],
	});

	return {
		...serverSideProps,
		props: {
			locale,
			locales,
			localizations,
			origin,
			...(serverSideProps?.props ?? {}),
		},
	};
}
