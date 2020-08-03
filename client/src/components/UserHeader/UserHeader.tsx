import React, { useEffect, useState } from "react";
import { User } from "src/interfaces";
import {
  DEFAULT_USER_HEADER_SUBTITLE,
  DEFAULT_USER_HEADER_WELCOME,
} from "src/constants";
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
  //TODO(#132) Usage of '14px' should be abstracted to custom font variant for consistency
  return (
    <div className="UserHeader">
      {user && (
        <Header
          title={
            <Typography variant="h3" noWrap={true}>
              {user.name ? "Hey " : ""}
              <Box display="inline" fontWeight="fontWeightBold">
                {user.name ? user.name : DEFAULT_USER_HEADER_WELCOME}
              </Box>
              !
            </Typography>
          }
          subtitle={
            <div>
              <Typography variant="subtitle2" color="secondary" noWrap={true}>
                Good {getDayPeriod()}{" "}
              </Typography>
              <Typography variant="subtitle2" color="secondary" noWrap={true}>
                {DEFAULT_USER_HEADER_SUBTITLE}
              </Typography>
            </div>
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
                  <Typography variant="body2" noWrap={true}>
                    Store QR
                  </Typography>
                </Button>
              }
              resultCallback={scanStoreQRCallback}
              debugFallbackImg={SampleStoreQR}
            />
          }
        />
      )}
    </div>
  );
}

export default UserHeader;
