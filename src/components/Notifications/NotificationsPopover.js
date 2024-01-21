import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useContext, useEffect, useRef } from "react";

import { always } from "ramda";
import { useMyMutation } from "../../features/Authorization/AuthProvider";
import { I18nContext } from "../../features/I18n/I18nProvider";
import { routes } from "../../routes";
import { LinkBehavior } from "../LinkBehavior";
import { useMsg } from "../Msg/Msg";
import { H2 } from "../Typography";
import { generalMessages } from "../messages";

export const NotificationsPopover = ({
  notifications = [],
  sx = {},
  ...restProps
}) => {
  const msg = useMsg({ dict: generalMessages });
  const { i18n } = useContext(I18nContext);
  const { mutate: markAsRead } = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/notifications/mark-as-read`,
      from: always(undefined),
    },
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
              disablePadding
              divider={index < arr.length - 1}
            >
              <ListItemButton
                role={undefined}
                component={LinkBehavior}
                href={routes.messages}
                state={{ messagesFrom: message.from }}
                dense
              >
                <ListItemAvatar>
                  <Avatar
                    alt={message.from}
                    src={`/api/latest/coaches/${message.from}/photo`}
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
                          ? `${i18n.formatDistanceToNowLocal(
                              message.createdAt,
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
