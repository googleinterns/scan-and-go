import React, { useEffect, useState } from "react";
import logo from "./../img/logo.svg";
import StoreList from "./../components/StoreList";
import "./../css/App.css";
import { fetchJson, fetchText } from "./../utils";
import { TextInputField } from "./../components/Components";

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

  // fetch POST welcome message
  const fetchMsg = async () => {
    // annonymous function that is async
    let data = {
      "user-id": userid,
    };
    fetchText(data, "/api/", fetchMsgCallback);
  };

  // Action after returning from POST req to /api/
  const fetchMsgCallback = (text: any) => {
    if (text == null) {
      setWelMsg("hello");
    } else {
      setWelMsg(text);
    }
  };

  // Wrapper to issue fetch GET to /api/users/all
  const fetchUsers = async () => {
    fetchJson(null, "/api/users/all", fetchUsersCallback);
  };

  // Action after retrieval of users from GET call
  const fetchUsersCallback = (users: any) => {
    setUsersList(users);
  };

  // useEffect runs on rendered elements changing DOM update
  // thus, here we update upon every visual refresh
  //Yiheng: I think a better model can be used here to reduce api calls
  useEffect(() => {
    fetchMsg();
  });

  // Html DOM element returned
  // Note style, {} specifies javascript code that gets run into text before whole
  // chunk of data is returned as webpage info (wonder if this two comments mess things up)
  return (
    <div className="Home">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{welMsg}</p>
        <TextInputField text={userid} callback={setUserid} />
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
        <StoreList />
      </header>
    </div>
  );
}

export default Home;
