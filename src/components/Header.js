import { Box, Divider } from "@mui/material";
import { H1 } from "./Typography";

export const Header = ({ avatar, text, noDivider }) => {
  return (
    <Box mt={4} mb={3}>
      <Box
        display="flex"
        flexWrap="nowrap"
        alignItems="center"
        flexDirection="row"
      >
        {avatar}
        <H1>{text}</H1>
      </Box>
      {!noDivider && <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />}
    </Box>
  );
};
