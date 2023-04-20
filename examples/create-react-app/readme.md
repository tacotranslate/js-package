# TacoTranslate in a client side React app

See this example live at [nextjs-pages-folder-demo.tacotranslate.com](https://nextjs-pages-folder-demo.tacotranslate.com).

## Running this example

First, replace `TACOTRANSLATE_SECRET_API_KEY`, `TACOTRANSLATE_PUBLIC_API_KEY`, and `WEBSITE_URL` in `.env` with your own. Then, run these commands:

```
npm install
npm run dev
```

Follow the instructions in the terminal.

## API keys

You can create API keys for your project at [tacotranslate.com](https://tacotranslate.com/). Each project should have **at least two**: One for development & preview environments with `read/write` permissions, and one for production with `read` permissions. Your backend (if protected) could always use a secret API key.

You’ll find an example of backend usage inside [`/pages/api/opengraph.tsx`](/pages/api/opengraph.tsx), that also demonstrates how to set up dynamic OpenGraph images with on-demand localization.
