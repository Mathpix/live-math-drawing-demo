# Live math drawing demo

A small React app that recognizes handwritten math as you draw it, using the Mathpix
[`v3/strokes`](https://docs.mathpix.com/reference/post-v3-strokes) endpoint with a live stroke session.

# Getting started

To run this sample code, you must first get a Mathpix OCR API key. This can be done here:

https://console.mathpix.com

Then copy `.env.sample` to `.env` and fill in your `app_id` and `app_key`:

```
cp .env.sample .env
```

```
REACT_APP_MATHPIX_API_ID=YOUR_APP_ID
REACT_APP_MATHPIX_API_KEY=YOUR_APP_KEY
```

The `REACT_APP_` prefix is required: Create React App only exposes variables that start with it, and it
reads `.env` on its own, so do not `export` these or `source` the file.

Then:

```
npm install
npm start
```

Then, open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# API docs

This demo is built with the following 2 API endpoints:
- getting an app token, used here to authenticate the drawing requests and to open a stroke session: https://docs.mathpix.com/reference/authentication#using-client-side-app-tokens
- making digital ink requests to the Mathpix OCR API from client side JS: https://docs.mathpix.com/reference/post-v3-strokes

Note that this demo requests the app token from the browser, so your API key ends up in the client
bundle. That is fine for running the demo locally, but in production you should request the app token
from your own server and hand only the token to the client — that is what app tokens are for.
