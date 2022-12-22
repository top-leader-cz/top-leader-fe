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
import { useAuth } from "../features/auth/AuthProvider";
import { routes } from "../features/navigation";

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
    <Paper
      square
      sx={{
        height: "100vh",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        <LogoImg />
        <List component="nav">
          <ListItemLink
            text="Dashboard"
            icon={<HomeOutlined />}
            to={routes.dashboard}
          />
          <ListItemLink
            text="Sessions"
            icon={<DescriptionOutlined />}
            to={routes.sessions}
          />
          <ListItemLink text="Coaches" icon={<PersonOutlined />} />
          <ListItemLink text="Get feedback" icon={<ForumOutlined />} />
        </List>
      </Box>
      <Box sx={{ mb: 2 }}>
        <ListItemLink text="Settings" icon={<SettingsOutlined />} />
        <ListItemLink text="Help" icon={<HelpOutlined />} />
        <Divider sx={{ my: 2 }} />
        <ListItemLink
          text="Logout"
          icon={<LogoutOutlined />}
          onClick={() => {
            auth.signout();
            // auth.signout(() => navigate("/"));
          }}
          // to={routes.signIn}
        />
      </Box>
    </Paper>
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
