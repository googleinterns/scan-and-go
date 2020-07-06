import React, { useEffect, useState } from "react";
import { Store } from "src/interfaces";
import { GEO_PRECISION_DIGITS, PLACEHOLDER_STORE_MEDIA } from "src/constants";
import { Box, Typography, Card, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { isDebug } from "src/config";
import { parseRawAddressNewlines } from "src/utils";
import StoreCardMedia from "./StoreCardMedia";
import StorePlaceholder from "src/components/StorePlaceholder";
import "src/css/animation.css";

// Specific Constants for this component
export const MAX_CARD_HEIGHT = 100;

function StoreCard({
  store,
  redirect,
}: {
  store: Store | null;
  redirect: (url: string) => void;
}) {
  // Grab the globally-defined AppTheme via useTheme hook
  const theme = useTheme();
  // .spacing([1...4]) retrieves 4 non-zero preset spacing
  const themeSpacing = theme.spacing(1);

  // Logic in StoreCard to render placeholder
  // component when given a 'null'-loading store value
  if (!store) {
    return <StorePlaceholder />;
  }

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
      className="animate-gradient"
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <StoreCardMedia
            media={store.media ? store.media : PLACEHOLDER_STORE_MEDIA}
            height={MAX_CARD_HEIGHT}
          />
        </Grid>
        <Grid item xs container direction="column" alignItems="stretch">
          <Grid item xs>
            <Typography component="span" variant="subtitle1">
              <Box display="inline" fontWeight="fontWeightBold">
                {store.name}
              </Box>
            </Typography>
            {isDebug && (
              <Typography variant="body1">
                [{store.latitude.toFixed(GEO_PRECISION_DIGITS)},
                {store.longitude.toFixed(GEO_PRECISION_DIGITS)}]
              </Typography>
            )}
            {store.vicinity &&
              parseRawAddressNewlines(store.vicinity).map((text) => (
                <Typography variant="body1">{text}</Typography>
              ))}
          </Grid>
          <Grid item xs>
            <Typography variant="body2" align="right">
              {store.business_status
                ? store.business_status
                : "Schrödinger's Store"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

export default StoreCard;
