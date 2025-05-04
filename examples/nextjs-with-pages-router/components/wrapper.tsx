import React, {type ReactNode} from 'react';

export default function Wrapper({children}: {readonly children: ReactNode}) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flex: 1,
				fontFamily: 'sans-serif',
			}}
		>
			<div
				style={{
					maxWidth: '600px',
					margin: 'auto',
					padding: '14px 14px 28px 14px',
				}}
			>
				{children}
			</div>
		</div>
	);
}
