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

// fetch response from url
const fetchRes = async (reqType: string, data: any, url: string) => {
  if (data == null) {
    return await fetch(url);
  } else {
    return await fetch(url, {
      method: reqType,
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
  }
};

// fetch json response from url
export const fetchJson = async (reqType: string, data: any, url: string) => {
  return fetchRes(reqType, data, url)
    .then((res) => getJson(res))
    .catch((err) => catchErr(err));
};

// fetch text response from url
export const fetchText = async (reqType: string, data: any, url: string) => {
  return fetchRes(reqType, data, url)
    .then((res) => getText(res))
    .catch((err) => catchErr(err));
};

// Extract Identity Token from getIdentity() call response
export const extractIdentityToken = (response: any) => {
  return JSON.parse(atob(response.split(".")[1]));
};
