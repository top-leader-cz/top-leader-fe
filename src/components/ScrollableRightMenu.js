import { Box, Button, Paper } from "@mui/material";
import { H2 } from "./Typography";

export const ScrollableRightMenu = ({ heading, children, buttonProps }) => {
  return (
    <Paper
      square
      sx={{
        px: 3,
        // py: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        justifyContent: "space-between",
      }}
    >
      <H2 sx={{ my: 4 }}>{heading}</H2>
      <Box
        sx={{
          overflow: "scroll",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        {children}
      </Box>
      {buttonProps && (
        <Button fullWidth variant="contained" sx={{ my: 4 }} {...buttonProps} />
      )}
    </Paper>
  );
};
