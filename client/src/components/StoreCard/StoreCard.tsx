import React, { useEffect, useState } from "react";
import { Store } from "src/interfaces";
import { GEO_PRECISION_DIGITS } from "src/constants";
import { Box, Typography, Paper, Card, Grid, Divider } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

function StoreCard({
  store,
  redirect,
}: {
  store: Store;
  redirect: (url: string) => void;
}) {
  // Grab the globally-defined AppTheme via useTheme hook
  const theme = useTheme();
  // .spacing([1...4]) retrieves 4 non-zero preset spacing
  const themeSpacing = theme.spacing(1);

  const redirectWrapper = () => {
    redirect("?id=" + store["store-id"] + "&mid=" + store["merchant-id"]);
  };

  return (
    <Card
      onClick={redirectWrapper}
      style={{
        cursor: "pointer",
        marginTop: themeSpacing,
        padding: themeSpacing,
      }}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={4}>
          Media
        </Grid>
        <Grid item xs={8}>
          <Typography variant="subtitle1">
            <Box display="inline" fontWeight="fontWeightBold">
              {store.name}
            </Box>
          </Typography>
          <Typography variant="body1">
            [{store.latitude.toFixed(GEO_PRECISION_DIGITS)},
            {store.longitude.toFixed(GEO_PRECISION_DIGITS)}]
          </Typography>
          <Typography variant="body2" align="right">
            <Box display="inline" fontWeight="fontWeightBold">
              Schrödinger's Store
            </Box>
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

export default StoreCard;
