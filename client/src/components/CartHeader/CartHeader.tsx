import React, { useEffect, useState } from "react";
import { Store } from "src/interfaces";
import {
  DEFAULT_CART_HEADER_TITLE,
  DEFAULT_STORE_HEADER_SUBTITLE,
  HOME_PAGE,
} from "src/constants";
import { Typography, Button } from "@material-ui/core";
import Header from "src/components/Header";
import MediaScanner from "src/components/MediaScanner";
import CropFreeIcon from "@material-ui/icons/CropFree";
import SampleBarcode from "src/img/Sample_EAN8.png";

function CartHeader({
  store,
  scanBarcodeCallback,
  content,
}: {
  store: Store;
  scanBarcodeCallback: (barcode: string) => Promise<void>;
  content?: React.ReactElement;
}) {
  return (
    <div className="CartHeader">
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
          <MediaScanner
            button={
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                startIcon={<CropFreeIcon />}
              >
                Scan
              </Button>
            }
            resultCallback={scanBarcodeCallback}
            debugFallbackImg={SampleBarcode}
          />
        }
        content={content}
        homeBtn={true}
      />
    </div>
  );
}

export default CartHeader;
