# TacoTranslate in a Next.js app with the App Router

See this example live at [nextjs-app-router-demo.tacotranslate.com](https://nextjs-app-router-demo.tacotranslate.com).

## Features

- Automatic cutting-edge AI powered translation to 75 languages
- Server side rendered pages and translations
- Locale selector with automatic client-side translation fetching
- Dynamic OpenGraph image per page with automatic translations
- Built-in support for RTL languages
- No JSON files or variable naming: Source strings within the code

## Running this example

First, replace `TACOTRANSLATE_SECRET_API_KEY`, `TACOTRANSLATE_PUBLIC_API_KEY`, and `TACOTRNSLATE_WEBSITE_URL` in `.env` with your own. Then, run these commands:

```
npm install
npm run dev
```

Follow the instructions in the terminal.

## API keys

You can create API keys for your project at [tacotranslate.com](https://tacotranslate.com/). Each project should have **at least two**: One for development & preview environments with `read/write` permissions, and one for production with `read` permissions. Your backend (if protected) could always use a secret API key.

You’ll find an example of backend usage inside [`app/api/opengraph/route.tsx`](app/api/opengraph/route.tsx), that also demonstrates how to set up dynamic OpenGraph images with on-demand localization.
