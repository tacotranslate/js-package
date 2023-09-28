import {headers} from 'next/headers';
import {type NextRequest, NextResponse} from 'next/server';
import {type TacoTranslateClient} from '..';

export function getWebsiteUrl() {
	const headersMap = headers();
	const forwardedProtocol = headersMap.get('x-forwarded-proto') ?? 'http';

	let url = `${forwardedProtocol}://localhost:3000`;

	if (process.env.TACOTRANSLATE_WEBSITE_URL) {
		url = `${forwardedProtocol}://${process.env.TACOTRANSLATE_WEBSITE_URL}`;
	} else if (process.env.WEBSITE_URL) {
		url = `${forwardedProtocol}://${process.env.WEBSITE_URL}`;
	} else if (process.env.VERCEL_URL) {
		url = `${forwardedProtocol}://${process.env.VERCEL_URL}`;
	} else {
		const forwardedHost = headersMap.get('x-forwarded-host');

		if (forwardedHost) {
			url = `${forwardedProtocol}://${forwardedHost}`;
		}
	}

	return new URL(url);
}

export function getAbsolutePath() {
	return headers().get('x-invoke-path');
}

export function getAbsoluteOriginPath() {
	const absolutePath = getAbsolutePath();
	return `/${absolutePath ? absolutePath.split('/').slice(2).join('/') : ''}`;
}

export function getDynamicPath() {
	return headers().get('x-invoke-output');
}

export function getDynamicOriginPath() {
	const dynamicPath = getDynamicPath();
	return dynamicPath ? dynamicPath.replace(/^\/\[locale](\/|$)/, '/') : '/';
}

export function getOrigin() {
	return `${getWebsiteUrl().host}${getDynamicOriginPath()}`;
}

function pathnameHasLocale(pathname: string, locale: string) {
	return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
}

type MiddlewareOptions = {
	localeCookieName?: string;
};

export async function middleware(
	client: TacoTranslateClient,
	request: NextRequest,
	options?: MiddlewareOptions
) {
	const {pathname} = request.nextUrl;
	const locales = await client.getLocales().catch((error) => {
		console.error(error);
		return [process.env.TACOTRANSLATE_DEFAULT_LOCALE];
	});

	const localeCookieName = options?.localeCookieName ?? 'locale';
	const [projectLocale] = locales;

	if (locales.some((locale) => pathnameHasLocale(pathname, locale))) {
		if (pathnameHasLocale(pathname, projectLocale)) {
			const pathnameWithoutLocale = `/${pathname
				.split('/')
				.slice(2)
				.join('/')}`;

			const response = NextResponse.redirect(
				new URL(pathnameWithoutLocale, request.url)
			);

			response.cookies.set({
				name: localeCookieName,
				value: projectLocale,
				path: '/',
				sameSite: 'lax',
				maxAge: 31_560_000,
			});

			return response;
		}
	} else {
		if (request.cookies.has(localeCookieName)) {
			const preferredLocale = request.cookies.get(localeCookieName)?.value;

			if (
				preferredLocale &&
				locales.includes(preferredLocale) &&
				preferredLocale !== projectLocale
			) {
				return NextResponse.redirect(
					new URL(`/${preferredLocale}${pathname}`, request.url)
				);
			}
		}

		return NextResponse.rewrite(
			new URL(`/${projectLocale}${pathname}`, request.url)
		);
	}
}
