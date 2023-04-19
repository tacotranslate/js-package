import React from 'react';
import {ImageResponse} from '@vercel/og';
import {type NextRequest} from 'next/server';
import {createEntry, getEntryFromTranslations} from 'tacotranslate';
import tacoTranslate from '../../utilities/tacotranslate';

export const config = {
	runtime: 'edge',
};

export default async function handler(request: NextRequest) {
	const {searchParams} = new URL(request.url);
	const locale = searchParams.get('locale') ?? 'en';
	const title = 'Next.js with [[[pages/]]] folder example';
	const description = 'Localize your apps from and to any language today!';

	const entries = [
		createEntry({string: title}),
		createEntry({string: description}),
	];

	const translations = await tacoTranslate
		.getTranslations({
			origin: `tacotranslate.com/api/opengraph`,
			locale,
			entries,
		})
		.catch((error) => {
			console.error(error);
			return {};
		});

	return new ImageResponse(
		(
			<div
				style={{
					background: 'linear-gradient(180deg, #5C33FF 0%, #8C1DE4 70%)',
					width: '100%',
					height: '100%',
					display: 'flex',
					padding: '60px',
					textAlign: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					boxSizing: 'border-box',
				}}
			>
				<div
					lang={locale}
					style={{
						flex: 1,
						display: 'flex',
						textAlign: 'center',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: 42,
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
						{getEntryFromTranslations(entries[0], translations)}
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
						{getEntryFromTranslations(entries[1], translations)}
					</div>
				</div>

				<img
					src="https://tacotranslate.com/static/logotype.png"
					alt="TacoTranslate"
					width="539"
					height="55"
					style={{width: `${539 * 0.65}px`, height: `${55 * 0.65}px`}}
				/>
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
