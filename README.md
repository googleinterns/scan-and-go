This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# ScanAndGo Development Project

Open-source 2020 Google Internship project. ScanAndGo is a Spot-as-a-service app within the larger Google Pay app that allows for users to scan barcodes within registered stores for quick checkout without queuing. View the [webapp](https://scan-and-go-for-gpay.an.r.appspot.com/).

## Development

### Front-end Server (React)

Run `yarn dev` from `/client` directory. This runs `react-scripts start` and watches folder for changes, updating automatically.

### Back-end Server (Express)

Run `yarn dev` from `/server` directory. This runs `nodemon server.js --watch controllers/ --watch routers/` which starts the express server while watching for changes in the `/server/controllers` and `/server/routers` directory, restarting the server when changes are detected.

Alternatively when developing for front-end, we can just do `yarn start &` to run the express server in the background.

**Development Note:** We start the express server on port:3143 and proxy unknown requests received by front-end to this port. See `/client/package.json:26` where we configure the proxy for the react front-end to `http://127.0.0.1:3143` for local development communication between client and server processes.

## AppEngine Deployment

After setup of [gcloud-SDK](https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu), run `gcloud app deploy` in subdirectories `/client` and `/server`. **Note that `/client` needs to be built first with `yarn build`**

With this, we will deploy client front-end react app to default service and back-end express app to api service. This is configured in `app.yaml` within `/client` and `/server` directories.

### Routing (_initial setup only_)

On project root directory, run `gcloud app deploy dispatch.yaml` to ensure we re-route all requests to `*/api/*` to our api appengine service which is running our express server.
