import {type NextConfig} from 'next';
import {type TacoTranslateClient} from '..';

/* eslint-disable no-unused-vars */
declare global {
	type ProcessEnv = {
		TACOTRANSLATE_ENV: string;
		TACOTRANSLATE_ORIGIN: string;
		TACOTRANSLATE_PUBLIC_API_KEY: string;
		TACOTRANSLATE_SECRET_API_KEY: string;
	};
}
/* eslint-enable no-unused-vars */

type WithTacoTranslateOptions = {
	isProduction?: boolean;
	client: TacoTranslateClient;
};

export default async function withTacoTranslate(
	configuration: NextConfig,
	options: WithTacoTranslateOptions
) {
	const isProduction =
		options?.isProduction ?? process.env.TACOTRANSLATE_ENV === 'production';
	const locales = await options.client.getLocales();
	const [projectLocale] = locales;

	return {
		env: {
			...configuration.env,
			/* eslint-disable @typescript-eslint/naming-convention */
			TACOTRANSLATE_ORIGIN: process.env.TACOTRANSLATE_ORIGIN,
			TACOTRANSLATE_API_KEY: isProduction
				? process.env.TACOTRANSLATE_PUBLIC_API_KEY
				: process.env.TACOTRANSLATE_SECRET_API_KEY,
			TACOTRANSLATE_PROJECT_LOCALE: projectLocale,
			TACOTRANSLATE_PROJECT_LOCALES: JSON.stringify(locales),
			TACOTRANSLATE_IS_PRODUCTION: String(isProduction),
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		i18n: {
			...configuration.i18n,
			defaultLocale: projectLocale,
			locales,
		},
	};
}
