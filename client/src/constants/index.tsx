export const isDebug = false;

export declare const window: any;

// Grab a handle to our microapps javascript library
export const microapps = window.microapps;

// Detect if our app is running from within an iframe
// if so, then we are *likely* in the microapps environment
// and will render as such.
export const isWeb = window.location == window.parent.location;
