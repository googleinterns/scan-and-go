import React from "react";
import { Grid, Typography } from "@material-ui/core";

function ReceiptHeader() {
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      style={{ borderBottom: "2px solid" }}
    >
      <Grid item xs={3}>
        <Typography variant="body1">Item</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1">Price</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1">Subtotal</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" align="center" noWrap={true}>
          Quantity
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ReceiptHeader;
