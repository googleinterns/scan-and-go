import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import GoogleSansFont from "./css/GoogleSansFont.css";

const PRIMARY_COLOR = "#66BE64";
const SECONDARY_COLOR = "#909090";
const SUCCESS_COLOR = "#00E676";
const ERROR_COLOR = "#F44336";

const NEUTRAL_PRIMARY_COLOR = "#2196f3";

const WHITE_TEXT_COLOR = "white";
const WHITE_BACKGROUND_COLOR = "#FFFFFF";

// https://material-ui.com/customization/theming/#createmuitheme-options-args-theme
// Customize our app-specific theme
const AppTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [GoogleSansFont],
      },
    },
  },
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
    fontFamily: "Google Sans",
    body1: {
      fontWeight: 800,
    },
    body2: {
      fontWeight: 400,
    },
    subtitle2: {
      color: SECONDARY_COLOR,
    },
  },
});

export const InverseAppTheme = createMuiTheme({
  palette: {
    primary: {
      main: WHITE_BACKGROUND_COLOR,
      contrastText: PRIMARY_COLOR,
    },
    secondary: {
      main: WHITE_BACKGROUND_COLOR,
      contrastText: SECONDARY_COLOR,
    },
  },
});

export const NeutralAppTheme = createMuiTheme({
  palette: {
    primary: {
      main: NEUTRAL_PRIMARY_COLOR,
      contrastText: WHITE_TEXT_COLOR,
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
  default_card_img_minHeight: "80px",
};

export default responsiveFontSizes(AppTheme);
