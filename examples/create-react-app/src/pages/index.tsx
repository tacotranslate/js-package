import React, {useCallback} from 'react';
import {useTacoTranslate, useTranslate} from 'tacotranslate/react';
import Wrapper from '../components/wrapper';
import Head from '../components/head';
import LocaleSelector from '../components/locale-selector';

const fontFamilyStyles = {
	fontFamily: 'sans-serif',
};

type PageProperties = {
	onLocaleChange: (locale: string) => void;
};

export default function Page({onLocaleChange}: PageProperties) {
	const {locale, language} = useTacoTranslate();
	const Translate = useTranslate();
	const options = locale ? [locale] : [];
	const handleLocaleChange = useCallback(
		(value: string) => {
			onLocaleChange(value);
		},
		[onLocaleChange]
	);

	return (
		<Wrapper>
			<Head />
			<LocaleSelector options={options} onChange={handleLocaleChange} />

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
