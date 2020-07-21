import React from "react";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

function Page({
  header,
  content,
  footer,
  className,
}: {
  header: React.ReactElement;
  content: React.ReactElement;
  footer: React.ReactElement;
  className?: string;
}) {
  const theme = useTheme();
  return (
    <div className={className ? className : "Page"} style={{ height: "100%" }}>
      <Grid
        container
        direction="column"
        style={{ height: "100%" }}
        alignItems="stretch"
      >
        <Grid item>{header}</Grid>
        <Grid
          container
          item
          xs
          style={{ overflowY: "scroll", overflowX: "hidden" }}
        >
          {content}
        </Grid>
        <Grid item style={{ marginBottom: theme.spacing(2) }}>
          {footer}
        </Grid>
      </Grid>
    </div>
  );
}

export default Page;
