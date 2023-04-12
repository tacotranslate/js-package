import React, {type ReactNode} from 'react';

type WrapperProperties = {
	children: ReactNode;
};

function Wrapper({children}: WrapperProperties) {
	return (
		<div style={{width: '100%', height: '100%', display: 'flex', flex: 1}}>
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

export default Wrapper;