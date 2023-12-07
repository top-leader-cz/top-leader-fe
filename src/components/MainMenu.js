import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { defineMessages } from "react-intl";
import { useMatch } from "react-router-dom";
import { useAuth } from "../features/Authorization";
import { routes } from "../routes";
import theme from "../theme";
import { Icon } from "./Icon";
import { LinkBehavior } from "./LinkBehavior";
import { Msg, MsgProvider } from "./Msg";
import { P } from "./Typography";

const messages = defineMessages({
  "main-menu.items.dashboard": {
    id: "main-menu.items.dashboard",
    defaultMessage: "Dashboard",
  },
  "main-menu.items.sessions": {
    id: "main-menu.items.sessions",
    defaultMessage: "Sessions",
  },
  "main-menu.items.coaches": {
    id: "main-menu.items.coaches",
    defaultMessage: "Coaches",
  },
  "main-menu.items.getFeedback": {
    id: "main-menu.items.getFeedback",
    defaultMessage: "Get feedback",
  },
  "main-menu.items.team": {
    id: "main-menu.items.team",
    defaultMessage: "Team",
  },
  "main-menu.items.clients": {
    id: "main-menu.items.clients",
    defaultMessage: "Clients",
  },
  "main-menu.items.messages": {
    id: "main-menu.items.messages",
    defaultMessage: "Messages",
  },
  "main-menu.items.settings": {
    id: "main-menu.items.settings",
    defaultMessage: "Settings",
  },
  "main-menu.items.help": {
    id: "main-menu.items.help",
    defaultMessage: "Help",
  },
  "main-menu.items.logout": {
    id: "main-menu.items.logout",
    defaultMessage: "Logout",
  },
});

// TODO: mobile
const LogoImg = ({ mobile, text }) => {
  if (mobile)
    return (
      <Box
        component="div"
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          backgroundColor: theme.palette.primary.main,
          // px: 2,
          my: 2,
          mx: "auto",
          // maxHeight: { xs: 233, md: 167 },
          // maxWidth: { xs: 350, md: 250 },
        }}
      />
    );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        // height: 42,
        // px: 2,
        // my: 2,
        // maxHeight: { xs: 233, md: 167 },
        // maxWidth: { xs: 350, md: 250 },
      }}
      alt="Topleader"
    >
      <Box
        component="img"
        src="/topleader-big.png"
        sx={{
          width: "100%",
          height: 42,
          px: 2,
          my: 2,
          // maxHeight: { xs: 233, md: 167 },
          // maxWidth: { xs: 350, md: 250 },
        }}
        alt="Topleader"
      />
      <P sx={{ position: "absolute", bottom: 8, right: 0 }}>{text}</P>
    </Box>
  );
};

// TODO: LinkBehavior -> NavLink:
const ListItemLink = ({ to, text, icon, onClick, mobile }) => {
  const match = useMatch(to ?? "");

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={LinkBehavior}
        selected={Boolean(to && match)}
        href={to}
        onClick={onClick}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={text} sx={{ opacity: mobile ? 0 : 1 }} />
      </ListItemButton>
    </ListItem>
  );
};

export const MainMenu = ({ open }) => {
  const { signout, isHR, isCoach, isAdmin } = useAuth();
  const mobile = !open;

  return (
    <MsgProvider messages={messages}>
      <Paper
        id="main-menu"
        square
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          p: 2,
          position: "relative",
        }}
      >
        <Box>
          <LogoImg
            mobile={mobile}
            text={isAdmin ? "Admin" : isHR ? "HR" : isCoach ? "Coach" : ""}
          />
          <List component="nav">
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.dashboard" />}
              icon={<Icon name="HomeOutlined" />}
              to={routes.dashboard}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.sessions" />}
              icon={<Icon name="DescriptionOutlined" />}
              to={routes.sessions}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.coaches" />}
              icon={<Icon name="PersonOutlined" />}
              to={routes.coaches}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.getFeedback" />}
              icon={<Icon name="ForumOutlined" />}
              to={routes.getFeedback}
            />
            {/* {isHR ? ( */}
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.team" />}
              icon={<Icon name="People" />}
              to={routes.team}
            />
            {/* ) : null} */}
            {isCoach ? (
              <ListItemLink
                mobile={mobile}
                text={<Msg id="main-menu.items.clients" />}
                icon={<Icon name="People" />}
                to={routes.clients}
              />
            ) : null}
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.messages" />}
              icon={<Icon name="ChatBubbleOutlineOutlined" />}
              to={routes.messages}
            />
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <ListItemLink
            mobile={mobile}
            text={<Msg id="main-menu.items.settings" />}
            icon={<Icon name="SettingsOutlined" />}
            to={routes.settings}
          />
          <ListItemLink
            mobile={mobile}
            text={<Msg id="main-menu.items.help" />}
            icon={<Icon name="HelpOutlined" />}
          />
          <Divider sx={{ my: 2 }} />
          <ListItemLink
            mobile={mobile}
            text={<Msg id="main-menu.items.logout" />}
            icon={<Icon name="LogoutOutlined" />}
            onClick={() => {
              signout();
              // auth.signout(() => navigate("/"));
            }}
            // to={routes.signIn}
          />
        </Box>
        {process.env.NODE_ENV !== "production" &&
          process.env.REACT_APP_GIT_SHA && (
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                left: 0,
                right: 0,
                height: "auto",
                textAlign: "center",
              }}
            >
              <Typography
                component={"a"}
                target="_blank"
                rel="noreferrer"
                href={`https://github.com/top-leader-cz/top-leader-fe/commit/${process.env.REACT_APP_GIT_SHA}`}
                color={"silver"}
                sx={{ textDecoration: "none" }}
              >
                <span style={{ userSelect: "none" }}>
                  {!mobile ? "commit: " : ""}
                </span>
                {process.env.REACT_APP_GIT_SHA}
              </Typography>
            </Box>
          )}
      </Paper>
    </MsgProvider>
  );
};
// <Avatar variant="rounded" sx={{ bgcolor: "primary.main" }} />

// const Menu = () => {

//     return (
//       <Drawer variant="permanent" open={true}>
//         <Toolbar
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end",
//             px: [1],
//           }}
//         >
//           <IconButton onClick={toggleDrawer}>
//             <ChevronLeftIcon />
//           </IconButton>
//         </Toolbar>
//         <Divider />
//         <List component="nav">
//           {mainListItems}
//           <Divider sx={{ my: 1 }} />
//           {secondaryListItems}
//         </List>
//       </Drawer>
//     );
// }
