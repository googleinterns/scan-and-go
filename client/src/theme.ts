import { createMuiTheme } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";

// https://material-ui.com/customization/theming/#createmuitheme-options-args-theme
// Customize our app-specific theme
const AppTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#66BE64",
      contrastText: "white",
    },
    secondary: {
      main: "#909090",
      contrastText: "white",
    },
  },
  typography: {
    body2: {
      fontWeight: 800,
    },
    subtitle2: {
      color: "#909090",
    },
  },
});

export const ErrorTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
      contrastText: "#00E676",
    },
    secondary: {
      main: "#FFFFFF",
      contrastText: "#F44336",
    },
  },
});

export default AppTheme;
