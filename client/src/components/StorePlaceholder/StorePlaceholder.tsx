import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Card, Grid } from "@material-ui/core";
import "src/css/animation.css";
import { MAX_CARD_HEIGHT } from "src/components/StoreCard/StoreCard";

function StorePlaceholder() {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);
  return (
    <Card
      className="animate-flicker"
      style={{
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
        <Grid item>
          <div
            className="idle-gradient"
            style={{
              borderRadius: "50%",
              margin: themeSpacing,
              height: "15vw",
              width: "15vw",
              maxHeight: MAX_CARD_HEIGHT,
              maxWidth: MAX_CARD_HEIGHT,
            }}
          />
        </Grid>
        <Grid item xs>
          <div
            className="idle-gradient"
            style={{
              width: "60%",
              height: "5vw",
              maxHeight: MAX_CARD_HEIGHT * 0.15,
              margin: themeSpacing,
            }}
          />
          <div
            className="idle-gradient"
            style={{
              width: "30%",
              height: "8vw",
              maxHeight: MAX_CARD_HEIGHT * 0.6,
              margin: themeSpacing,
            }}
          />
          <div
            className="idle-gradient"
            style={{
              width: "20%",
              height: "2vw",
              maxHeight: MAX_CARD_HEIGHT * 0.1,
              marginTop: -themeSpacing,
              float: "right",
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

export default StorePlaceholder;
