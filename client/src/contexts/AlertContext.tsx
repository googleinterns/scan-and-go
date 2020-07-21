import React, { createContext, useState, useReducer } from "react";
import { Color } from "@material-ui/lab/Alert";

interface AlertContextIface {
  open: boolean;
  alertSeverity: Color;
  alertMessage: string;
  setOpen: (open: boolean) => void;
  setAlert: (severity: Color, message: string) => void;
}

export const AlertContext = createContext<AlertContextIface>({
  open: false,
  alertSeverity: "info",
  alertMessage: "",
  setOpen: (open: boolean) => {},
  setAlert: (severity: Color, message: string) => {},
});

export const AlertContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<Color>("info");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const setAlert = (severity: Color, message: string) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setOpen(true);
  };

  return (
    <AlertContext.Provider
      value={{
        open,
        alertSeverity,
        alertMessage,
        setOpen,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
