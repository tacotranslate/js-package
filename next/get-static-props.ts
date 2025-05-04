import {type GetStaticPropsContext} from 'next';
import {type TacoTranslateClient, type Origin} from '..';

export default async function getTacoTranslateStaticProps<Type>(
	{
		locale = process.env.TACOTRANSLATE_DEFAULT_LOCALE,
		locales,
	}: GetStaticPropsContext,
	options: {client: TacoTranslateClient; origins?: Origin[]},
	staticProps?: {
		props?: Type;
		revalidate?: number | boolean;
	}
) {
	const origin = process.env.TACOTRANSLATE_ORIGIN;
	const localizations = await options.client.getLocalizations({
		locale,
		origins: [...options.client.origins, origin, ...(options.origins ?? [])],
	});

	return {
		revalidate: 60,
		...staticProps,
		props: {
			locale,
			locales,
			localizations,
			origin,
			...staticProps?.props,
		},
	};
}
