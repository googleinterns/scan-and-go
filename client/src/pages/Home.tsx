import React, { useEffect, useState } from "react";
import logo from "./../logo.svg";
import StoreList from "./../components/StoreList";
import "./../App.css";
import { fetchJson, fetchText } from "./../utils";

// Testing code, will be removed soon
interface UserUI {
  "user-id": string;
  name: string;
}

function Home() {
  // These interact with some global 'React' state? from the import React lib
  // possibly, likely shared across different files in this running app
  // welcome msg hook
  const [welMsg, setWelMsg] = useState("");
  // user query id
  const [userid, setUserid] = useState("");
  // users list?
  const [usersList, setUsersList] = useState<UserUI[]>([]);

  useEffect(() => {
    // fetch POST welcome message
    const fetchMsg = async () => {
      const data = {
        "user-id": userid,
      };
      let msg = await fetchText(data, "/api/");
      if (msg == null) {
        msg = "hello";
      }      
      setWelMsg(msg);
    };

    fetchMsg();
  }, [userid]);


  // Wrapper to issue fetch GET to /api/users/all
  const fetchUsers = async () => {
    const users = await fetchJson(null, "/api/users/all");
    setUsersList(users);
  };

  function TextInputField(props: any) {
    const onTextChange = (e: any) => {
      setUserid(e.target.value);
    };
    return (
      <input
        type="text"
        placeholder={userid ? userid : "...id"}
        onBlur={onTextChange}
      />
    );
  }

  // Html DOM element returned
  // Note style, {} specifies javascript code that gets run into text before whole
  // chunk of data is returned as webpage info (wonder if this two comments mess things up)
  return (
    <div className="Home">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{welMsg}</p>
        <TextInputField />
        <button onClick={fetchUsers}>Fetch Users</button>
        {usersList.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user: UserUI) => (
                <tr key={user["user-id"]}>
                  <td>{user["user-id"]}</td>
                  <td>{user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </header>
      <StoreList />
    </div>
  );
}

export default Home;
