import { Box, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as qs from "qs";

export function TabPanel({ children, Component, value, tabName, props = {} }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== tabName}
      id={`simple-tabpanel-${tabName}`}
      aria-labelledby={`simple-tab-${tabName}`}
      sx={{ mt: 3, pb: 4 }}
    >
      {value === tabName && (children || <Component {...props} />)}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const StyledTab = Tab;

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  // padding: "0 8px",
  minWidth: 8,
  minHeight: "16px",
  borderBottom: `1px solid rgba(0,0,0,0.12)`,
  // fontWeight: 400,
  // textTransform: "none",
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 400,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: "8px",
  paddingLeft: 0,
  minWidth: 8,
  minHeight: "16px",
  margin: "0 16px",
  "&:first-of-type": {
    marginLeft: 0,
  },
}));

// interface StyledTabProps {
//   label: string;
// }

// const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
//   ({ theme }) => ({
//     textTransform: "none",
//     fontWeight: theme.typography.fontWeightRegular,
//     fontSize: theme.typography.pxToRem(15),
//     marginRight: theme.spacing(1),
//     color: "rgba(255, 255, 255, 0.7)",
//     "&.Mui-selected": {
//       color: "#fff",
//     },
//     "&.Mui-focusVisible": {
//       backgroundColor: "rgba(100, 95, 228, 0.32)",
//     },
//   })
// );

const queryParamName = "tab";

export const TLTabs = ({ tabs = [], initialTabKey, ariaLabel = "tabs" }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const queryTabKey = searchParams.get(queryParamName);
  const defaultTabKey = useMemo(() => {
    return initialTabKey || queryTabKey || tabs[0]?.key;
  }, [initialTabKey, queryTabKey, tabs]);
  const [tabName, setTab] = useState(defaultTabKey);
  const handleChange = (event, newValue) => {
    try {
      // console.log("[TLTabs.change]", { value: tabName, newValue });
      setTab(newValue);

      searchParams.set(queryParamName, newValue);
      const qStr = searchParams.toString();
      // console.log("[TLTabs.change]", { qStr });
      setSearchParams(qStr);
    } catch (e) {
      console.error(e);
      // debugger;
    }
  };
  useEffect(() => {
    // console.log("TAB SYNC EFF START", { queryTabKey, current: tabName });
    if (queryTabKey && queryTabKey !== tabName) {
      // console.log("TAB SYNC EFF RUN", { queryTabKey, current: tabName });
      setTab(queryTabKey);
    }
  }, [queryTabKey, tabName]);
  // console.log("[TLTabs.rndr]", {
  //   tabName,
  //   queryTabKey,
  //   defaultTabKey,
  // });

  return (
    <Box sx={{ width: "100%" }}>
      <StyledTabs
        value={tabName}
        onChange={handleChange}
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => (
          <StyledTab
            key={tab.label}
            label={tab.label}
            value={tab.key}
            {...a11yProps(tab.label)}
          />
        ))}
      </StyledTabs>

      {tabs.map((tab) => (
        <TabPanel
          key={tab.key}
          value={tabName}
          tabName={tab.key}
          Component={tab.Component}
          props={tab.props}
        />
      ))}
    </Box>
  );
};

// function CustomizedTabs() {
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Box sx={{ bgcolor: "#fff" }}>
//         <AntTabs value={value} onChange={handleChange} aria-label="ant example">
//           <AntTab label="Tab 1" />
//           <AntTab label="Tab 2" />
//           <AntTab label="Tab 3" />
//         </AntTabs>
//         <Box sx={{ p: 3 }} />
//       </Box>
//       <Box sx={{ bgcolor: "#2e1534" }}>
//         <StyledTabs
//           value={value}
//           onChange={handleChange}
//           aria-label="styled tabs example"
//         >
//           <StyledTab label="Workflows" />
//           <StyledTab label="Datasets" />
//           <StyledTab label="Connections" />
//         </StyledTabs>
//         <Box sx={{ p: 3 }} />
//       </Box>
//     </Box>
//   );
// }
