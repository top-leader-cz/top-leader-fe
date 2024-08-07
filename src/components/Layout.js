import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gray50 } from "../theme";
import { Header } from "./Header";
import { Icon } from "./Icon";
import { MainMenu } from "./MainMenu";

const drawerWidth = 256;

const openedMixin = ({ theme, width }) => ({
  width: width,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = ({ theme, width }) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: width || `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: width || `calc(${theme.spacing(8)} + 1px)`,
  },
});

const MyDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !["open", "toggleMobile"].includes(prop),
})(({ theme, open, width, toggleMobile, ...rest }) => ({
  width: width,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "relative",
  "& .MuiDrawer-paper": {
    ...(toggleMobile ? { overflow: "visible" } : {}),
    boxSizing: "border-box",
  },
  ...(open && {
    ...openedMixin({ theme, width }),
    "& .MuiDrawer-paper": openedMixin({ theme, width }),
  }),
  ...(!open && {
    ...closedMixin({ theme, width }),
    "& .MuiDrawer-paper": closedMixin({ theme, width }),
  }),
}));

const SideMenu = ({
  children,
  width,
  anchor,
  toggleMobile,
  open,
  printHidden,
}) => {
  const printSx = printHidden
    ? {
        "@media print": {
          display: "none",
        },
      }
    : {};

  return (
    <MyDrawer
      id="side-menu-left"
      width={width}
      variant="permanent"
      anchor={anchor}
      open={open}
      toggleMobile={toggleMobile}
      sx={printSx}
    >
      {children}
      {toggleMobile ? (
        <Box
          sx={{
            position: "absolute",
            ...(anchor === "left" ? { right: "-20px" } : { left: "-20px" }),
            top: "55px",
          }}
        >
          {toggleMobile}
        </Box>
      ) : null}
    </MyDrawer>
  );
};

export const RightMenuContext = createContext();

const update =
  ({ id, render }) =>
  (prev) => {
    const index = prev.findIndex((item) => item.id === id);
    let newStack;
    if (!render) {
      // console.log("%cUPDATE STACK", "color:pink;", "REMOVE");
      newStack = prev.filter((item) => item.id !== id);
    } else if (index < 0 && render) {
      // console.log("%cUPDATE STACK", "color:pink;", "ADD");
      newStack = [...prev, { id, render }];
    } else {
      // console.log("%cUPDATE STACK", "color:pink;", "UPDATE");
      newStack = [...prev];
      newStack[index] = { id, render };
      // newStack = [...prev].splice(index, 0, { id, render });
    }
    return newStack;
  };

export const RightMenuProvider = ({ children }) => {
  const [stack, setStack] = useState([]);
  const context = useMemo(
    () => ({
      updateStack: ({ id, render }) => setStack(update({ id, render })),
      stack,
    }),
    [stack]
  );
  // console.log("[RightMenuProvider]", stack);

  return (
    <RightMenuContext.Provider value={context}>
      {children}
    </RightMenuContext.Provider>
  );
};

let counter = 0;

export const useRightMenu = (elementOrFn) => {
  const [id] = useState(() => counter++);
  const { updateStack } = useContext(RightMenuContext);

  const updateStackRef = useRef(updateStack);
  updateStackRef.current = updateStack;

  useEffect(() => {
    const render =
      typeof elementOrFn === "function"
        ? elementOrFn
        : elementOrFn
        ? () => elementOrFn
        : undefined;
    // console.log("%c[useRightMenu.eff]", "color:coral;", { id, element });
    updateStackRef.current({ id, render });
  }, [elementOrFn, id]);

  useEffect(
    () => () => {
      // console.log("%c[useRightMenu.eff cleanup]", "color:coral;", { id });
      updateStackRef.current({ id, render: null });
    },
    [id]
  );
};

const LayoutHeader = ({
  avatarSrc,
  heading,
  noDivider,
  withNotifications,
  ...props
}) => {
  return (
    <Header
      avatar={
        avatarSrc && (
          <Avatar variant="circular" src={avatarSrc} sx={{ mr: 2 }} />
        )
      }
      text={heading}
      noDivider={noDivider}
      withNotifications={withNotifications}
      {...props}
    />
  );
};

export const LayoutCtx = createContext({});

export const usePrintWithoutLeftMenu = ({
  setPrintLeftMenuHidden: setPrintLeftMenuHiddenProp,
} = {}) => {
  const { setPrintLeftMenuHidden = setPrintLeftMenuHiddenProp } =
    useContext(LayoutCtx);

  // Firefox printing fix: https://mui.com/material-ui/react-use-media-query/
  // https://bugzilla.mozilla.org/show_bug.cgi?id=774398
  // const isPrint = useMediaQuery("print");

  useLayoutEffect(() => {
    // setPrintLeftMenuHidden(isPrint);
    setPrintLeftMenuHidden(true);
    return () => {
      setPrintLeftMenuHidden(false);
    };
  }, [setPrintLeftMenuHidden]);
};

export const Layout = ({
  children,
  header,
  rightMenuContent: rightMenuContentProp,
  initialPrintLeftMenuHidden = false,
}) => {
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down("lg"));
  const downMd = useMediaQuery(theme.breakpoints.down("md"));

  const [printLeftMenuHidden, setPrintLeftMenuHidden] = useState(
    initialPrintLeftMenuHidden
  );
  // usePrintWithoutLeftMenu({ setPrintLeftMenuHidden });

  const [leftOpen, setLeftOpen] = useState(!downLg);
  useEffect(() => {
    setLeftOpen(!downLg);
  }, [downLg]);
  const handleToggleLeft = useCallback(() => {
    setLeftOpen((leftOpen) => !leftOpen);
  }, []);

  const [rightOpen, setRightOpen] = useState(!downMd);
  useEffect(() => {
    setRightOpen(!downMd);
  }, [downMd]);
  const handleToggleRight = useCallback(() => {
    setRightOpen((rightOpen) => !rightOpen);
  }, []);

  const { stack } = useContext(RightMenuContext);
  const rightMenuContent = useMemo(() => {
    // const propMenu = typeof rightMenuContentProp === "function" ? rightMenuContentProp({}) : rightMenuContentProp
    const lastStackItem = stack[stack.length - 1];
    return (
      rightMenuContentProp ||
      lastStackItem?.render?.({ rightOpen, setRightOpen })
    );
  }, [rightMenuContentProp, rightOpen, stack]);
  const leftWidth = leftOpen ? 256 : 88;
  const rightWidth = rightOpen ? (downLg ? 300 : 392) : 12;
  // console.log("[Layout.rndr]", { stack, rightMenuContent });

  return (
    <LayoutCtx.Provider
      value={{ downLg, downMd, printLeftMenuHidden, setPrintLeftMenuHidden }}
    >
      <Box
        id="layout"
        sx={{
          display: "flex",
          bgcolor: gray50,
          minHeight: "100%",
          overflow: "auto",
        }}
      >
        <SideMenu
          width={leftWidth}
          anchor="left"
          open={leftOpen}
          printHidden={printLeftMenuHidden}
          toggleMobile={
            !downLg ? null : (
              <IconButton
                variant="outlined"
                size="small"
                disableRipple
                sx={{ backgroundColor: "white", border: "1px solid #EAECF0" }}
                onClick={handleToggleLeft}
              >
                <Icon name={leftOpen ? "ArrowBack" : "ArrowForward"} />
              </IconButton>
            )
          }
        >
          <MainMenu open={leftOpen} />
        </SideMenu>

        <Box
          component="main"
          sx={{
            px: 3,
            pb: 3, // TODO: check everywhere
            overflow: "auto",
            // mx: 4,
            width: "100%",
            flexGrow: 1,
            position: "relative",
            //   bgcolor: "background.default",
          }}
        >
          {header && <LayoutHeader {...header} />}
          {children}
        </Box>

        {rightMenuContent && (
          <SideMenu
            width={rightWidth}
            anchor="right"
            open={rightOpen}
            toggleMobile={
              !downMd ? null : (
                <IconButton
                  variant="outlined"
                  size="small"
                  disableRipple
                  sx={{ backgroundColor: "white", border: "1px solid #EAECF0" }}
                  onClick={handleToggleRight}
                >
                  <Icon name={rightOpen ? "ArrowForward" : "ArrowBack"} />
                </IconButton>
              )
            }
          >
            {rightMenuContent}
          </SideMenu>
        )}
      </Box>
    </LayoutCtx.Provider>
  );
};

// const drawerWidth = 240;

const LayoutExample = () => {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f9fafb",
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
