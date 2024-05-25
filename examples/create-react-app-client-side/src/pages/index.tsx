import React, {useCallback} from 'react';
import {useTacoTranslate, Translate} from 'tacotranslate/react';
import {type Locale} from 'tacotranslate';
import Wrapper from '../components/wrapper';
import Head from '../components/head';
import LocaleSelector from '../components/locale-selector';

const fontFamilyStyles = {
	fontFamily: 'sans-serif',
};

type PageProperties = {
	readonly isLoading: boolean;
	readonly locales: Locale[];
	readonly onLocaleChange: (locale: string) => void;
};

export default function Page({
	isLoading,
	locales,
	onLocaleChange,
}: PageProperties) {
	const {language} = useTacoTranslate();
	const handleLocaleChange = useCallback(
		(value: string) => {
			onLocaleChange(value);
		},
		[onLocaleChange]
	);

	return (
		<Wrapper>
			<div style={{visibility: isLoading ? 'hidden' : undefined}}>
				<Head />
				<LocaleSelector options={locales} onChange={handleLocaleChange} />

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
						string={`TacoTranslate is a service that automatically translates your React application to any language. Say [[[<span lang="es">adiós</span>]]] to JSON files, and <a href="https://tacotranslate.com">set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll be able to translate into <strong>one language for free</strong>.<br><a href="https://tacotranslate.com">Sign up now, [[[<span lang="es">amigo</span>]]]!</a>`}
					/>
				</p>
			</div>
		</Wrapper>
	);
}
