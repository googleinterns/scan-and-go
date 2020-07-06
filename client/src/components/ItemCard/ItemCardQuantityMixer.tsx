import React from "react";
import { Fab, Typography, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { LightErrorTheme } from "src/theme";

function ItemCardQuantityMixer({
  quantity,
  updateQuantity,
}: {
  quantity: number;
  updateQuantity: (quantity: number) => void;
}) {
  const theme = useTheme();

  const increaseCounter = () => {
    updateQuantity(quantity + 1);
  };

  const decreaseCounter = () => {
    updateQuantity(quantity - 1);
  };

  return (
    <MuiThemeProvider theme={LightErrorTheme}>
      <Grid container direction="row" justify="flex-end">
        <Grid item>
          <Fab color="primary" id="inc" onClick={increaseCounter} size="small">
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
          >
            <RemoveIcon />
          </Fab>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}

export default ItemCardQuantityMixer;
