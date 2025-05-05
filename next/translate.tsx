import React, {useCallback, type MouseEvent} from 'react';
import {useRouter} from 'next/router';
import {
	Translate as ReactTranslate,
	type TranslateComponentProperties,
} from '../react';

export function findAnchorParent(target: HTMLElement) {
	let parent: ParentNode | undefined = target;

	while (parent) {
		if ((parent as HTMLElement)?.tagName === 'A') {
			return parent as HTMLAnchorElement;
		}

		parent = parent.parentNode ?? undefined;
	}

	return undefined;
}

/** `<Translate>` component for use with Next.js in the Pages Router.
 * Automatically adds the current locale to the `href` of clicked anchor elements, when used inside a string.
 * @example <Translate string={`<a href="/page">Hello!</a>`}/>
 */
export default function Translate({
	...properties
}: TranslateComponentProperties) {
	const router = useRouter();
	const handleClick = useCallback(
		(event: MouseEvent) => {
			if (
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.button !== 0
			) {
				return;
			}

			const anchor = findAnchorParent(event.target as HTMLElement);

			if (anchor?.getAttribute('href')?.startsWith('/')) {
				event.preventDefault();
				void router.push(anchor.href);
			}
		},
		[router]
	);

	return <ReactTranslate {...properties} onClick={handleClick} />;
}
