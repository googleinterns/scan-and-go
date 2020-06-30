import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { getOrders } from "../Actions";
import { Order } from "src/interfaces";
import { isWeb } from "src/config";
declare const window: any;

function Orders(props: any) {
  const [userName, setUserName] = useState<string>("");
  const [googleUser, setGoogleUser] = useState<gapi.auth2.GoogleUser>();
  const [orders, setOrders] = useState<Order[]>([]);

  const onSignIn = async (googleUser: gapi.auth2.GoogleUser) => {
    // https://developers.google.com/identity/sign-in/web
    var profile = googleUser.getBasicProfile();
    setUserName(profile.getName());
    setGoogleUser(googleUser);
  };

  useEffect(() => {
    // https://stackoverflow.com/a/59039972/
    if (isWeb) {
      window.gapi.signin2.render("g-signin2", {
        scope: "https://www.googleapis.com/auth/plus.login",
        longtitle: true,
        theme: "dark",
        onsuccess: onSignIn,
      });
    }
  }, []);

  useEffect(() => {
    if (!isWeb || googleUser) {
      getOrders().then((res) => setOrders(res));
    }
  }, [googleUser]);

  return (
    <div className="Orders">
      <a href="/home">back</a>
      <div id="g-signin2" hidden={googleUser != null}></div>
      <h3 hidden={userName == ""}>Hello {userName}</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Merchant ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order: Order) => {
            return (
              <TableRow key={order["order-id"]}>
                <TableCell>{order["order-id"]}</TableCell>
                <TableCell>{order["merchant-id"]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default withRouter(Orders);
