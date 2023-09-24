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
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMsg } from "./Msg/Msg";
import { messages as generalMessages } from "./messages";
import { useMutation, useQuery } from "react-query";
import { useAuth } from "../features/Authorization";
import { I18nContext } from "../App";
import { routes } from "../routes";
import { qstr } from "../features/Authorization/AuthProvider";
import { generatePath } from "react-router-dom";
import { LinkBehavior } from "./LinkBehavior";

const defaultAvaratSrc = `https://i.pravatar.cc/200?u=${"" + Math.random()}`;

const longTxt =
  "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.";
const shortTxt = "Lorem ipsum dolor sit";
const NOTIFICATIONS_MOCK = [
  {
    key: 0,
    from: "Mockname",
    text: shortTxt,
    unread: true,
    createdAt: "2023-09-18T22:00:36.838Z",
    // createdAt: "2023-08-15T17:12:10.640453" // ?? previous api datetime format
  },
  {
    key: 1,
    from: "Mockname",
    text: longTxt,
    unread: false,
    createdAt: "2023-09-18T22:00:36.838Z",
  },
  {
    key: 2,
    from: "Mockname",
    text: "Hi hello lorem ipsum",
    unread: false,
    createdAt: "2023-09-18T22:00:36.838Z",
  },
];
const NotificationsPopover = ({
  notifications = [],
  sx = {},
  ...restProps
}) => {
  const msg = useMsg({ dict: generalMessages });
  const { i18n } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const { mutate: markAsRead } = useMutation({
    mutationFn: async () =>
      authFetch({
        method: "POST",
        url: `/api/latest/notifications/mark-as-read`,
      }),
  });

  // run eff just once on close with current notifications
  const nRef = useRef({ notifications, markAsRead });
  nRef.current = { notifications, markAsRead };
  useEffect(
    () => () => {
      const hasUnread = nRef.current.notifications?.some((n) => n.unread);
      console.log("[NotificationsPopover.markAsRead]", {
        hasUnread,
        notifications: nRef.current.notifications,
      });
      if (hasUnread) {
        nRef.current?.markAsRead();
      }
    },
    []
  );

  console.log("[NotificationsPopover.rndr]", { restProps });

  return (
    <Card sx={{ mt: 1, width: "500px", ...sx }} elevation={0}>
      <CardContent>
        <H2 sx={{ mb: 2 }}>{msg("general.notifications")}</H2>
        <Divider sx={{ my: 0 }} orientation="horizontal" flexItem />
        <List
          sx={{
            // width: "100%",
            // maxWidth: 300,
            bgcolor: "background.paper",
            p: 0,
          }}
        >
          {notifications.map((message, index, arr) => (
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
            >
              <ListItemButton
                role={undefined}
                component={LinkBehavior}
                // href={generatePath(routes.messages, { u: message.from })} // swallows param when not defined in route as :param
                // href={qstr(routes.messages, { u: message.from })}
                href={routes.messages}
                state={{ messagesFrom: message.from }}
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
                  primary={
                    <H2>
                      {msg(
                        message.unread
                          ? "general.new-message-from"
                          : "general.message-from",
                        { from: message.from }
                      )}
                    </H2>
                  }
                  secondary={
                    <>
                      {message.text}
                      <Box
                        component="span"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        {message.createdAt
                          ? `${i18n.formatDistanceToNow(
                              i18n.parseUTC(message.createdAt),
                              { addSuffix: true }
                            )}`
                          : ""}
                      </Box>
                    </>
                  }
                  sx={{ width: "100%", overflow: "auto" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const Notifications = ({ tooltip = "Notifications" }) => {
  const { authFetch } = useAuth();
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      authFetch({
        url: `/api/latest/notifications`,
        query: {
          page: 0,
          size: 10000,
          sort: "createdAt,asc",
        },
      }),
  });

  const notifications =
    query.data?.content?.map(
      ({
        id,
        username, // current user
        type,
        read,
        createdAt,
        context: { type: ctxType, fromUser, message },
      }) => ({
        key: id,
        from: fromUser,
        text: message,
        unread: !read,
        createdAt,
      })
    ) ?? [];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const badgeContent = notifications.filter(({ unread }) => unread).length;

  if (!notifications.length) return null;

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
        <NotificationsPopover notifications={notifications} />
      </Popover>
    </>
  );
};

export const Header = ({ avatar, text, noDivider, withNotifications }) => {
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
        {withNotifications && <Notifications />}
      </Box>
      {!noDivider && <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />}
    </Box>
  );
};
