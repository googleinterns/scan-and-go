import React, { useEffect, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { getOrders } from "../Actions";
import { Order, emptyUser } from "src/interfaces";
import { isWeb } from "src/config";
import { AuthContext } from "src/contexts/AuthContext";
declare const window: any;

function Orders(props: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, setAuth } = useContext(AuthContext);
  
  const onSignIn = async (googleUser: gapi.auth2.GoogleUser) => {
    // https://developers.google.com/identity/sign-in/web
    var profile = googleUser.getBasicProfile();
    setAuth({ 
      name: profile.getName(),
      "user-id": profile.getId(), 
    });
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
  });

  useEffect(() => {
    if (user !== emptyUser) {
      getOrders().then((res) => setOrders(res));
    }
  }, [user]);

  return (
    <div className="Orders">
      <a href="/home">back</a>
      <div id="g-signin2" hidden={user !== emptyUser}></div>
      <h3 hidden={user === emptyUser}>Hello {user.name}</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Merchant ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.map((order: Order) => {
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
