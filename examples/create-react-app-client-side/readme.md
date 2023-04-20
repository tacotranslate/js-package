# TacoTranslate in a client side rendered Create React App

See this example live at [create-react-app-client-side-demo.tacotranslate.com](https://create-react-app-client-side-demo.tacotranslate.com).

## Running this example

First, replace `REACT_APP_WEBSITE_URL` and `REACT_APP_TACOTRANSLATE_PROJECT_LOCALE` inside `.env`. Then, in `.env.development`, replace `REACT_APP_TACOTRANSLATE_SECRET_API_KEY` with your secret API key. After that, replace `REACT_APP_TACOTRANSLATE_PUBLIC_API_KEY` in `.env.production` with your public API key – and then finally, run these commands:

```
npm install
npm run start
```

## API keys

You can create API keys for your project at [tacotranslate.com](https://tacotranslate.com/). Each project should have **at least two**: One for development & preview environments with `read/write` permissions, and one for production with `read` permissions. Your backend (if protected) could always use a secret API key.
