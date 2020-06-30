import React, { useEffect, useState } from "react";
import { Store } from "src/interfaces";
import {
  DEFAULT_CART_HEADER_TITLE,
  DEFAULT_STORE_HEADER_SUBTITLE,
} from "src/constants";
import { Typography, Button } from "@material-ui/core";
import Header from "src/components/Header";

function CartHeader({
  store,
  scanBarcodeCallback,
}: {
  store: Store;
  scanBarcodeCallback: () => Promise<void>;
}) {
  return (
    <div className="CartHeader">
      {store && (
        <Header
          title={
            <Typography variant="h4">{DEFAULT_CART_HEADER_TITLE}</Typography>
          }
          subtitle={
            <Typography variant="subtitle2">
              {DEFAULT_STORE_HEADER_SUBTITLE} {store.name}
            </Typography>
          }
          button={
            <Button
              fullWidth={true}
              variant="contained"
              color="primary"
              style={{ fontSize: "14px" }}
              onClick={scanBarcodeCallback}
            >
              Scan Barcode
            </Button>
          }
        />
      )}
    </div>
  );
}

export default CartHeader;
