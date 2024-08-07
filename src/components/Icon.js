// import * as Icons from "@mui/icons-material";
import {
  Add,
  Adjust,
  ArrowBack,
  ArrowForward,
  BarChart,
  BorderColorOutlined,
  ChatBubbleOutlineOutlined,
  Check,
  ChevronLeft,
  ChevronRight,
  Close,
  CloudUploadOutlined,
  ContentCopy,
  CreditCard,
  Delete,
  DeleteOutlined,
  DescriptionOutlined,
  Download,
  EmojiEvents,
  Explore,
  FitnessCenterOutlined,
  Forum,
  ForumOutlined,
  GroupAdd,
  Handshake,
  HelpOutlined,
  HomeOutlined,
  InsertChart,
  InfoOutlined,
  JoinRight,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Lightbulb,
  Lock,
  School,
  Login,
  LogoutOutlined,
  Mail,
  MailOutline,
  NotificationsOutlined,
  OpenInNew,
  People,
  Person,
  PersonAdd,
  PersonOutlined,
  QuestionMark,
  RocketLaunch,
  Search,
  SettingsOutlined,
  Star,
  Storage,
  AutoAwesome,
  ExpandMore,
  LinkedIn,
  StopCircle,
  Sync,
  CalendarMonth,
  PlayCircleOutline,
  MenuBookOutlined,
} from "@mui/icons-material";
import * as React from "react";

const Icons = {
  Add,
  Adjust,
  ArrowBack,
  ArrowForward,
  BarChart,
  BorderColorOutlined,
  ChatBubbleOutlineOutlined,
  Check,
  ChevronLeft,
  ChevronRight,
  Close,
  CloudUploadOutlined,
  ContentCopy,
  CreditCard,
  Delete,
  DeleteOutlined,
  DescriptionOutlined,
  Download,
  EmojiEvents,
  Explore,
  FitnessCenterOutlined,
  Forum,
  ForumOutlined,
  GroupAdd,
  Handshake,
  HelpOutlined,
  HomeOutlined,
  InsertChart,
  InfoOutlined,
  JoinRight,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Lightbulb,
  Lock,
  School,
  Login,
  LogoutOutlined,
  Mail,
  MailOutline,
  NotificationsOutlined,
  OpenInNew,
  People,
  Person,
  PersonAdd,
  PersonOutlined,
  QuestionMark,
  RocketLaunch,
  Search,
  SettingsOutlined,
  Star,
  Storage,
  AutoAwesome,
  ExpandMore,
  LinkedIn,
  StopCircle,
  Sync,
  CalendarMonth,
  PlayCircleOutline,
  MenuBookOutlined,
};

export const ICON_NAMES = Object.keys(Icons);

// const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
//   backgroundColor:
//     theme.palette.mode === "dark" ? theme.palette.grey[700] : "#EAECF0",
//   zIndex: 1,
//   color: "#667085",
//   width: 48,
//   height: 48,
//   display: "flex",
//   borderRadius: "50%",
//   justifyContent: "center",
//   alignItems: "center",
//   ...(ownerState.active && {
//     color: theme.palette.common.white,
//     backgroundColor: theme.palette.primary.main,
//   }),
//   ...(ownerState.completed && {
//     color: theme.palette.common.white,
//     backgroundColor: theme.palette.secondary.light,
//   }),
//   [`&.${svgIconClasses.fontSizeSmall}`]: {
//     [`&.${svgIconClasses.root}`]: { fontSize: 14 },
//   },
// }));

export const Icon = ({ name, fallback, ...props }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.log("[missing icon]", name);
    return fallback || <QuestionMark {...props} />;
  }

  return <IconComponent {...props} />;
};

// // import { FitnessCenterOutlined, Forum, JoinRight } from "@mui/icons-material";
// import * as React from "react";

// // const Icons = {
// //   FitnessCenterOutlined,
// //   Forum,
// //   JoinRight,
// // };

// const IconInner = ({ name, ...props }) => {
//   const Component = React.lazy(() => import(`@mui/icons-material/${name}`));

//   <Component {...props} />;
// };

// export const Icon = (props) => {
//   return (
//     <React.Suspense fallback={"..."}>
//       <IconInner {...props} />;{/* <IconComponent {...props} />; */}
//     </React.Suspense>
//   );
// };

Icon.Icons = Icons;
