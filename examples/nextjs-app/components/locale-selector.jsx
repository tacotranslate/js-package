import {useState, useCallback} from 'react';
import {useRouter} from 'next/router.js';
import {locales} from 'tacotranslate';

const LocaleSelector = ({initialLocale}) => {
	const router = useRouter();
	const [currentInput, setCurrentInput] = useState(initialLocale);

	const handleChange = useCallback(
		(event) => {
			const locale = event.target.value;
			setCurrentInput(locale);
			document.cookie = `NEXT_LOCALE=${locale.toLowerCase()}; Max-Age=31560000; SameSite=Lax; Path=/;`;

			router.push(router.pathname, router.pathname, {
				locale: locale.toLowerCase(),
			});
		},
		[router]
	);

	return (
		<select value={currentInput} onChange={handleChange}>
			{locales.map(([locale, name]) => (
				<option key={locale} value={locale}>
					{name}
				</option>
			))}
		</select>
	);
};

export default LocaleSelector;
