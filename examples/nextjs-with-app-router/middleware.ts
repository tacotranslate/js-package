import {type NextRequest} from 'next/server';
import {middleware as tacoTranslateMiddleware} from 'tacotranslate/next';
import tacoTranslateClient from '@/tacotranslate-client';

export const config = {
	matcher: [
		'/((?!manifest.webmanifest|sitemap.xml|favicon.ico|opengraph|icon|apple-icon|static|_next).*)',
	],
};

export async function middleware(request: NextRequest) {
	return tacoTranslateMiddleware(tacoTranslateClient, request);
}
