This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# ScanAndGo Development Project

Open-source 2020 Google Internship project. ScanAndGo is a Spot-as-a-service app within the larger Google Pay app that allows for users to scan barcodes within registered stores for quick checkout without queuing. View the [webapp](https://scan-and-go-for-gpay.an.r.appspot.com/).

## Development

### Prerequisites

1. [Node js v10](https://nodejs.org/en/download/) or recommended with a node version manager [nvm](https://github.com/nvm-sh/nvm)
2. Npm with node or install [Yarn](https://yarnpkg.com/getting-started/install)

#### First-time set-up

1. cd `/client`
2. Install project dependencies by running `yarn install .`
3. Obtain keys for required environment variables specified in `/client/env_template`
   and store it in .env file. This file or any keys should not be checked in.
4. cd `/server`
5. Install project dependencies by running `yarn install .`

### Front-end Server (React)

Run `yarn dev` from `/client` directory. This runs `react-scripts start` and watches folder for changes, updating automatically.

### Back-end Server (Express)

Run `yarn dev` from `/server` directory. This runs `nodemon server.js --watch controllers/ --watch routers/` which starts the express server while watching for changes in the `/server/controllers` and `/server/routers` directory, restarting the server when changes are detected.

Alternatively when developing for front-end, we can just do `yarn start &` to run the express server in the background.

**Development Note:** We start the express server on port:3143 and proxy unknown requests received by front-end to this port. See [`/client/package.json:26`](https://github.com/devYaoYH/scan-and-go/blob/b8569d4fadd267bca7737bde8a597a6a2fd31eaa/client/package.json#L26) where we configure the proxy for the react front-end to `http://127.0.0.1:3143` for local development communication between client and server processes.

## AppEngine Deployment

After setup of [gcloud-SDK](https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu), run `gcloud app deploy` in subdirectories `/client` and `/server`. **Note that `/client` needs to be built first with `yarn build`**

With this, we will deploy client front-end react app to default service and back-end express app to api service. This is configured in `app.yaml` within `/client` and `/server` directories.

### Routing (_initial setup only_)

On project root directory, run `gcloud app deploy dispatch.yaml` to ensure we re-route all requests to `*/api/*` to our api appengine service which is running our express server.

## Testing Framework

Both the `/client` and `/server` NodeJS projects are configured to run test suites with Jest.

### Server Testing

In addition to Jest, the server requires **supertest** and **@firebase/testing** together with an emulated Cloud Firestore running on our local development environment.

The firebase CLI to run our emulator can be easily installed with `yarn global add firebase-tools` or `npm install -g firebase-tools`. Afterwhich, we require a valid Java Runtime Environment installed to run the Firebase emulator. It is suggested to install `openjdk-11-jdk` on linux machines with `sudo apt-get install default-jdk`.

Finally, we can start our emulator prior to running any tests with:

```
firebase emulators:start --only firestore
```

And test with `yarn test`. In `/server/package.json`, we define a pretest script to wipe our emulated database before each run of test to ensure we clean.

**Server Test Steps:**

1. `firebase emulators:start --only firestore`
2. `yarn test`
   - Automatically runs `yarn pretest` first: `curl -X DELETE "http://localhost:8080/emulator/v1/projects/scan-and-go-for-gpay/databases/(default)/documents"`
   - `NODE_ENV=\"test\" jest`

**Note:** Our `firestore.js` module automatically detects which handle to grab based on the environment variable: `NODE_END`. When this is `"test"`, we load up the `emulatedFirestore.js` module rather than use the live Firestore variable (connecting to actual Cloud Firestore DB).
