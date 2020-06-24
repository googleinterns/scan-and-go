declare const window: any;

// Grab a handle to our microapps javascript library
export const microapps = window.microapps;

// Grab handle to google client js API
export const google = window.google;

// Detect if our app is running from within an iframe
// On a normal site, the window.parent variable will
// reference itself. However, within the microapps environment
// window will be the iframe and window.parent will not be visible
export const isWeb = window === window.parent;

// Enable debugging on web by default
export const isDebug = false || isWeb;
