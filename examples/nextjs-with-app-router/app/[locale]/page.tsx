'use client';

import React from 'react';
import {Translate, useTacoTranslate} from 'tacotranslate/react';
import Link from 'tacotranslate/next/link';
import LocaleSelector from '@/components/locale-selector';

export default function Page() {
	const {locale = '', language} = useTacoTranslate();
	const opengraphImageUrl = `/api/opengraph?locale=${locale}`;

	return (
		<>
			<a
				href="https://tacotranslate.com"
				style={{display: 'inline-block', marginBottom: '2em'}}
			>
				<img
					src={opengraphImageUrl}
					alt=""
					width={1200}
					height={600}
					style={{width: '100%', height: 'auto', border: 0}}
				/>
			</a>

			<div style={{display: 'flex', gap: '16px'}}>
				<LocaleSelector />

				<Link href="/hello-world">
					<Translate string="Go forwards." />
				</Link>
			</div>

			<h1>
				<Translate string="Example of Next.js with App Router and TacoTranslate" />
			</h1>

			<h2>
				<Translate
					string="Current language: {{variable}}"
					variables={{variable: language ?? ''}}
				/>
			</h2>

			<p
				style={{
					fontSize: 18,
					lineHeight: 1.7,
				}}
			>
				<Translate
					string={`TacoTranslate is a service that automatically translates your React application to any language. Say [[[<span lang="es">adiós</span>]]] to JSON files, and <a href="https://tacotranslate.com">set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll be able to translate into <strong>one language for free</strong>.<br><a href="https://tacotranslate.com">Sign up now, [[[<span lang="es">amigo</span>]]]!</a><br><br><strong>Oh, and did you know</strong> that if you share this page you’ll see an OpenGraph image translated into the current language, too!`}
				/>
			</p>
		</>
	);
}
