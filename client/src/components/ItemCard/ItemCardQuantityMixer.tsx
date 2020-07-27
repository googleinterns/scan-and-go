import React from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme } from "@material-ui/core/styles";

function ItemCardQuantityMixer({
  quantity,
  updateQuantity,
  disabled = false,
}: {
  quantity: number;
  updateQuantity: (quantity: number) => void;
  disabled?: boolean;
}) {
  const theme = useTheme();

  const increaseCounter = () => {
    updateQuantity(quantity + 1);
  };

  const decreaseCounter = () => {
    updateQuantity(quantity - 1);
  };

  return (
    <Grid container direction="row" justify="flex-end" alignItems="center">
      <Grid item>
        <Button
          color="secondary"
          id="dec"
          onClick={decreaseCounter}
          size="small"
          disabled={disabled}
          style={{
            borderRadius: 50,
            color: "black",
            padding: 0,
            minWidth: "fit-content",
          }}
          variant="outlined"
        >
          <RemoveIcon />
        </Button>
      </Grid>
      <Grid item>
        <Typography
          variant="h5"
          align="center"
          style={{
            minWidth: "5vw",
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          {quantity}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          id="inc"
          onClick={increaseCounter}
          size="small"
          disabled={disabled}
          style={{
            borderRadius: 50,
            color: "black",
            padding: 0,
            minWidth: "fit-content",
          }}
          variant="outlined"
        >
          <AddIcon />
        </Button>
      </Grid>
    </Grid>
  );
}

export default ItemCardQuantityMixer;
