import React, {useState, useCallback, type ChangeEvent} from 'react';
import {useRouter} from 'next/router';
import {locales} from 'tacotranslate';

type LocaleSelectorProperties = {
	initialLocale: string;
};

function LocaleSelector({initialLocale}: LocaleSelectorProperties) {
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
			{locales.map(([locale, name]) => (
				<option key={locale} value={locale}>
					{name}
				</option>
			))}
		</select>
	);
}

export default LocaleSelector;
