import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { useReducer } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { routes } from "../routes";
import { Icon } from "./Icon";
import { MainMenu } from "./MainMenu";
import { H2, P } from "./Typography";

const SideMenu = ({ children, width, anchor }) => {
  return (
    <Drawer
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor={anchor}
    >
      {children}
    </Drawer>
  );
};

export const RightMenuContext = React.createContext();

const update =
  ({ id, element }) =>
  (prev) => {
    const index = prev.findIndex((item) => item.id === id);
    let newStack;
    if (!element) {
      // console.log("%cUPDATE STACK", "color:pink;", "REMOVE");
      newStack = prev.filter((item) => item.id !== id);
    } else if (index < 0 && element) {
      // console.log("%cUPDATE STACK", "color:pink;", "ADD");
      newStack = [...prev, { id, element }];
    } else {
      // console.log("%cUPDATE STACK", "color:pink;", "UPDATE");
      newStack = [...prev];
      newStack[index] = { id, element };
      // newStack = [...prev].splice(index, 0, { id, element });
    }
    return newStack;
  };

export const RightMenuProvider = ({ children }) => {
  const [stack, setStack] = useState([]);
  const context = React.useMemo(
    () => ({
      updateStack: ({ id, element }) => setStack(update({ id, element })),
      stack,
    }),
    [stack]
  );
  console.log("[RightMenuProvider]", stack);

  return (
    <RightMenuContext.Provider value={context}>
      {children}
    </RightMenuContext.Provider>
  );
};

let counter = 0;

export const useRightMenu = (element) => {
  const [id] = useState(() => counter++);
  const { updateStack } = useContext(RightMenuContext);

  const updateStackRef = React.useRef(updateStack);
  updateStackRef.current = updateStack;

  useEffect(() => {
    console.log("%c[useRightMenu.eff]", "color:coral;", { id, element });
    updateStackRef.current({ id, element });
  }, [element, id]);

  useEffect(
    () => () => {
      console.log("%c[useRightMenu.eff cleanup]", "color:coral;", { id });
      updateStackRef.current({ id, element: null });
    },
    [id]
  );
};

export const Layout = ({
  children,
  rightMenuContent: rightMenuContentProp,
  contentWrapperSx,
}) => {
  const { stack } = useContext(RightMenuContext);
  const rightMenuContent = React.useMemo(
    () => rightMenuContentProp || stack[stack.length - 1]?.element,
    [rightMenuContentProp, stack]
  );
  console.log("[Layout.rndr]", { stack, rightMenuContent });

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#EAECF0",
        // TODO: check sessions
        minHeight: "100%",
      }}
    >
      <SideMenu width={256} anchor="left">
        <MainMenu />
      </SideMenu>

      <Box
        component="main"
        sx={{
          px: 4,
          // mx: 4,
          width: "100%",
          flexGrow: 1,
          position: "relative",
          //   bgcolor: "background.default",
          ...contentWrapperSx,
        }}
      >
        {children}
      </Box>

      {rightMenuContent && (
        <SideMenu width={392} anchor="right">
          {rightMenuContent}
        </SideMenu>
      )}
    </Box>
  );
};

const drawerWidth = 240;

export const LayoutExample = () => {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#EAECF0",
      }}
    >
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box>
    </Box>
  );
};
