import { Avatar, Box, Typography } from "@mui/material";
import { Icon } from "../Icon";
import { H1 } from "../Typography";

const IconTileIcon = ({ iconName }) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: 100,
        height: 100,
        bgcolor: "#DAD2F1",
        borderRadius: 3,
      }}
    >
      <Icon name={iconName} sx={{ fontSize: 40, color: "primary.main" }} />
    </Avatar>
  );
};

export const IconTile = ({
  iconName,
  caption,
  renderCaption = () => (
    <Typography variant="h2" fontSize={14} mt={2}>
      {caption}
    </Typography>
  ),
  text,
  renderText = () => (
    <H1 color={"primary.main"} mt={2}>
      {text}
    </H1>
  ),
  children,
  ...props
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={"100%"}
      bgcolor="#FCFCFD"
      p={3}
      {...props}
    >
      <IconTileIcon iconName={iconName} />
      {renderCaption(caption)}
      {renderText(text)}
      {children}
    </Box>
  );
};
