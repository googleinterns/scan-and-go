import React, { useEffect, useState } from "react";
import { Store } from "src/interfaces";
import { GEO_PRECISION_DIGITS, PLACEHOLDER_STORE_MEDIA } from "src/constants";
import { Box, Typography, Paper, Grid } from "@material-ui/core";
import { useTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { StoreStatusTheme } from "src/theme";
import { isDebug } from "src/config";
import { parseRawAddressNewlines } from "src/utils";
import { getStoreRedirectUrl } from "src/pages/Actions";
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
    redirect(getStoreRedirectUrl(store["store-id"], store["merchant-id"]));
  };

  return (
    <MediaInfoCard
      media={store.media ? store.media : PLACEHOLDER_STORE_MEDIA}
      mediaVariant="circle"
      title={
        <Typography
          variant="subtitle1"
          display="block"
          noWrap={true}
          style={{
            maxWidth: "100%",
            display: "inline-block",
            textOverflow: "ellipsis",
          }}
        >
          <Box
            display="inline"
            fontWeight="fontWeightBold"
            style={{ textOverflow: "ellipsis" }}
          >
            {store.name}
          </Box>
        </Typography>
      }
      content={
        <Grid
          container
          item
          xs
          direction="row"
          justify="space-between"
          wrap="nowrap"
          style={{ maxHeight: "100%" }}
        >
          <Grid item style={{ alignSelf: "flex-start" }}>
            {store.vicinity &&
              parseRawAddressNewlines(store.vicinity).map(
                (text: string, i: number) => (
                  <Typography
                    key={`detail-${store["store-id"]}-${i}`}
                    variant="body2"
                    color="secondary"
                    style={{ fontWeight: "normal", margin: "-5% 0 -5% 0" }}
                  >
                    {text}
                  </Typography>
                )
              )}
          </Grid>
          <Grid item style={{ alignSelf: "flex-end" }}>
            <MuiThemeProvider theme={StoreStatusTheme}>
              {store.opening_hours?.open_now ? (
                <Typography
                  variant="body2"
                  align="right"
                  color={"primary"}
                  style={{ fontWeight: "bold" }}
                >
                  Open
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  align="right"
                  color={"secondary"}
                  style={{ fontWeight: "bold" }}
                >
                  Closed
                </Typography>
              )}
            </MuiThemeProvider>
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
