import React, { useEffect, useState } from "react";
import StoreList from "./../components/StoreList";
import { fetchJson, fetchText } from "./../utils";
import { TextInputField } from "./../components/Components";
import {
  Container,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { API, USER_LIST_API, DEFAULT_WELCOME_MSG } from "../constants";
import { isDebug } from "../config";

// Testing code, will be removed soon
interface UserUI {
  "user-id": string;
  name: string;
}

function Home() {
  const [welMsg, setWelMsg] = useState("");
  const [userid, setUserid] = useState("");
  const [usersList, setUsersList] = useState<UserUI[]>([]);

  useEffect(() => {
    // fetch POST welcome message
    const fetchMsg = async () => {
      const data = {
        "user-id": userid,
      };
      let msg = await fetchText("POST", data, API);
      if (!msg) {
        msg = DEFAULT_WELCOME_MSG;
      }
      setWelMsg(msg);
    };

    fetchMsg();
  }, [userid]);

  // Wrapper to issue fetch GET to /api/users/all
  const fetchUsers = async () => {
    const users = await fetchJson("GET", null, USER_LIST_API);
    setUsersList(users);
  };

  return (
    <Container disableGutters={true} className="Home">
      {isDebug && [
        <p>{welMsg}</p>,
        <TextInputField text={userid} setState={setUserid} />,
        <button onClick={fetchUsers}>Fetch Users</button>,
      ]}
      {isDebug && usersList.length > 0 && (
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
