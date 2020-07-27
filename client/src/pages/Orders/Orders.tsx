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
import { AuthContext } from "src/contexts/AuthContext";
declare const window: any;

function Orders(props: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user["user-id"]) {
      getOrders().then((res) => setOrders(res));
    }
  }, [user]);

  return (
    <div className="Orders">
      <a href="/home">back</a>
      <h3 hidden={!!user["user-id"]}>Hello {user.name}</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Merchant ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((order: Order) => {
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
