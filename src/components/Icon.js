// import * as Icons from "@mui/icons-material";
import {
  FitnessCenterOutlined,
  Forum,
  JoinRight,
  Handshake,
  InsertChart,
  InsertChartOutlined,
  InsertChartOutlinedRounded,
  BarChart,
  BarChartOutlined,
  BarChartRounded,
  QuestionMark,
  Adjust,
  RocketLaunch,
  Explore,
  Lightbulb,
  ArrowForward,
  CreditCard,
  Lock,
  Star,
  Search,
  Mail,
  Close,
  CloudUploadOutlined,
} from "@mui/icons-material";
import * as React from "react";

const Icons = {
  FitnessCenterOutlined,
  Forum,
  JoinRight,
  Handshake,
  InsertChart,
  BarChart,
  Adjust,
  RocketLaunch,
  Explore,
  Lightbulb,
  ArrowForward,
  CreditCard,
  Lock,
  Star,
  Search,
  Mail,
  Close,
  CloudUploadOutlined,
};

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
