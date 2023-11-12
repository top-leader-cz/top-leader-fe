import React from "react";
import { Typography } from "@mui/material";

export const H1 = (props) => <Typography variant="h1" {...props} />;
export const H2 = (props) => <Typography variant="h2" {...props} />;
export const H3 = (props) => <Typography variant="h3" {...props} />;
export const P = ({ emphasized, bigger, sx, ...props }) => {
  const localSx = emphasized
    ? {
        color: "black",
        fontSize: 16,
        fontWeight: 500,
      }
    : bigger
    ? { fontSize: 16 }
    : {};
  return <Typography variant="body1" sx={{ ...localSx, ...sx }} {...props} />;
};
