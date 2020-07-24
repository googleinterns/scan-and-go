import React from "react";
import { isDebug } from "src/config";
import { Typography, Paper, Grid, Box, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "src/constants";

function Header({
  title,
  subtitle,
  button,
  content,
  homeBtn,
}: {
  title: React.ReactElement;
  subtitle?: React.ReactElement;
  button?: React.ReactElement;
  content?: React.ReactElement;
  homeBtn?: boolean;
}) {
  const theme = useTheme();
  const headerTopPadding = theme.spacing(2);
  const headerBotPadding = theme.spacing(4);

  const history = useHistory();
  const returnToHome = () => {
    history.push({
      pathname: HOME_PAGE,
    });
  };

  return (
    <div className="UserHeader">
      <Paper
        elevation={0}
        style={{
          paddingTop: headerTopPadding,
          paddingBottom: headerBotPadding,
        }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={button ? 8 : 12}>
            <Grid container item xs={12} direction="row">
              {homeBtn && (
                <Button
                  onClick={returnToHome}
                  style={{
                    padding: `0 ${theme.spacing(2)}px 0 0 `,
                    minWidth: "0",
                  }}
                >
                  <HomeIcon fontSize="default" />
                </Button>
              )}
              {title}
            </Grid>
            {content && (
              <Grid item xs={12}>
                {content}
              </Grid>
            )}
          </Grid>
          {button && (
            <Grid item xs={4}>
              {button}
            </Grid>
          )}
          {subtitle && (
            <Grid item xs={12}>
              {subtitle}
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
}

export default Header;
