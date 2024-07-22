import { Box, Button, Paper } from "@mui/material";
import { H2 } from "./Typography";
import { ErrorBoundary } from "./ErrorBoundary";

export const ScrollableRightMenu = ({
  heading,
  children,
  buttonProps,
  sx = {},
  wrapperSx = {},
}) => {
  return (
    <ErrorBoundary>
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
          textWrap: "wrap",
          ...sx,
        }}
      >
        {heading && <H2 sx={{ my: 4 }}>{heading}</H2>}
        <Box
          sx={{
            overflow: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            ...wrapperSx,
          }}
        >
          {children}
        </Box>
        {buttonProps && (
          <Button
            fullWidth
            variant="contained"
            sx={{ my: 4 }}
            {...buttonProps}
          />
        )}
      </Paper>
    </ErrorBoundary>
  );
};
