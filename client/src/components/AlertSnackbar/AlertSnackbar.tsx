import React, { useContext } from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { AlertContext } from "src/contexts/AlertContext";

// https://material-ui.com/components/snackbars/#customized-snackbars
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} {...props} />;
}

const AlertSnackbar = () => {
  const { open, setOpen, alertMessage, alertSeverity } = useContext(
    AlertContext
  );
  const anchorOrigin: SnackbarOrigin = {
    vertical: "top",
    horizontal: "center",
  };

  return (
    <Snackbar open={open} anchorOrigin={anchorOrigin}>
      <Alert onClose={() => setOpen(false)} severity={alertSeverity}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
