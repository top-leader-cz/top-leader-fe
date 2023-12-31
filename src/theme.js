import { alpha, createTheme } from "@mui/material/styles";
import defaultTheme from "@mui/material/styles/defaultTheme";
import { LinkBehavior } from "./components/LinkBehavior";

export const primary25 = "#F9F8FF";
export const primary500 = "#4720B7";
export const gray50 = "#F9FAFB"; // previously in bg as #EAECF0
export const gray200 = "#EAECF0";
export const gray500 = "#667085";
export const gray900 = "#101828";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: primary500,
    },
    secondary: {
      main: "#907ACF",
    },
    warning: {
      contrastText: "#EAAA08", // yellow/500
      main: "#FEF7C3", // yellow/100
    },
    error: {
      main: "#F04438",
      // light: "#757ce8",
      // main: "#3f50b5",
      // dark: "#002884",
      // contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    // fontWeightLight: 200,
    // fontWeightBold: 600,
    h1: {
      fontSize: 24,
      fontWeight: 600,
      color: gray900,
      lineHeight: 1.21,
      letterSpacing: "0em",
    },
    h2: {
      fontSize: 18,
      fontWeight: 600,
      color: gray900,
      lineHeight: 1.21,
      letterSpacing: "0em",
    },
    h3: {
      fontSize: 14,
      fontWeight: 600,
      color: gray900,
      lineHeight: 1.21,
      letterSpacing: "0em",
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      color: gray500,
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
    MuiInputBase: {
      styleOverrides: {
        input: ({ ownerState }) => ({
          ...(ownerState?.size === "small" && {
            "&.MuiInputBase-inputSizeSmall": { padding: "9.5px 14px" },
          }),
        }),
      },
    },
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
      styleOverrides: {
        root: {
          "&.Mui-selected.MuiListItemButton-root": {
            backgroundColor: primary25,
            ".MuiTypography-root,.MuiListItemIcon-root": {
              color: primary500,
            },
          },
        },
      },
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiChip: {
      styleOverrides: {
        icon: {
          color: "inherit",
        },
      },
      variants: [
        {
          props: { variant: "selected" },
          style: {
            color: primary500,
            backgroundColor: primary25,
            border: `1px solid ${primary500}`,
            padding: "16px",
            borderRadius: "10px",
          },
        },
        {
          props: { variant: "unselected" },
          style: {
            color: gray900,
            backgroundColor: "#FFFFFF",
            border: "1px solid transparent",
            padding: "16px",
            borderRadius: "10px",
          },
        },
      ],
    },
  },
});

// console.log({ theme, defaultTheme });

export default theme;
