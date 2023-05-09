import React from 'react';
import {locales, type Locale} from 'tacotranslate';
import {Translate} from 'tacotranslate/react';
import {type Parameters} from './layout';
import {getOrigin, getTranslations} from '@/utilities/tacotranslate';
import {customGenerateMetadata} from '@/utilities/generate-metadata';
import CustomTranslationProvider from '@/utilities/translation-provider';
import Wrapper from '@/utilities/wrapper';
import LocaleSelector from '@/utilities/locale-selector';

const fontFamilyStyles = {
	fontFamily: 'sans-serif',
};

function Contents({locale}: {locale: Locale}) {
	const [, language] = locales.find(([code]) => code === locale) ?? [];
	const options = process.env.TACOTRANSLATE_PROJECT_LOCALES.map(
		(locale) => locale
	);

	const opengraphImageUrl = `${
		process.env.WEBSITE_URL
			? `https://${process.env.WEBSITE_URL}`
			: 'http://localhost:3000'
	}/api/opengraph?locale=${locale}`;

	return (
		<Wrapper>
			<LocaleSelector initialLocale={locale} options={options} />

			<h1 style={fontFamilyStyles}>
				<Translate
					string={`[[[<span lang="es">Hola</span>]]], world! Welcome to TacoTranslate.`}
				/>
			</h1>

			<h2 style={fontFamilyStyles}>
				<Translate
					string="Current language: {{variable}}"
					variables={{variable: language ?? ''}}
				/>
			</h2>

			<p
				style={{
					...fontFamilyStyles,
					fontSize: 18,
					lineHeight: 1.7,
				}}
			>
				<Translate
					string={`TacoTranslate is a service that automatically translates your React application to any language in minutes. Join us in saying [[[<span lang="es">adiós</span>]]] to JSON files, and <a href='https://tacotranslate.com'>set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll get to translate to <strong>one language for free</strong>.<br><a href='https://tacotranslate.com'>Sign up now, [[[<span lang="es">amigo</span>]]]!</a><br><br><strong>Oh, and did you know?</strong> If you share this page, you’ll see an OpenGraph image translated into the current language, too!`}
				/>
			</p>

			<a href="https://tacotranslate.com">
				<img
					src={opengraphImageUrl}
					alt=""
					width={1200}
					height={600}
					style={{width: '100%', height: 'auto', marginTop: '2em', border: 0}}
				/>
			</a>
		</Wrapper>
	);
}

type MetadataProperties = {
	params: Parameters;
};

const path = '/';

export const revalidate = 60;
export async function generateMetadata({params: {locale}}: MetadataProperties) {
	return customGenerateMetadata(locale, path);
}

export default async function Page({params: {locale}}: {params: Parameters}) {
	const origin = getOrigin(path);
	const translations = await getTranslations({locale, origin});

	return (
		<CustomTranslationProvider
			locale={locale}
			origin={origin}
			translations={translations}
		>
			<Contents locale={locale} />
		</CustomTranslationProvider>
	);
}
