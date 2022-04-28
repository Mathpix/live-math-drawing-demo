# Getting started

To run this sample code, you must first get a Mathpix OCR API key. This can be done here: 

https://accounts.mathpix.com

Then, put your `app_id` and `app_key` into .env file (https://github.com/Mathpix/live-math-drawing-demo/blob/master/.env.sample):

```
export app_id=YOUR_APP_ID
export app_key=YOUR_APP_KEY
```

Then:

```
npm install
source .env
npm start
```

Then, open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# API docs 

This demo is build with the following 2 API endpoints:
- getting app tokens which is done on the server side: https://docs.mathpix.com/#using-client-side-app-tokens
- making digital ink requests to the Mathpix OCR API from client side JS: https://docs.mathpix.com/#request-parameters-2
