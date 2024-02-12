import { createTheme } from "@mui/material/styles";
import { grey, green, red, orange, cyan } from "@mui/material/colors";
export const sosPrimary = {
  900: "#142966",
  800: "#1C388C",
  700: "#2447B3",
  600: "#2B57D9",
  500: "#3366FF",
  400: "#668CFF",
  300: "#99B3FF",
  200: "#CCD9FF",
  100: "#EBF0FF",
};

export const sosSecondary = {
  100: "#FFFFFF",
  400: "#999999",
  500: "#999999",
  700: "#0C0C0C",
};

export const colorTheme = createTheme({
  palette: {
    primary: {
      main: sosPrimary[500],
      blue: sosPrimary[700],

      light: sosPrimary[100],
      dark: sosPrimary[900],
      contrastText: "#FFFFFF",
    },
    grey: {
      500: grey[500],
      100: grey[100],
      900: grey[900],
      800: grey[800],
      400: grey[400],
      600: grey[600],
      700: grey[700],
      200: grey[200],
    },
    success: {
      main: green[500],
      light: green[100],
      dark: green[900],
    },
    danger: {
      main: red[500],
      light: red[100],
      dark: red[900],
    },
    warning: {
      main: orange[500],
      light: orange[100],
      dark: orange[900],
    },
    info: {
      main: cyan[500],
      light: cyan[100],
      dark: cyan[900],
    },
  },
});
