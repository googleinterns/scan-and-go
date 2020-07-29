import React from "react";
import { Paper, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { themeConfig } from "src/theme";
import InfoCardMedia from "./InfoCardMedia";
import "src/css/animation.css";

// Media Card max height
export const MAX_CARD_HEIGHT = 100;

function MediaInfoCard({
  media,
  mediaVariant,
  mediaCallback,
  title,
  content,
  rightColumn,
  elevation,
  onClick,
  style,
  placeholder,
}: {
  media: string;
  mediaVariant?: "rounded" | "circle";
  mediaCallback?: () => void;
  title: React.ReactElement;
  content: React.ReactElement;
  rightColumn?: React.ReactElement;
  elevation?: number;
  onClick?: () => void;
  style?: any;
  placeholder?: boolean;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  return (
    <Paper
      elevation={elevation ? elevation : 0}
      onClick={onClick}
      style={Object.assign(
        {
          marginTop: themeSpacing,
          padding: themeSpacing,
        },
        style ? { ...style } : {}
      )}
      className={placeholder ? "animate-flicker" : undefined}
    >
      <Grid container wrap="nowrap">
        <Grid item>
          <InfoCardMedia
            media={media}
            onClick={mediaCallback}
            maxHeight={themeConfig.max_card_height}
            variant={mediaVariant}
            placeholder={placeholder}
          />
        </Grid>
        <Grid
          item
          xs
          container
          direction="row"
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          <Grid
            item
            xs
            container
            direction="column"
            style={{ maxWidth: "100%" }}
            align-items="stretch"
          >
            <Grid item style={{ maxWidth: "100%" }}>
              {title}
            </Grid>
            <Grid
              container
              item
              xs
              style={{ maxWidth: "100%", overflow: "hidden" }}
            >
              {content}
            </Grid>
          </Grid>
          {rightColumn && <Grid item>{rightColumn}</Grid>}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MediaInfoCard;
