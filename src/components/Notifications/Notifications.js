import { Badge, IconButton, Popover } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../features/Authorization";
import { Icon } from "../Icon";
import { NotificationsPopover } from "./NotificationsPopover";

export const Notifications = ({ tooltip = "Notifications" }) => {
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
