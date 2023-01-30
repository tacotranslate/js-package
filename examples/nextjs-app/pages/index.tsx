import Head from 'next/head';
import React from 'react';
import {locales, useTranslate, useTranslateString} from 'tacotranslate';
import LocaleSelector from '../components/locale-selector';
import Wrapper from '../components/wrapper';
import getAppServerSideProps from '../utilities/get-app-server-side-props';

const bodyFontStyles = {
	fontSize: 18,
	fontFamily: 'sans-serif',
	lineHeight: 1.7,
};

type PageProperties = {
	locale: string;
};

function Page({locale}: PageProperties) {
	const Translate = useTranslate();
	const translate = useTranslateString();
	const currentLocale = locales.find(
		([localeCode]) => localeCode === locale
	) || ['xx', 'Unknown'];

	return (
		<Wrapper>
			<Head>
				<title>TacoTranslate: Next.js app example</title>

				<meta property="og:locale" content={locale} />
				<meta
					name="description"
					content={translate('With TacoTranslate, you can automatically localize your React applications to any language within minutes.')}
				/>

				<meta
					property="og:description"
					content={translate('With TacoTranslate, you can automatically localize your React applications to any language within minutes.')}
				/>
			</Head>

			<LocaleSelector initialLocale={locale} />

			<h1>
				<Translate string="[[[Hola]]], world! Welcome to TacoTranslate." />
			</h1>

			<h2>
				<Translate
					string="Current language: {{variable}}"
					variables={{variable: currentLocale[1]}}
				/>
			</h2>

			<p style={bodyFontStyles}>
				<Translate string="TacoTranslate is a service that automatically translates your React application to any language in minutes. Join us in saying [[[adiós]]] to JSON files, and <a href='https://tacotranslate.com'>set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll get to translate <strong>one language for free</strong>. In addition, we are collaborating with one the top translation providers in the world, should you need to get a more accurate translation than what machine learning can provide.<br><br><a href='https://tacotranslate.com'>Sign up now, [[[amigo]]]!</a>" />
			</p>
		</Wrapper>
	);
}

export async function getServerSideProps(context) {
	return getAppServerSideProps(context);
}

export default Page;
