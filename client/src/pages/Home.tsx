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
import { API, USERS_ALL_API, DEFAULT_WELCOME_MSG, ID_PLACEHOLDER, DEFAULT_INPUT_TYPE } from "../constants";

// Testing code, will be removed soon
interface UserUI {
  "user-id": string;
  name: string;
}

function Home() {
  const [welMsg, setWelMsg] = useState("");
  const [userid, setUserid] = useState("");
  const [usersList, setUsersList] = useState<UserUI[]>([]);

  //DEBUG Show UI for user retrieval debugging
  const debug_user = false;

  useEffect(() => {
    // fetch POST welcome message
    const fetchMsg = async () => {
      const data = {
        "user-id": userid,
      };
      let msg = await fetchText(data, API);
      if (!msg) {
        msg = DEFAULT_WELCOME_MSG;
      }      
      setWelMsg(msg);
    };

    fetchMsg();
  }, [userid]);


  // Wrapper to issue fetch GET to /api/users/all
  const fetchUsers = async () => {
    const users = await fetchJson(null, USERS_ALL_API);
    setUsersList(users);
  };

  function TextInputField(props: any) {
    const onTextChange = (e: any) => {
      setUserid(e.target.value);
    };
    return (
      <input
        type={DEFAULT_INPUT_TYPE}
        placeholder={userid ? userid : ID_PLACEHOLDER}
        onBlur={onTextChange}
      />
    );
  }

  return (
    <Container className="Home">
      {debug_user && [
        <p>{welMsg}</p>,
        <TextInputField text={userid} setState={setUserid} />,
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
