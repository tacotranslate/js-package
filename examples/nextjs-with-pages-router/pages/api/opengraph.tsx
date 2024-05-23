import React from 'react';
import {ImageResponse} from '@vercel/og';
import {type NextRequest} from 'next/server';
import {
	createEntry,
	isRightToLeftLocaleCode,
	translateEntries,
} from 'tacotranslate';
import tacoTranslate from '../../utilities/tacotranslate';

export const config = {
	runtime: 'edge',
};

const emoji = ['😄', '🥳', '😎', '👍', '🤟'];
const emojiLength = emoji.length;

function getRandomEmoji() {
	return emoji[Math.floor(Math.random() * emojiLength)];
}

export default async function handler(request: NextRequest) {
	const {searchParams} = new URL(request.url);
	const locale =
		searchParams.get('locale') ?? process.env.TACOTRANSLATE_DEFAULT_LOCALE;

	const title = createEntry({
		string: 'Example of Next.js with [[[Pages Router]]] and TacoTranslate',
	});

	const description = createEntry({
		string: 'Localize your apps from and to any language today! {{emoji}}',
	});

	const translations = await translateEntries(
		tacoTranslate,
		{origin: 'opengraph', locale},
		[title, description]
	);

	const isRightToLeft = isRightToLeftLocaleCode(locale);
	const direction = isRightToLeft ? 'right' : 'left';
	const alignment = isRightToLeft ? 'flex-end' : 'flex-start';

	return new ImageResponse(
		(
			<div
				style={{
					background:
						'linear-gradient(180deg, #3502C3 0%, #3502C3 30%, #5305D1 100%)',
					width: '100%',
					height: '100%',
					display: 'flex',
					padding: '60px',
					textAlign: direction,
					alignItems: alignment,
					justifyContent: 'center',
					flexDirection: 'column',
					boxSizing: 'border-box',
					gap: '30px',
				}}
			>
				<img
					src="https://tacotranslate.com/static/logotype.png"
					alt="TacoTranslate"
					width="539"
					height="55"
					style={{width: `${539 * 0.65}px`, height: `${55 * 0.65}px`}}
				/>

				<div
					lang={locale}
					style={{
						flex: 1,
						display: 'flex',
						textAlign: direction,
						alignItems: alignment,
						justifyContent: 'center',
						flexDirection: 'column',
						gap: '46px',
					}}
				>
					<div
						style={{
							fontSize: 60,
							fontWeight: '600',
							lineHeight: '1em',
							letterSpacing: '-0.025em',
							color: '#fff',
						}}
					>
						{translations(title)}
					</div>

					<div
						style={{
							fontSize: 40,
							fontWeight: '400',
							lineHeight: '1em',
							letterSpacing: '-0.025em',
							color: 'rgba(255,255,255,0.9)',
						}}
					>
						{translations(description, {emoji: getRandomEmoji()})}
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 600,
			headers: {
				'cache-control': 'public, s-maxage=600, stale-while-revalidate',
			},
		}
	);
}
