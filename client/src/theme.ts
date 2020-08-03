import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import GoogleSansFont from "./css/GoogleSansFont.css";

const PRIMARY_COLOR = "#66BE64";
const SECONDARY_COLOR = "#909090";
const SUCCESS_COLOR = "#00E676";
const ERROR_COLOR = "#F44336";

const NEUTRAL_PRIMARY_COLOR = "#000000";
const NEUTRAL_PRIMARY_COLOR_BLUE = "#2196f3";

const WHITE_TEXT_COLOR = "white";
const WHITE_BACKGROUND_COLOR = "#FFFFFF";

const defaultTheme = createMuiTheme({});

// https://material-ui.com/customization/theming/#createmuitheme-options-args-theme
// Customize our app-specific theme
const AppThemeConfig = {
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
  // Note: Use color="secondary" to render grey text
  //       under normal apptheme settings
  typography: {
    fontFamily: "Google Sans",
    // Normal default text
    body1: {},
    // Smaller text size
    body2: {},
    // Bolded versions of body fonts (reduced lineHeight)
    subtitle1: {
      fontWeight: defaultTheme.typography.fontWeightMedium,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: defaultTheme.typography.fontWeightMedium,
      lineHeight: 1.43,
    },
  },
};

// Main Base Theme is created with Config const
const AppTheme = createMuiTheme(AppThemeConfig);

// Alternative derived themes will override base config object
export const InverseAppTheme = createMuiTheme(
  Object.assign({}, AppThemeConfig, {
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
  })
);

export const NeutralAppTheme = createMuiTheme(
  Object.assign({}, AppThemeConfig, {
    palette: {
      primary: {
        main: NEUTRAL_PRIMARY_COLOR,
        contrastText: WHITE_TEXT_COLOR,
      },
    },
  })
);

// Moving 'success' and 'error' into primary/secondary to allow
// usage with majority of components (typescript + @material-ui constrain)
export const ErrorTheme = createMuiTheme(
  Object.assign({}, AppThemeConfig, {
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
  })
);

// Theme for store status text
export const StoreStatusTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#0D652D",
    },
    secondary: {
      main: "#870101",
    },
  },
});

// UI config variables
export const themeConfig = {
  max_card_height: 120,
  default_card_img_height: "20vw",
  default_card_img_minHeight: "80px",
  cornerRoundingRadius: "24px",
};

export default responsiveFontSizes(AppTheme);
