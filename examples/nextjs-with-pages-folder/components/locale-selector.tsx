import React, {useState, useCallback, type ChangeEvent} from 'react';
import {useRouter} from 'next/router';
import {type Locale, locales} from 'tacotranslate';

type LocaleSelectorProperties = {
	initialLocale?: Locale;
	options: Locale[];
};

function LocaleSelector({initialLocale, options}: LocaleSelectorProperties) {
	const router = useRouter();
	const [currentInput, setCurrentInput] = useState(initialLocale);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const locale = event.target.value;
			setCurrentInput(locale);
			document.cookie = `NEXT_LOCALE=${locale.toLowerCase()}; Max-Age=31560000; SameSite=Lax; Path=/;`;

			void router.push(router.asPath, undefined, {
				locale: locale.toLowerCase(),
			});
		},
		[router]
	);

	return (
		<select value={currentInput} onChange={handleChange}>
			{options.map((code) => {
				const pair = locales.find((index) => index[0] === code);

				if (pair) {
					const [locale, language] = pair;

					return (
						<option key={locale} value={locale}>
							{language}
						</option>
					);
				}

				return null;
			})}
		</select>
	);
}

export default LocaleSelector;
