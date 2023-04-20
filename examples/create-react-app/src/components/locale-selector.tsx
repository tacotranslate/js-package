import React, {useCallback, type ChangeEvent} from 'react';
import {type Locale, locales} from 'tacotranslate';
import {useLocale} from 'tacotranslate/react';

type LocaleSelectorProperties = {
	options: Locale[];
	onChange: (locale: string) => void;
};

export default function LocaleSelector({
	options,
	onChange,
}: LocaleSelectorProperties) {
	const locale = useLocale();
	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			onChange(event.target.value);
		},
		[onChange]
	);

	return (
		<select value={locale} onChange={handleChange}>
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
