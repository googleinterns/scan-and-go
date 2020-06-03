// Get json from response
const getJson = (res: any) => {
  if (res.ok) {
    let res_json = res.json();
    return res_json;
  } else {
    alert(`Response code: ${res.status}`);
    return null;
  }
};

// Get text from response
const getText = (res: any) => {
  let res_text = res.text();
  if (res.ok) {
    return res_text;
  } else {
    alert(`Response code: ${res.status}`);
    return null;
  }
};

// Alert us to any errors in fetch
const catchErr = (err: any) => {
  alert("Error: " + err);
};

//Yiheng: Some code refactoring can still be done here given the amount of overlap

// fetch json response from url
export const fetchJson = async (data: any, url: string, callback: any) => {
  let responseJson = "";
  if (data == null) {
    responseJson = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    })
      .then((res) => getJson(res))
      .catch((err) => catchErr(err));
  } else {
    responseJson = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })
      .then((res) => getJson(res)) // returns the res as a json object
      .catch((err) => catchErr(err));
  }
  // Only callback if we are given a valid response
  if (responseJson != null) {
    callback(responseJson);
  }
};

// fetch text response from url
export const fetchText = async (data: any, url: string, callback: any) => {
  let responseJson = "";
  if (data == null) {
    responseJson = await fetch(url)
      .then((res) => getText(res))
      .catch((err) => catchErr(err));
  } else {
    responseJson = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })
      .then((res) => getText(res)) // returns the res as a json object
      .catch((err) => catchErr(err));
  }
  // Only callback if we are given a valid response
  if (responseJson != null) {
    callback(responseJson);
  }
};
