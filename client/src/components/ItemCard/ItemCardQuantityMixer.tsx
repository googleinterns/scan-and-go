import React from "react";
import { Fab, Typography, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ErrorTheme } from "src/theme";

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
    <MuiThemeProvider theme={ErrorTheme}>
      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ padding: theme.spacing(1) }}
      >
        <Grid item>
          <Fab color="primary" id="inc" onClick={increaseCounter} size="small">
            <AddIcon />
          </Fab>
        </Grid>
        <Grid item>
          <Typography
            variant="h5"
            style={{
              marginLeft: theme.spacing(2),
              marginRight: theme.spacing(2),
            }}
          >
            {quantity}
          </Typography>
        </Grid>
        <Grid item color="error">
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
