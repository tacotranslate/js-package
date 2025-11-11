import React, {useState, useCallback, type ChangeEvent} from 'react';
import {useRouter} from 'next/router';
import {getLocaleData, type Locale} from 'tacotranslate';

type LocaleSelectorProperties = {
	readonly initialLocale?: Locale;
	readonly options: Locale[];
};

export default function LocaleSelector({
	initialLocale,
	options,
}: LocaleSelectorProperties) {
	const router = useRouter();
	const [currentInput, setCurrentInput] = useState(initialLocale);
	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const value = event.target.value;
			const locale = value.toLowerCase();
			setCurrentInput(value);
			document.cookie = `NEXT_LOCALE=${locale}; Max-Age=31560000; SameSite=Lax; Path=/;`;
			void router.push(router.asPath, undefined, {locale});
		},
		[router]
	);

	return (
		<select value={currentInput} onChange={handleChange}>
			{options.map((code) => {
				const data = getLocaleData(code);

				if (data) {
					return (
						<option key={data.locale} value={data.locale}>
							{data.language}
						</option>
					);
				}

				return null;
			})}
		</select>
	);
}
