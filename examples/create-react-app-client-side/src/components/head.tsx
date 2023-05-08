import {useEffect} from 'react';
import {useTacoTranslate, useTranslation} from 'tacotranslate/react';

export default function Head() {
	const {locale, isRightToLeft} = useTacoTranslate();
	const title = useTranslation(
		'[[[Create React App]]] example with TacoTranslate'
	);

	const description = useTranslation(
		'With TacoTranslate, you can automatically localize your React applications to any language within minutes. Example with TacoTranslate to internationalize a [[[Create React App]]].'
	);

	useEffect(() => {
		document.title = title;
		document
			.querySelector('meta[property="og:title"]')
			?.setAttribute('content', title);
	}, [title]);

	useEffect(() => {
		document
			.querySelector('meta[property="og:description"]')
			?.setAttribute('content', description);
	}, [description]);

	useEffect(() => {
		if (locale) {
			document.documentElement.setAttribute('lang', locale);

			document
				.querySelector('meta[property="og:locale"]')
				?.setAttribute('content', locale);
		}
	}, [locale]);

	useEffect(() => {
		document.documentElement.setAttribute('dir', isRightToLeft ? 'rtl' : 'ltr');
	}, [isRightToLeft]);

	return null;
}
