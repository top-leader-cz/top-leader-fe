import { Box, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/system";
import { curryN, filter, find, pipe, prop } from "ramda";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

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

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minWidth: 8,
  minHeight: "16px",
  borderBottom: `1px solid rgba(0,0,0,0.12)`,
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

const queryParamName = "tab";

const findTab = curryN(2, (tabs, key) =>
  pipe(
    filter(prop("visible")),
    find((t) => t.key === key)
  )(tabs)
);

export const TLTabs = ({ tabs = [], initialTabKey, ariaLabel = "tabs" }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const queryTabKey = searchParams.get(queryParamName);
  const defaultTabKey = useMemo(() => {
    const key =
      [queryTabKey, initialTabKey].filter(findTab(tabs))?.[0] || tabs[0]?.key;
    return key;
  }, [initialTabKey, queryTabKey, tabs]);
  const [tabName, setTab] = useState(defaultTabKey);
  const handleChange = (event, newValue) => {
    try {
      setTab(newValue);
      searchParams.set(queryParamName, newValue);
      const qStr = searchParams.toString();
      setSearchParams(qStr);
    } catch (e) {
      console.error(e);
    }
  };
  const tabsRef = useRef(tabs);
  useEffect(() => {
    // console.log("TAB SYNC EFF START", { queryTabKey, current: tabName });
    if (
      queryTabKey &&
      queryTabKey !== tabName &&
      findTab(tabsRef.current, queryTabKey)
    ) {
      // console.log("TAB SYNC EFF RUN", { queryTabKey, current: tabName });
      setTab(queryTabKey);
    }
  }, [queryTabKey, tabName]);
  console.log("[TLTabs.rndr]", {
    tabs,
    tabName,
    queryTabKey,
    defaultTabKey,
  });

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
