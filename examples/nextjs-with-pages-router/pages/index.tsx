import Head from 'next/head';
import React from 'react';
import {type Locale} from 'tacotranslate';
import {Translate, useTacoTranslate, useTranslation} from 'tacotranslate/react';
import {type GetStaticPropsContext} from 'next';
import LocaleSelector from '../components/locale-selector';
import Wrapper from '../components/wrapper';
import customGetStaticProps from '../utilities/get-static-props';

const fontFamilyStyles = {
	fontFamily: 'sans-serif',
};

type PageProperties = {
	readonly locales: Locale[];
};

const path = '/';

export async function getStaticProps(context: GetStaticPropsContext) {
	return customGetStaticProps(path, context);
}

export default function Page({locales: supportedLocales}: PageProperties) {
	const {locale, language} = useTacoTranslate();
	const opengraphImageUrl = `${
		process.env.WEBSITE_URL
			? `https://${process.env.WEBSITE_URL}`
			: 'http://localhost:3000'
	}/api/opengraph?locale=${locale ?? process.env.TACOTRANSLATE_DEFAULT_LOCALE}`;

	return (
		<Wrapper>
			<Head>
				<meta property="og:locale" content={locale} />
				<title>
					{useTranslation(
						'Example of Next.js with [[[Pages Router]]] and TacoTranslate'
					)}
				</title>

				<meta
					name="description"
					content={useTranslation(
						'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example of internationalizing a Next.js app using the [[[Pages Router]]] and TacoTranslate.'
					)}
				/>

				<meta property="og:image" content={opengraphImageUrl} />
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
					string={`TacoTranslate is a service that automatically translates your React application to any language in minutes. Join us in saying [[[<span lang="es">adiós</span>]]] to JSON files, and <a href='https://tacotranslate.com'>set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll get to translate to <strong>one language for free</strong>.<br><a href='https://tacotranslate.com'>Sign up now, [[[<span lang="es">amigo</span>]]]!</a><br><br><strong>Oh, and did you know</strong> that if you share this page you’ll see an OpenGraph image translated into the current language, too!`}
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
