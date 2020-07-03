import React, { useEffect, useState } from "react";
import { Container, Slide } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/core/styles";

function AlertToast({
  content,
  style,
  closeCallback,
}: {
  content: React.ReactElement | string;
  style: {
    severity: "error" | "success" | "info" | "warning" | undefined;
    variant?: "outlined" | "standard" | "filled" | undefined;
    icon?: React.ReactElement;
  };
  closeCallback?: () => void;
}) {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  const theme = useTheme();

  const alertDismissCallback = () => {
    setShowAlert(false);
    if (closeCallback) closeCallback();
  };

  return (
    <Slide
      direction="up"
      in={showAlert}
      style={{ margin: theme.spacing(4) }}
      mountOnEnter
      unmountOnExit
    >
      <Alert
        className="AlertToast"
        onClose={alertDismissCallback}
        severity={style.severity}
        variant={style.variant}
        icon={style.icon}
      >
        {content}
      </Alert>
    </Slide>
  );
}

export default AlertToast;
