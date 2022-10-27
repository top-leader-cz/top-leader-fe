import { Avatar, Box, Divider } from "@mui/material";
import { H1 } from "./Typography";

export const Header = ({}) => {
  return (
    <Box mt={4} mb={3}>
      <Box
        display="flex"
        flexWrap="nowrap"
        alignItems="center"
        flexDirection="row"
      >
        <Avatar variant="circular" src="https://i.pravatar.cc/44" />
        <H1 ml={2}>Hello, Jamie!</H1>
      </Box>
      <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
    </Box>
  );
};
