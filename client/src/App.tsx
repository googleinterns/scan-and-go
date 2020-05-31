import React, {useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'

interface UserUI {
  id: string;
  username: string;
  name: string;
  email: string;
}

function App() {
  // These interact with some global 'React' state? from the import React lib
  // possibly, likely shared across different files in this running app
  // welcome msg hook
  const [welMsg, setWelMsg] = useState('')
  // user query id
  const [userid, setUserid] = useState('')
  // users list?
  const [usersList, setUsersList] = useState<UserUI[]>([])

  // fetch welcome message
  const fetchMsg = async () => {  // annonymous function that is async
    let data = {
      'id': userid
    }
    // Fetch /api
    const msg = await fetch('/api/',{
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
      .then(res => res.status === 200?res.text():"hello")  // same as passing 'res' to a function call
                                // .then(func(res))
                                // function func(res){ return res.text()) }
    setWelMsg(msg)
  }

  const getUsers = (res: any) => {
    let res_json = res.json()
    if (res.ok){
      return res_json
    }
    else{
      alert(`Response code: ${res.status}`)
      return []
    }
  }

  const catchUsers = (err: any) => {
    alert("Error: " + err)
  }

  // fetch list of users
  const fetchUsers = async() => {
    const users = await fetch('/api/users/all') // why the additional /all route?
      .then(res => getUsers(res))  // returns the res as a json object
      .catch(err => catchUsers(err))
    setUsersList(users) // Is there something like runtime errors if json is not properly formatted?
  }

  // useEffect runs on rendered elements changing DOM update
  useEffect(() => { // Named useEffect hooks? -> Likely custom react Hooks
    fetchMsg()
  })  // Means don't run first time loading?

  function TextInputField(props: any) {
    const onTextChange = (e: any) => {
      setUserid(e.target.value)
    }
    return (
      <input type="text" placeholder={userid?userid:'...id'} onBlur={onTextChange}/>
    )
  }
  
  // Html DOM element returned
    // Note style, {} specifies javascript code that gets run into text before whole
    // chunk of data is returned as webpage info (wonder if this two comments mess things up)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{welMsg}</p>
        <TextInputField />
        <button onClick={fetchUsers}>Fetch Users</button>
        {usersList.length > 0 && <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user: UserUI) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </header>
    </div>
  )
}

export default App // Exports the 'App' function as a React DOM component
