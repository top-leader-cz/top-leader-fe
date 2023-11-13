import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider } from "@mui/material";
import { Notifications } from "./Notifications/Notifications";
import { H1, H2 } from "./Typography";

export const Header = ({
  avatar,
  text,
  noDivider,
  withNotifications,
  actionButton,
  back,
}) => {
  const renderInner = () =>
    back ? (
      <Button color="inherit" href={back.href} startIcon={<ArrowBack />}>
        <H2>{text}</H2>
      </Button>
    ) : (
      <H1 sx={{ flexGrow: 1 }}>{text}</H1>
    );

  return (
    <Box mt={4} mb={3}>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        alignItems="center"
      >
        {avatar}
        {renderInner()}
        {withNotifications && <Notifications />}
        {actionButton && <Button {...actionButton} />}
      </Box>
      {!noDivider && <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />}
    </Box>
  );
};
