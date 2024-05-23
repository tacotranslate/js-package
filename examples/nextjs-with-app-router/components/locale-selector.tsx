'use client';

import React, {useState, useCallback, type ChangeEvent, useMemo} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {locales} from 'tacotranslate';
import {useLocale} from 'tacotranslate/react';

export default function LocaleSelector() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const [currentInput, setCurrentInput] = useState(locale);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const updatedLocale = event.target.value;
			setCurrentInput(updatedLocale);
			document.cookie = `locale=${updatedLocale.toLowerCase()}; Max-Age=31560000; SameSite=Lax; Path=/;`;

			let currentPathname = pathname;

			if (locale) {
				if (currentPathname.startsWith(`/${locale}/`)) {
					currentPathname = `/${pathname.split('/').slice(2).join('/')}`;
				} else if (currentPathname === `/${locale}`) {
					currentPathname = '/';
				}
			}

			router.push(
				updatedLocale === process.env.TACOTRANSLATE_PROJECT_LOCALE
					? currentPathname
					: `/${updatedLocale}${currentPathname}`
			);
		},
		[pathname, locale, router]
	);

	const options = useMemo(() => {
		try {
			return (
				JSON.parse(process.env.TACOTRANSLATE_PROJECT_LOCALES) as string[]
			).map((locale) => locale);
		} catch (error) {
			console.error(error);
			return [process.env.TACOTRANSLATE_PROJECT_LOCALE];
		}
	}, []);

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
