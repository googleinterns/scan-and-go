import React, { useEffect, useState } from "react";
import { Grid, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme } from "@material-ui/core/styles";
import { themeConfig } from "src/theme";
import MediaInfoCard from "src/components/MediaInfoCard";
import "src/css/animation.css";

function ItemPlaceholder() {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  return (
    <MediaInfoCard
      media=""
      mediaVariant="rounded"
      title={
        <div
          className="idle-gradient"
          style={{
            width: "40%",
            height: "5vw",
            maxHeight: themeConfig.max_card_height * 0.15,
            margin: themeSpacing,
          }}
        />
      }
      content={
        <div
          className="idle-gradient"
          style={{
            width: "60%",
            height: "10vw",
            maxHeight: themeConfig.max_card_height * 0.6,
            margin: themeSpacing,
          }}
        />
      }
      rightColumn={
        <Grid item container style={{ height: "100%" }} direction="column">
          <Grid item xs container direction="column">
            <Grid item>
              <div
                className="idle-gradient"
                style={{
                  float: "right",
                  width: "100%",
                  height: "5vw",
                  maxHeight: themeConfig.max_card_height * 0.15,
                  marginBottom: themeSpacing,
                }}
              />
            </Grid>
            <Grid item>
              <div
                className="idle-gradient"
                style={{
                  float: "right",
                  width: "100%",
                  height: "5vw",
                  maxHeight: themeConfig.max_card_height * 0.15,
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" justify="flex-end">
              <Grid item>
                <Fab disabled={true} size="small">
                  <AddIcon />
                </Fab>
              </Grid>
              <Grid item>
                <div
                  style={{
                    width: "5vw",
                    height: "5vw",
                    marginLeft: theme.spacing(2),
                    marginRight: theme.spacing(2),
                  }}
                />
              </Grid>
              <Grid item>
                <Fab disabled={true} size="small">
                  <RemoveIcon />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      placeholder={true}
    />
  );
}

export default ItemPlaceholder;
