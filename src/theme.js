import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import defaultTheme from "@mui/material/styles/defaultTheme";
import { LinkBehavior } from "./components/LinkBehavior";

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
    // gray: { // TODO
    //   900
    // }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    // fontWeightLight: 200,
    // fontWeightBold: 600,
    h1: {
      fontSize: 24,
      fontWeight: 600,
      color: "#101828", // gray/900
      lineHeight: 1.21,
      letterSpacing: "0em",
    },
    h2: {
      fontSize: 18,
      fontWeight: 600,
      color: "#101828", // gray/900
      lineHeight: 1.21,
      letterSpacing: "0em",
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      color: "#667085", // gray/500
      lineHeight: 1.21,
    },
    button: {
      fontSize: 14,
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    // MuiTypography: {
    //   defaultProps: {
    //     variantMapping: {
    //       h2: "h1",
    //       h3: "h2",
    //       h4: "h3",
    //       subtitle1: "h2",
    //     },
    //   },
    // },
    MuiAvatar: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

console.log({ theme, defaultTheme });

export default theme;
