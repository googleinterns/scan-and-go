import React, {useEffect, useState} from 'react'
//const microapps = require('./../microapps.js')

interface Store {
  "store-id": string;
  name: string;
  distance: number;
  latitude: number;
  longtitude: number;
}

function StoreList() {
  // Current Location (from API call)
  const [userCoords, setUserCoords] = useState<[number,number]>([0.0,0.0])
  // List of stores (from Database)
  const [storeList, setStoreList] = useState<Store[]>([])

  function grabLoc() {
    /*if (window.location !== window.parent.location){
      microapps.getCurrentLocation().then((loc:any) => {
        setUserCoords([loc['latitude'],loc['longitude']])
      })
    }*/
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(callbackLoc, errorbackLoc)
    }
  }

  function callbackLoc(position: any){
    setUserCoords([position.coords.latitude, position.coords.longitude])
  }

  function errorbackLoc(error: any){
    alert(error)
  }

  // fetch user location
  grabLoc()

  const getStores = (res: any) => {
    let res_json = res.json()
    if (res.ok){
      return res_json
    }
    else{
      alert(`Response code: ${res.status}`)
      return []
    }
  }

  const catchStores = (err: any) => {
    alert("Error: " + err)
  }

  // fetch list of users
  const fetchStores = async() => {
    // Update location
    grabLoc() //blocking? race on userCoords update?

    let data = {
      'distance': 10000,
      'latitude': userCoords[0],
      'longitude': userCoords[1]
    }
    const stores = await fetch('/api/stores',{
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })
      .then(res => getStores(res))  // returns the res as a json object
      .catch(err => catchStores(err))
    setStoreList(stores) // Is there something like runtime errors if json is not properly formatted?
  }

  function LocationTrack(props: any) {
    return (
      <h3>[{userCoords[0]},{userCoords[1]}]</h3>
    )
  }

  // Html DOM element returned
  return (
    <div className="StoreList">
      <LocationTrack />
      <button><a href="/store?id=WPANCUD-1">Test Store</a></button>
      <button onClick={fetchStores}>Lookup Stores</button>
      {storeList.length > 0 && <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {storeList.map((store: Store) => (
            <tr key={store["store-id"]}>
              <td>{store["store-id"]}</td>
              <td><a href={"/store?id=" + store["store-id"]}>{store.name}</a></td>
              <td>{store.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  )
}

export default StoreList
