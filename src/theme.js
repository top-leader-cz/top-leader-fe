import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import defaultTheme from "@mui/material/styles/defaultTheme";

console.log({ defaultTheme });
// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#4720B7",
    },
    secondary: {
      main: "#907ACF",
    },
    error: {
      main: "#F04438",
      // main: red.A400,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h5: {
      fontWeight: 600,
      color: "#101828", // gray/900
    },
    button: {
      textTransform: "none",
    },
    body1: {
      fontWeight: 400,
      color: "#667085", // gray/500
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
