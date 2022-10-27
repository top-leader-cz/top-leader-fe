// import * as Icons from "@mui/icons-material";
import { FitnessCenterOutlined, Forum, JoinRight } from "@mui/icons-material";
import * as React from "react";

const Icons = {
  FitnessCenterOutlined,
  Forum,
  JoinRight,
};

export const Icon = ({ name = "FitnessCenterOutlined", ...props }) => {
  const IconComponent = Icons[name];
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
