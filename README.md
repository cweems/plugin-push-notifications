# Push Notifications for Twilio Flex

Disclaimer: this plugin is an independent project that is not supported by Twilio.

The Push Notifications Flex Plugin allows you to create desktop notifications for agents using Twilio Flex. Notifications occur when a task is reserved for an agent.

Works in all browsers that support the Push API: https://caniuse.com/#feat=push-api

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards install the dependencies by running `npm install`:

```bash
git clone https://github.com/cweems/plugin-push-notifications.git
cd plugin-push-notifications

# If you use npm
npm install
```

## Push API Options
Add these to the `options` object in `showLocalNotification`.

Visual Options
"body": "<String>",
"icon": "<URL String>",
"image": "<URL String>",
"badge": "<URL String>",
"vibrate": "<Array of Integers>",
"sound": "<URL String>",
"dir": "<String of 'auto' | 'ltr' | 'rtl'>",

Behavioural Options
"tag": "<String>",
"data": "<Anything>",
"requireInteraction": "<boolean>",
"renotify": "<Boolean>",
"silent": "<Boolean>",

Visual & Behavioural Options
"actions": "<Array of Strings>",

Information Option. No visual affect.
"timestamp": "<Long>"

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Once you are happy with your plugin, you have to bundle it, in order to deply it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex which would provide them globally.
