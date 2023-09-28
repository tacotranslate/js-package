import {type NextRequest} from 'next/server';
import {middleware as tacoTranslateMiddleware} from 'tacotranslate/next';
import tacoTranslate from '@/utilities/tacotranslate';

export const config = {
	matcher: ['/((?!api|_next|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
	return tacoTranslateMiddleware(tacoTranslate, request);
}
