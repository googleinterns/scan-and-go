import React, {useEffect, useState} from 'react'
import StoreHeader from './../components/StoreHeader'
import Divider from '@material-ui/core/Divider'

interface Item {
  barcode: string;
  name: string;
  price: number;
  "merchant-id": string;
}

const emptyItem = (): Item => ({
  barcode: '',
  name: '',
  price: 0.0,
  "merchant-id": ''
})

interface CartItem {
  item: Item;
  quantity: number;
}

const emptyCartItem = (): CartItem => ({
  item: emptyItem(),
  quantity: 0
})

function ScanStore() {
  // Update URL params to find storeID
  const curUrl = window.location.search
  const urlParams = new URLSearchParams(curUrl)
  const storeID = urlParams.get('id')

  // Declare list of items in our cart
  const [shoppingList, setShoppingList] = useState<CartItem[]>([])

  // Get user's cart items
  const getJson = (res: any) => {
    let res_json = res.json()
    if (res.ok){
      return res_json
    }
    else{
      alert(`Response code: ${res.status}`)
      return []
    }
  }

  const catchErr = (err: any) => {
    alert("Error: " + err)
  }

  // fetch list of users
  const fetchCart = async() => {
    let data = {
      'store-id': storeID
    }
    const items = await fetch('/api/cart',{
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
      .then(res => getJson(res))  // returns the res as a json object
      .catch(err => catchErr(err))
    
    // Should do batched fetch with list of barcodes in 1 request-response
    const item_barcodes = items.map((zippedItem: any) => zippedItem.barcode)
    let iData = {
      'store-id': storeID,
      'items': item_barcodes
    }
    const extractedItems = await fetch('/api/item',{
      method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(iData)
      }).then(res => res.json())

    const sList = items.map((zippedItem: any) => {
      let cItem = emptyCartItem()
      cItem.item = extractedItems[zippedItem.barcode]
      cItem.quantity = zippedItem.quantity
      return cItem
    })

    setShoppingList(sList)
  }

  useEffect(() => {
    fetchCart()
  },[])

  // Html DOM element returned
  return (
    <div className="ScanStore">
      <a href="/">back</a>
      <StoreHeader />
      <h1>Scanned Items:</h1>
      <Divider />
      {shoppingList.length > 0 && <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.map((curItem: CartItem) => (
            <tr key={curItem.item.barcode}>
              <td>{curItem.item.name}</td>
              <td>{curItem.item.price}</td>
              <td>{curItem.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  )
}

export default ScanStore
