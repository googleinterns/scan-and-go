import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Cart from "src/components/Cart";
import { CartItem } from "src/interfaces";
import { urlGetParam } from "src/utils";
declare const window: any;

function Receipt(props: any) {
  // Update URL params to find storeID
  const orderID = urlGetParam("id");
  const contents = props.location.state ? props.location.state.contents : null;

  return (
    <div className="Receipt">
      <a href="/home">back</a>
      <p>Order [{orderID}] Confimed!</p>
      <h3>Receipt:</h3>
      {contents && <Cart contents={contents} collapse={true} />}
    </div>
  );
}

export default withRouter(Receipt);
