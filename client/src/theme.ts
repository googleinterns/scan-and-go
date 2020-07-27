import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";

const PRIMARY_COLOR = "#66BE64";
const SECONDARY_COLOR = "#909090";
const SUCCESS_COLOR = "#00E676";
const ERROR_COLOR = "#F44336";

const WHITE_TEXT_COLOR = "white";
const WHITE_BACKGROUND_COLOR = "#FFFFFF";

// https://material-ui.com/customization/theming/#createmuitheme-options-args-theme
// Customize our app-specific theme
const AppTheme = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      contrastText: WHITE_TEXT_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: WHITE_TEXT_COLOR,
    },
  },
  typography: {
    body2: {
      fontWeight: 800,
    },
    subtitle2: {
      color: SECONDARY_COLOR,
    },
  },
});

// Moving 'success' and 'error' into primary/secondary to allow
// usage with majority of components (typescript + @material-ui constrain)
export const ErrorTheme = createMuiTheme({
  palette: {
    primary: {
      main: SUCCESS_COLOR,
      contrastText: WHITE_TEXT_COLOR,
    },
    secondary: {
      main: ERROR_COLOR,
      contrastText: WHITE_TEXT_COLOR,
    },
  },
});

// Inverse of ErrorTheme with text-color and backgrouund color inverted
export const InverseErrorTheme = createMuiTheme({
  palette: {
    primary: {
      main: WHITE_BACKGROUND_COLOR,
      contrastText: SUCCESS_COLOR,
    },
    secondary: {
      main: WHITE_BACKGROUND_COLOR,
      contrastText: ERROR_COLOR,
    },
  },
});

// UI config variables
export const themeConfig = {
  max_card_height: 120,
  default_card_img_height: "20vw",
};

export default responsiveFontSizes(AppTheme);
