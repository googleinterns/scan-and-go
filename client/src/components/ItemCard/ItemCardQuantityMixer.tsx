import React from "react";
import { Fab, Typography, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { InverseAppTheme } from "src/theme";

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
    <MuiThemeProvider theme={InverseAppTheme}>
      <Grid container direction="row" justify="flex-end">
        <Grid item>
          <Fab
            color="secondary"
            id="inc"
            onClick={increaseCounter}
            size="small"
            disabled={disabled}
          >
            <AddIcon />
          </Fab>
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
          <Fab
            color="secondary"
            id="dec"
            onClick={decreaseCounter}
            size="small"
            disabled={disabled}
          >
            <RemoveIcon />
          </Fab>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}

export default ItemCardQuantityMixer;
