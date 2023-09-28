'use client';

import NextLink, {type LinkProps} from 'next/link';
import React, {useMemo, type ReactNode} from 'react';
import {useLocale} from '../../react';

function getHref(href: string | LinkProps['href']) {
	return (typeof href === 'string' ? href : href.pathname) ?? '';
}

export default function Link({
	href,
	...rest
}: LinkProps & {readonly children: ReactNode}) {
	const locale = useLocale();
	const patchedHref = useMemo(
		() =>
			!locale || locale === process.env.TACOTRANSLATE_PROJECT_LOCALE
				? getHref(href)
				: `/${locale}${getHref(href)}`,
		[locale, href]
	);

	return <NextLink {...rest} href={patchedHref} />;
}
