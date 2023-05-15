import {
  DescriptionOutlined,
  ForumOutlined,
  HelpOutlined,
  HomeOutlined,
  LogoutOutlined,
  PersonOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { useMatch } from "react-router-dom";
import { useAuth } from "../features/Authorization";
import { routes } from "../routes";
import { Msg, MsgProvider } from "./Msg";
import { defineMessages } from "react-intl";

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

const LogoImg = () => {
  return (
    <Box
      component="img"
      src="/topleader-big.png"
      sx={{
        width: "100%",
        px: 2,
        my: 2,
        // maxHeight: { xs: 233, md: 167 },
        // maxWidth: { xs: 350, md: 250 },
      }}
      alt="Topleader"
    />
  );
};

const ListItemLink = ({ to, text, icon, onClick }) => {
  const match = useMatch(to ?? "");

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={Boolean(to && match)}
        href={to}
        onClick={onClick}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export const MainMenu = () => {
  const auth = useAuth();

  return (
    <MsgProvider messages={messages}>
      <Paper
        square
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box>
          <LogoImg />
          <List component="nav">
            <ListItemLink
              text={<Msg id="main-menu.items.dashboard" />}
              icon={<HomeOutlined />}
              to={routes.dashboard}
            />
            <ListItemLink
              text={<Msg id="main-menu.items.sessions" />}
              icon={<DescriptionOutlined />}
              to={routes.sessions}
            />
            <ListItemLink
              text={<Msg id="main-menu.items.coaches" />}
              icon={<PersonOutlined />}
              to={routes.coaches}
            />
            <ListItemLink
              text={<Msg id="main-menu.items.getFeedback" />}
              icon={<ForumOutlined />}
              to={routes.getFeedback}
            />
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <ListItemLink
            text={<Msg id="main-menu.items.settings" />}
            icon={<SettingsOutlined />}
            to={routes.settings}
          />
          <ListItemLink
            text={<Msg id="main-menu.items.help" />}
            icon={<HelpOutlined />}
          />
          <Divider sx={{ my: 2 }} />
          <ListItemLink
            text={<Msg id="main-menu.items.logout" />}
            icon={<LogoutOutlined />}
            onClick={() => {
              auth.signout();
              // auth.signout(() => navigate("/"));
            }}
            // to={routes.signIn}
          />
        </Box>
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
