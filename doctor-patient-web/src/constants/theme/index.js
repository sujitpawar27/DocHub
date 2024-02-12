import { createTheme } from "@mui/material";
import { themeButtons } from "./button";
import { colorTheme } from "./color";
import { themeTypography } from "./typograpy";
const theme = createTheme(themeButtons, colorTheme, themeTypography);
export default theme;
