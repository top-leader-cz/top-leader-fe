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
import { useHasRequiredRoles } from "../features/Authorization/Redirects";
import { useDevMode } from "../features/Settings/Settings.page";
import { routes } from "../routes";
import { rolesDefByRoute } from "../routes/constants";
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
const ListItemLink = ({ route, text, icon, onClick, mobile }) => {
  const match = useMatch(route ?? "");
  const hasRole = useHasRequiredRoles(rolesDefByRoute[route]);

  if (!hasRole) return null;

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={LinkBehavior}
        selected={Boolean(route && match)}
        href={route}
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
  const [isDevMode, setIsDevMode] = useDevMode();

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
              route={routes.dashboard}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.sessions" />}
              icon={<Icon name="DescriptionOutlined" />}
              route={routes.sessions}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.coaches" />}
              icon={<Icon name="PersonOutlined" />}
              route={routes.coaches}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.getFeedback" />}
              icon={<Icon name="ForumOutlined" />}
              route={routes.getFeedback}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.team" />}
              icon={<Icon name="People" />}
              route={routes.team}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.clients" />}
              icon={<Icon name="People" />}
              route={routes.clients}
            />
            <ListItemLink
              mobile={mobile}
              text={<Msg id="main-menu.items.messages" />}
              icon={<Icon name="ChatBubbleOutlineOutlined" />}
              route={routes.messages}
            />
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <ListItemLink
            mobile={mobile}
            text={<Msg id="main-menu.items.settings" />}
            icon={<Icon name="SettingsOutlined" />}
            route={routes.settings}
          />
          <ListItemLink
            mobile={mobile}
            text={<Msg id="main-menu.items.help" />}
            icon={<Icon name="HelpOutlined" />}
            route={routes.help}
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
        {process.env.REACT_APP_GIT_SHA && (
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              left: 0,
              right: 0,
              height: "auto",
              textAlign: "center",
              visibility:
                process.env.NODE_ENV !== "production" ||
                process.env.REACT_APP_ENV === "QA"
                  ? "visible"
                  : "hidden",
            }}
          >
            <Typography
              component={"a"}
              target="_blank"
              rel="noreferrer"
              href={`https://github.com/top-leader-cz/top-leader-fe/commit/${process.env.REACT_APP_GIT_SHA}`}
              color={isDevMode ? "black" : "silver"}
              sx={{ textDecoration: "none" }}
              onClick={(e) => {
                if (e.altKey) {
                  setIsDevMode(!isDevMode);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
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
