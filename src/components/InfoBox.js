import { alpha, Box } from "@mui/material";
import { H2 } from "./Typography";

export const PRIMARY_BG_LIGHT = (theme) =>
  alpha(theme.palette.primary.main, 0.05);
export const GRAY_BG_LIGHT = (theme) =>
  alpha(theme.palette.action.selected, 0.05);

export const InfoBox = ({ heading, children, color = "default", sx = {} }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 0.5,
        bgcolor: color === "primary" ? PRIMARY_BG_LIGHT : GRAY_BG_LIGHT,
        ...sx,
      }}
    >
      {heading && (
        <H2 gutterBottom color={color}>
          {heading}
        </H2>
      )}
      {children}
    </Box>
  );
};
