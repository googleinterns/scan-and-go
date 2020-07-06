import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { themeConfig } from "src/theme";
import MediaInfoCard from "src/components/MediaInfoCard";
import "src/css/animation.css";

function StorePlaceholder() {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  return (
    <MediaInfoCard
      media=""
      mediaVariant="circle"
      title={
        <div
          className="idle-gradient"
          style={{
            width: "80%",
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
            height: "8vw",
            maxHeight: themeConfig.max_card_height * 0.6,
            margin: themeSpacing,
          }}
        />
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
            <div
              className="idle-gradient"
              style={{
                width: "15vw",
                height: "2vw",
                maxHeight: themeConfig.max_card_height * 0.1,
              }}
            />
          </Grid>
        </Grid>
      }
      placeholder={true}
      elevation={1}
    />
  );
}

export default StorePlaceholder;
