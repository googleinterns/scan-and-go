import React, {useEffect, useState} from 'react'

interface Store {
  "store-id": string;
  name: string;
  distance: number;
  latitude: number;
  longtitude: number;
}

const emptyStore = (): Store => ({
    "store-id": '',
    name: '',
    distance: 0.0,
    latitude: 0.0,
    longtitude: 0.0,
});

function StoreUI() {
  // Update the current store we're in
  const [curStore, setCurStore] = useState<Store>(emptyStore())
  // Update URL params
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);

  const getStore = (res: any) => {
    let res_json = res.json()
    if (res.ok){
      return res_json
    }
    else{
      alert(`Response code: ${res.status}`)
      return []
    }
  }

  const catchStore = (err: any) => {
    alert("Error: " + err)
  }

  // fetch list of users
  const fetchStore = async() => {
    let data = {
      'store-id': urlParams.get('id')
    }
    const stores = await fetch('/api/store',{
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
      .then(res => getStore(res))  // returns the res as a json object
      .catch(err => catchStore(err))
    setCurStore(stores) // Is there something like runtime errors if json is not properly formatted?
  }

  class LocationTrack extends React.Component {
    constructor(props: any){
      super(props)
    }
    componentDidMount(){
      alert("mounting")
      fetchStore()
    }
    render() {
      return (
        <h3>[{curStore['latitude']},{curStore['longtitude']}]</h3>
      )
    }
  }

  // Html DOM element returned
  return (
    <div className="StoreUI">
      <LocationTrack />
      {curStore.hasOwnProperty('store-id') && <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr key={curStore["store-id"]}>
            <td>{curStore["store-id"]}</td>
            <td>curStore.name</td>
          </tr>
        </tbody>
      </table>}
    </div>
  )
}

export default StoreUI
