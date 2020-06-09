import React, { useEffect, useState } from "react";
import StoreList from "./../components/StoreList";
import { fetchJson, fetchText } from "./../utils";
import { TextInputField } from "./../components/Components";
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";

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

  //DEBUG Show UI for user retrieval debugging
  const debug_user = false;

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
    <Container disableGutters={true} className="Home">
      {debug_user && [
        <p>{welMsg}</p>,
        <TextInputField text={userid} callback={setUserid} />,
        <button onClick={fetchUsers}>Fetch Users</button>,
      ]}
      {debug_user && usersList.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.map((user: UserUI) => (
              <TableRow key={user["user-id"]}>
                <TableCell>{user["user-id"]}</TableCell>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <StoreList />
    </Container>
  );
}

export default Home;
