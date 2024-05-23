import React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';
import {isRightToLeftLocaleCode} from 'tacotranslate';

export default class CustomDocument extends Document {
	render() {
		const {locale = ''} = this.props.__NEXT_DATA__;

		return (
			<Html dir={isRightToLeftLocaleCode(locale) ? 'rtl' : 'ltr'}>
				<Head />

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
