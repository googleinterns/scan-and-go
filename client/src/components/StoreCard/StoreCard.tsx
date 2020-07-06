import React, { useEffect, useState } from "react";
import { Store } from "src/interfaces";
import { GEO_PRECISION_DIGITS, PLACEHOLDER_STORE_MEDIA } from "src/constants";
import { Box, Typography, Paper, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { isDebug } from "src/config";
import { parseRawAddressNewlines } from "src/utils";
import MediaInfoCard from "src/components/MediaInfoCard";

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
    <MediaInfoCard
      media={store.media ? store.media : PLACEHOLDER_STORE_MEDIA}
      mediaVariant="circle"
      title={
        <Typography component="span" variant="subtitle1">
          <Box display="inline" fontWeight="fontWeightBold">
            {store.name}
          </Box>
        </Typography>
      }
      content={
        <div>
          {store.vicinity &&
            parseRawAddressNewlines(store.vicinity).map((text) => (
              <Typography variant="body1">{text}</Typography>
            ))}
        </div>
      }
      rightColumn={
        <Grid
          item
          container
          style={{ height: "100%" }}
          justify="flex-end"
          direction="column"
        >
          <Grid item>
            <Typography variant="body2" align="right">
              {store.business_status
                ? store.business_status
                : "Schrödinger's Store"}
            </Typography>
          </Grid>
        </Grid>
      }
      onClick={redirectWrapper}
      elevation={1}
      style={{
        cursor: "pointer",
      }}
    />
  );
}

export default StoreCard;
