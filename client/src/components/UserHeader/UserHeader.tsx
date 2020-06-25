import React, { useEffect, useState } from "react";
import { User } from "src/interfaces";
import { DEFAULT_WELCOME_MSG } from "src/constants";
import { Typography, Paper, Grid, Box, Button } from "@material-ui/core";
import { getDayPeriod } from "src/utils";
import { isDebug } from "src/config";

function UserHeader({ user }: { user: User | null }) {
  const curHour = new Date().getHours();
  const curMin = new Date().getMinutes();
  const [curSec, setCurSec] = useState();

  const updateTime = () => {
    setCurSec(new Date().getSeconds());
  };

  const padTime = (num: number) => {
    // Ensure our time is output in hh:mm:ss
    // non-constants used will unlikely change
    if (num === 0) return "00";
    return num ? num.toString().padStart(2, "0") : "";
  };

  useEffect(() => {
    updateTime();
  }, []);

  useEffect(() => {
    // Register time watching
    setInterval(updateTime, 500);
  }, [curSec]);

  return (
    <div className="UserHeader">
      {user && (
        <Paper elevation={0}>
          <Grid container direction="row" justify="space-between">
            <Grid item xs={8}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  Good {getDayPeriod()}{" "}
                  <Box display="inline" fontWeight="fontWeightBold">
                    {user.name}
                  </Box>
                  !
                </Typography>
              </Grid>
              {isDebug && (
                <Grid item xs={12}>
                  <Typography variant="body1">
                    {padTime(curHour)}:{padTime(curMin)}:{padTime(curSec)}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth={true} variant="contained" color="primary">
                Shopping List
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default UserHeader;
