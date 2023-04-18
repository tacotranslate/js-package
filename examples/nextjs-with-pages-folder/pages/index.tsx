import Head from 'next/head';
import React from 'react';
import {type Locale} from 'tacotranslate';
import {
	useTranslate,
	useTranslateString,
	useTacoTranslate,
} from 'tacotranslate/react';
import {type GetServerSidePropsContext} from 'next';
import LocaleSelector from '../components/locale-selector';
import Wrapper from '../components/wrapper';
import customGetServerSideProps from '../utilities/get-server-side-props';

const fontFamilyStyles = {
	fontFamily: 'sans-serif',
};

type PageProperties = {
	locales: Locale[];
};

function Page({locales: supportedLocales}: PageProperties) {
	const {locale, language} = useTacoTranslate();
	const Translate = useTranslate();
	const translate = useTranslateString();

	return (
		<Wrapper>
			<Head>
				<meta property="og:locale" content={locale} />
				<title>
					{translate('Next.js with pages/ folder example with TacoTranslate')}
				</title>

				<meta
					name="description"
					content={translate(
						'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example with TacoTranslate to internationalize a Next.js app using the pages/ folder.'
					)}
				/>
			</Head>

			<LocaleSelector initialLocale={locale} options={supportedLocales} />

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
					string={`TacoTranslate is a service that automatically translates your React application to any language in minutes. Join us in saying [[[<span lang="es">adiós</span>]]] to JSON files, and <a href='https://tacotranslate.com'>set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll get to translate to <strong>one language for free</strong>.<br><a href='https://tacotranslate.com'>Sign up now, [[[<span lang="es">amigo</span>]]]!</a>`}
				/>
			</p>
		</Wrapper>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	return customGetServerSideProps(context);
}

export default Page;
