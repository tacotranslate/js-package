import React from 'react';
import TacoTranslate, {Translate} from 'tacotranslate/react';
import tacoTranslateClient from '../tacotranslate-client';

const origin = 'body';
tacoTranslateClient.origins.push(origin);

export default function Body() {
	return (
		<TacoTranslate origin={origin}>
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
		</TacoTranslate>
	);
}
