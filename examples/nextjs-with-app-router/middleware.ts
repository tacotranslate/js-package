import {type NextRequest, NextResponse} from 'next/server';
import tacoTranslate from '@/utilities/tacotranslate';

export const config = {
	matcher: ['/((?!api|_next|favicon.ico).*)'],
};

function pathnameHasLocale(pathname: string, locale: string) {
	return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
}

export async function middleware(request: NextRequest) {
	const {pathname} = request.nextUrl;
	const locales = await tacoTranslate.getLocales().catch((error) => {
		console.error(error);
		return [process.env.TACOTRANSLATE_DEFAULT_LOCALE];
	});

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
				name: 'locale',
				value: projectLocale,
				path: '/',
				sameSite: 'lax',
				maxAge: 31_560_000,
			});

			return response;
		}
	} else {
		if (request.cookies.has('locale')) {
			const preferredLocale = request.cookies.get('locale')?.value;

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
