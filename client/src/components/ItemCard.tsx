import React, { useEffect, useState } from "react";
import { Typography, Paper, Grid, Divider } from "@material-ui/core";

function ItemCard(props: any) {
  const increaseCounter = () => {
    props.callback(props.idx, props.item.quantity + 1);
  };

  const decreaseCounter = () => {
    props.callback(props.idx, props.item.quantity - 1);
  };

  return (
    <Paper elevation={0}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={3}>
          <p>Media</p>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{props.item.item.name}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1">
            ${props.item.item.price.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1">
            ${(props.item.item.price * props.item.quantity).toFixed(2)}
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={2}
          spacing={0}
          direction="column"
          alignItems="center"
        >
          <Grid item xs={12}>
            <button onClick={increaseCounter}>Plus</button>
          </Grid>
          <Grid item xs={12}>
            <p>{props.item.quantity}</p>
          </Grid>
          <Grid item xs={12}>
            <button onClick={decreaseCounter}>Minus</button>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </Paper>
  );
}

export default ItemCard;
