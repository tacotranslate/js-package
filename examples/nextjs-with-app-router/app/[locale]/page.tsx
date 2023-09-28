'use client';

import React from 'react';
import {Translate, useTacoTranslate} from 'tacotranslate/react';
import Link from 'tacotranslate/next/link';
import LocaleSelector from '@/components/locale-selector';

const fontFamilyStyles = {
	fontFamily: 'sans-serif',
};

export const revalidate = 60;
export default async function Page() {
	const {locale = '', language} = useTacoTranslate();
	const opengraphImageUrl = `/api/opengraph?locale=${locale}`;

	return (
		<>
			<div style={{display: 'flex', gap: '16px'}}>
				<LocaleSelector />

				<Link href="/hello-world">
					<Translate string="Go forwards." />
				</Link>
			</div>

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
		</>
	);
}
