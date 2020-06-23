import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import StoreList from "src/components/StoreList";
import TextInputField from "src/components/TextInputField";
import UserHeader from "src/components/UserHeader";
import DebugBar from "./DebugBar";
import { User, emptyUser, Store } from "src/interfaces";
import { getUserInfo } from "src/pages/Actions";
import { Container } from "@material-ui/core";
import { isDebug } from "src/config";

function Home(props: any) {
  const [userid, setUserid] = useState("");
  const [curUser, setCurUser] = useState<User>(emptyUser());
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    // Initially set user based on passed props
    if (props.location.state) {
      setCurUser(props.location.state.user);
      setStores(props.location.state.stores);
    }
  }, []);

  useEffect(() => {
    if (userid) {
      getUserInfo(userid).then((res) => setCurUser(res));
    }
  }, [userid]);

  return (
    <Container disableGutters={false} className="Home">
      {isDebug && <TextInputField text={userid} setState={setUserid} />}
      <UserHeader user={curUser} />
      <DebugBar />
      <StoreList stores={stores} />
    </Container>
  );
}

export default withRouter(Home);
