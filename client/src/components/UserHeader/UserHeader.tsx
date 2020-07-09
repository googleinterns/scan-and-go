import React, { useEffect, useState } from "react";
import { User } from "src/interfaces";
import { DEFAULT_USER_HEADER_SUBTITLE } from "src/constants";
import { Typography, Paper, Grid, Box, Button } from "@material-ui/core";
import { getDayPeriod } from "src/utils";
import { isDebug } from "src/config";
import Header from "src/components/Header";
import CropFreeIcon from "@material-ui/icons/CropFree";
import SampleStoreQR from "src/img/Sample_StoreQR.png";
import MediaScanner from "src/components/MediaScanner";

function UserHeader({
  user,
  scanStoreQRCallback,
  content,
}: {
  user: User | null;
  scanStoreQRCallback: (storeUrl: string) => void;
  content?: React.ReactElement;
}) {
  const curHour = new Date().getHours();
  const curMin = new Date().getMinutes();
  const [curSec, setCurSec] = useState<number>(0);

  let componentIsMounted = false;

  const updateTime = () => {
    if (componentIsMounted) {
      setCurSec(new Date().getSeconds());
    }
  };

  const padTime = (num: number) => {
    // Ensure our time is output in hh:mm:ss
    // non-constants used will unlikely change
    if (num === 0) return "00";
    return num ? num.toString().padStart(2, "0") : "";
  };

  // This hook runs on start (component mounted)
  useEffect(() => {
    componentIsMounted = true;
    updateTime();
    // returned function callback is called
    // by react when component unmounts
    return () => {
      componentIsMounted = false;
    };
  }, []);

  useEffect(() => {
    // Register time watching
    setInterval(updateTime, 500);
  }, [curSec]);

  //TODO(#132) Usage of '14px' should be abstracted to custom font variant for consistency
  return (
    <div className="UserHeader">
      {user && (
        <Header
          title={
            <Typography variant="h4">
              Good {getDayPeriod()}{" "}
              <Box display="inline" fontWeight="fontWeightBold">
                {user.name}
              </Box>
              !
            </Typography>
          }
          subtitle={
            <Typography variant="subtitle2">
              {DEFAULT_USER_HEADER_SUBTITLE}
            </Typography>
          }
          button={
            <MediaScanner
              button={
                <Button
                  variant="contained"
                  fullWidth={true}
                  color="primary"
                  startIcon={<CropFreeIcon />}
                >
                  Store QR
                </Button>
              }
              resultCallback={scanStoreQRCallback}
              debugFallbackImg={SampleStoreQR}
            />
          }
          content={
            isDebug ? (
              <Typography variant="body1">
                {padTime(curHour)}:{padTime(curMin)}:{padTime(curSec)}
              </Typography>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

export default UserHeader;
