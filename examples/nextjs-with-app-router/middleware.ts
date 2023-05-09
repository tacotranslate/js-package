import {type NextRequest, NextResponse} from 'next/server';
import tacoTranslate from '@/utilities/tacotranslate';

export const config = {
	matcher: ['/((?!api|_next|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
	const {pathname} = request.nextUrl;
	const locales = await tacoTranslate.getLocales().catch((error) => {
		console.error(error);
		return [process.env.TACOTRANSLATE_DEFAULT_LOCALE];
	});

	if (
		!locales.some(
			(locale) =>
				pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
		)
	) {
		let [locale] = locales;

		if (request.cookies.has('locale')) {
			const localeCookieValue = request.cookies.get('locale')?.value;

			if (localeCookieValue && locales.includes(localeCookieValue)) {
				locale = localeCookieValue;
			}
		}

		return NextResponse.redirect(
			new URL(`/${locale}/${pathname}`, request.url)
		);
	}
}
