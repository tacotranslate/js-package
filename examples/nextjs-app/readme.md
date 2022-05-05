# TacoTranslate on an incrementally statically regenerated page through Next.js

## Running this example

First, replace the `apiKey` in `createTacoTranslateClient` with your own. Then, ensure the `path` in `getStaticProps` corresponds with the path URL. Finally, run these commands:

```
npm install
npm run dev
```

### `pages/index.jsx`

Bare-bones setup that showcases how to create a React application that can translate text automatically with TacoTranslate.

### `pages/with-locale-selector.jsx`

The same example as above, however this example includes a locale selector, enabling users to override the default `outputLocale` by setting the `NEXT_LOCALE` cookie.

## What languages are supported?

Any language inside `locales.json` is supported. To stop supporting a language, simply remove it from `locales.json`, and it will be disallowed.
