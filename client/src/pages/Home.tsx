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
    <Container className="Home">
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
