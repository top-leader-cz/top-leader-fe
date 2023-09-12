import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
} from "@mui/material";
import { H1, H2 } from "./Typography";
import { Icon } from "./Icon";
import { useCallback, useState } from "react";
import { useMsg } from "./Msg/Msg";
import { messages as generalMessages } from "./messages";

const defaultAvaratSrc = `https://i.pravatar.cc/200?u=${"" + Math.random()}`;

const longTxt =
  "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.";
const shortTxt = "Lorem ipsum dolor sit";
const MESSAGES_MOCK = [
  {
    key: 0,
    from: "Dan",
    text: shortTxt,
  },
  {
    key: 0,
    from: "Dan",
    text: longTxt,
  },
  {
    key: 0,
    from: "Dan",
    text: "Hi hello lorem ipsum",
  },
];
const MessagesPopover = ({ messages = MESSAGES_MOCK, sx = {} }) => {
  const msg = useMsg({ dict: generalMessages });
  const onSelect = useCallback((message) => {
    console.log("[onSelect]", { message });
  }, []);

  return (
    <Card sx={{ mt: 1, maxWidth: "500px", ...sx }} elevation={0}>
      <CardContent>
        <H2 sx={{ mb: 2 }}>{msg("general.notifications")}</H2>
        <Divider sx={{ my: 0 }} orientation="horizontal" flexItem />
        <List
          sx={{
            // width: "100%",
            // maxWidth: 300,
            bgcolor: "background.paper",
          }}
        >
          {messages.map((message, index, arr) => (
            <ListItem
              key={message.key}
              alignItems="flex-start"
              // sx={{
              //   bgcolor: key === selectedKey ? "#F9F8FF" : "transparent",
              //   cursor: "pointer",
              // }}
              //   secondaryAction={
              //     <IconButton edge="end" aria-label="comments">
              //       <CommentIcon />
              //     </IconButton>
              //   }
              disablePadding
              divider={index < arr.length - 1}
              // onClick={() => onSelect(key)}
            >
              <ListItemButton
                role={undefined}
                onClick={() => onSelect(message)}
                dense
              >
                <ListItemAvatar>
                  <Avatar
                    alt={message.from}
                    src={message.avatarSrc || defaultAvaratSrc}
                    sx={{ width: 44, height: 44 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<H2>{message.from}</H2>}
                  secondary={
                    <>
                      {message.text}
                      <Box sx={{ textAlign: "right" }}>15 min ago</Box>
                    </>
                  }
                  sx={{ width: "100%", overflow: "auto" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <Stack direction="column" spacing={1}>
          {messages.map((message) => (
            <pre>{JSON.stringify(message, null, 2)}</pre>
          ))}
        </Stack> */}
      </CardContent>
    </Card>
  );
};

const Messages = ({ tooltip = "Messages" }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const badgeContent = 1;

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label={tooltip}
        // size="large"
        // sx={{ color: "#101828" }}
      >
        <Badge
          badgeContent={badgeContent}
          color="error"
          variant="dot"
          invisible={badgeContent < 1}
          // sx={{ color: "#F04438" }}
        >
          <Icon name="NotificationsOutlined" />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: "right",
        }}
      >
        <MessagesPopover />
      </Popover>
    </>
  );
};

export const Header = ({ avatar, text, noDivider, withMessages }) => {
  return (
    <Box mt={4} mb={3}>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        alignItems="center"
      >
        {avatar}
        <H1 sx={{ flexGrow: 1 }}>{text}</H1>
        {withMessages && <Messages />}
      </Box>
      {!noDivider && <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />}
    </Box>
  );
};
