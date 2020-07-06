import React, { createContext, useState, useReducer } from "react";
import { Color } from "@material-ui/lab/Alert";

interface AlertContextIface {
  open: boolean;
  setOpen: (open: boolean) => void;
  alertSeverity: Color;
  setAlertSeverity: (severity: Color) => void;
  alertMessage: string;
  setAlertMessage: (message: string) => void;
}

export const AlertContext = createContext<AlertContextIface>({
  open: false,
  setOpen: (open: boolean) => {},
  alertSeverity: "info",
  setAlertSeverity: (severity: Color) => {},
  alertMessage: "",
  setAlertMessage: (message: string) => {},
});

export const AlertContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<Color>("info");
  const [alertMessage, setAlertMessage] = useState<string>("");

  return (
    <AlertContext.Provider
      value={{
        open,
        setOpen,
        alertSeverity,
        setAlertSeverity,
        alertMessage,
        setAlertMessage,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
