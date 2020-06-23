import { createMuiTheme } from "@material-ui/core/styles";

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
});

export default AppTheme;
