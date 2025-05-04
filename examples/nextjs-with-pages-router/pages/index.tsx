import Head from 'next/head';
import React from 'react';
import {type Locale} from 'tacotranslate';
import {Translate, useTacoTranslate, useTranslation} from 'tacotranslate/react';
import {type GetStaticPropsContext} from 'next';
import getTacoTranslateStaticProps from 'tacotranslate/next/get-static-props';
import LocaleSelector from '../components/locale-selector';
import Wrapper from '../components/wrapper';
import tacoTranslate from '../utilities/tacotranslate';
import Body from '../components/body';

export async function getStaticProps(context: GetStaticPropsContext) {
	return getTacoTranslateStaticProps(context, {client: tacoTranslate});
}

export default function Page({
	locales: supportedLocales,
}: {
	readonly locales: Locale[];
}) {
	const {locale, language} = useTacoTranslate();
	const opengraphImageUrl = `/api/opengraph?locale=${locale ?? ''}`;

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
						'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example of internationalizing a Next.js project using the [[[Pages Router]]] and TacoTranslate.'
					)}
				/>

				<meta property="og:image" content={opengraphImageUrl} />
			</Head>

			<a href="https://tacotranslate.com">
				<img
					src={opengraphImageUrl}
					alt=""
					width={1200}
					height={600}
					style={{
						width: '100%',
						height: 'auto',
						marginBottom: '2em',
						border: 0,
					}}
				/>
			</a>

			<LocaleSelector initialLocale={locale} options={supportedLocales} />

			<h1>
				<Translate string="Example of Next.js with [[[Pages Router]]] and TacoTranslate" />
			</h1>

			<h2>
				<Translate
					string="Current language: {{variable}}"
					variables={{variable: language ?? ''}}
				/>
			</h2>

			<Body />
		</Wrapper>
	);
}
