'use client';

import NextLink, {type LinkProps} from 'next/link';
import React, {type ForwardedRef, forwardRef, type ReactNode} from 'react';
import {useLocale} from '../../react';

function getHref(href: string | LinkProps['href']) {
	return (typeof href === 'string' ? href : href.pathname) ?? '';
}

function Link(
	{href, ...rest}: LinkProps & {readonly children: ReactNode},
	reference: ForwardedRef<HTMLAnchorElement>
) {
	const locale = useLocale();
	const patchedHref =
		!locale || locale === process.env.TACOTRANSLATE_PROJECT_LOCALE
			? getHref(href)
			: `/${locale}${getHref(href)}`;

	return <NextLink {...rest} ref={reference} href={patchedHref} />;
}

export default forwardRef(Link);
