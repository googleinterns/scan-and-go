This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# ScanAndGo Development Project
Open-source 2020 Google Internship project. ScanAndGo is a Spot-as-a-service app within the larger Google Pay app that allows for users to scan barcodes within registered stores for quick checkout without queuing. View the [webapp](https://scan-and-go-for-gpay.an.r.appspot.com/).

## Front-end Server (React)

`cd client && yarn build`

`yarn start` - Serves built files as static pages

## Back-end Server (Express)

`cd server && yarn start`

Starts express server running

## AppEngine Deployment

After setup of gcloud-SDK, run `gcloud app deploy` in subdirectories `/client` and `/server`

We will deploy client front-end react app to default service and back-end express app to api service.

## Development

`cd server && yarn start` - Start express server first

`cd client && yarn dev` - Start react frontend
