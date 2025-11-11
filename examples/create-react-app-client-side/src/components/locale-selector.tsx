import React, {useCallback, type ChangeEvent} from 'react';
import {getLocaleData, type Locale} from 'tacotranslate';
import {useLocale} from 'tacotranslate/react';

type LocaleSelectorProperties = {
	readonly options: Locale[];
	readonly onChange: (locale: string) => void;
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
