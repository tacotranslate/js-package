import {type NextRequest, NextResponse} from 'next/server';
import {type TacoTranslateClient} from '..';

function pathnameHasLocale(pathname: string, locale: string) {
	return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
}

type MiddlewareOptions = {
	/** @default 'locale' */
	localeCookieName?: string;
	/** How often the list of project locales are updated, in milliseconds
	 * @default 60_000 (1 minute) */
	localeCacheLifetime?: number;
};

let locales: string[];
let localesCacheTimestamp = 0;

async function cachedGetLocales(
	client: TacoTranslateClient,
	options?: Pick<MiddlewareOptions, 'localeCacheLifetime'>
) {
	const currentTimestamp = Date.now();

	if (
		locales &&
		localesCacheTimestamp + (options?.localeCacheLifetime ?? 60_000) >
			currentTimestamp
	) {
		return locales;
	}

	localesCacheTimestamp = currentTimestamp;
	locales = await client.getLocales();

	return locales;
}

export async function middleware(
	client: TacoTranslateClient,
	request: NextRequest,
	options?: MiddlewareOptions
) {
	const {pathname, search} = request.nextUrl;
	const locales = await cachedGetLocales(client, {
		localeCacheLifetime: options?.localeCacheLifetime,
	});

	const localeCookieName = options?.localeCookieName ?? 'locale';
	const [projectLocale] = locales;

	if (locales.some((locale) => pathnameHasLocale(pathname, locale))) {
		if (pathnameHasLocale(pathname, projectLocale)) {
			const pathnameWithoutLocale = `/${pathname
				.split('/')
				.slice(2)
				.join('/')}${search}`;

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
					new URL(`/${preferredLocale}${pathname}${search}`, request.url)
				);
			}
		}

		return NextResponse.rewrite(
			new URL(`/${projectLocale}${pathname}${search}`, request.url)
		);
	}
}
