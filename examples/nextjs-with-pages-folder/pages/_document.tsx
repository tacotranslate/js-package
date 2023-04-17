import React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';
import {rightToLeftLocaleCodes} from 'tacotranslate';

class CustomDocument extends Document {
	render() {
		const {locale = process.env.DEFAULT_LOCALE} = this.props.__NEXT_DATA__;
		const direction = rightToLeftLocaleCodes.includes(locale) ? 'rtl' : 'ltr';

		return (
			<Html dir={direction}>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default CustomDocument;
