'use client';

import React, {useState, useCallback, type ChangeEvent} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {type Locale, locales} from 'tacotranslate';

type LocaleSelectorProperties = {
	initialLocale?: Locale;
	options: Locale[];
};

export default function LocaleSelector({
	initialLocale,
	options,
}: LocaleSelectorProperties) {
	const router = useRouter();
	const pathname = usePathname();
	const [currentInput, setCurrentInput] = useState(initialLocale);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const locale = event.target.value;
			setCurrentInput(locale);
			document.cookie = `locale=${locale.toLowerCase()}; Max-Age=31560000; SameSite=Lax; Path=/;`;

			if (pathname) {
				router.push(`/${locale}/${pathname.split('/').slice(2).join('/')}`);
			}
		},
		[pathname, router]
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
