'use client';

import React from 'react';
import {Translate} from 'tacotranslate/react';
import Link from 'tacotranslate/next/link';
import LocaleSelector from '@/components/locale-selector';

export default function Page() {
	return (
		<div
			style={{
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
			}}
		>
			<LocaleSelector />

			<div>
				<Translate string="Hello, world!" />{' '}
				<Link href="/">
					<Translate string="Go back." />
				</Link>
			</div>
		</div>
	);
}
