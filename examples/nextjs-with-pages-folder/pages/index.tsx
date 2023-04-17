import Head from 'next/head';
import React from 'react';
import {
	type Locale,
	useTranslate,
	useTranslateString,
	useTacoTranslate,
} from 'tacotranslate';
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
				<title>TacoTranslate: Next.js app example</title>

				<meta property="og:locale" content={locale} />
				<meta
					name="description"
					content={translate(
						'With TacoTranslate, you can automatically localize your React applications to any language within minutes.'
					)}
				/>

				<meta
					property="og:description"
					content={translate(
						'With TacoTranslate, you can automatically localize your React applications to any language within minutes.'
					)}
				/>
			</Head>

			<LocaleSelector initialLocale={locale} options={supportedLocales} />

			<h1 style={fontFamilyStyles}>
				<Translate string="[[[Hola]]], world! Welcome to TacoTranslate." />
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
