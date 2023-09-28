import React, {type ReactNode} from 'react';

type WrapperProperties = {
	readonly children: ReactNode;
};

export default function Wrapper({children}: WrapperProperties) {
	return (
		<main style={{width: '100%', height: '100%', display: 'flex', flex: 1}}>
			<div
				style={{
					maxWidth: '600px',
					margin: 'auto',
					padding: '14px 14px 28px 14px',
				}}
			>
				{children}
			</div>
		</main>
	);
}
