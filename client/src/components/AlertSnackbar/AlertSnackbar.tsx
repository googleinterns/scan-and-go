import React, { useContext } from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { AlertContext } from "src/contexts/AlertContext";
import { DEFAULT_ALERT_DURATION } from "src/constants";

// https://material-ui.com/components/snackbars/#customized-snackbars
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} {...props} />;
}

const AlertSnackbar = () => {
  const { open, setOpen, alertMessage, alertSeverity } = useContext(
    AlertContext
  );
  const [duration, setDuration] = React.useState<number>(0);
  const anchorOrigin: SnackbarOrigin = {
    vertical: "top",
    horizontal: "center",
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) {
      setDuration(0);
    }
  }, [open]);

  React.useEffect(() => {
    if (open && alertMessage) {
      setDuration(duration + DEFAULT_ALERT_DURATION);
    }
  }, [alertMessage, alertSeverity]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={anchorOrigin}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={alertSeverity}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
