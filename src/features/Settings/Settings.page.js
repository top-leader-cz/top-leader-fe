import { Box, styled, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { AvailabilitySettings } from "./AvailabilitySettings";
import { GeneralSettings } from "./GeneralSettings";
import { messages } from "./messages";
import { ProfileSettings } from "./ProfileSettings";

export function TabPanel({ children, Component, value, tabName }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== tabName}
      id={`simple-tabpanel-${tabName}`}
      aria-labelledby={`simple-tab-${tabName}`}
      sx={{ mt: 3, pb: 4 }}
    >
      {value === tabName && (children || <Component />)}
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

export const WHITE_BG = { "& .MuiOutlinedInput-root": { bgcolor: "white" } };

const TABS = {
  PROFILE: "PROFILE",
  GENERAL: "GENERAL",
  AVAILABILITY: "AVAILABILITY",
};

function SettingsPageInner() {
  // const [tab, setTab] = useState(TABS.AVAILABILITY);
  const msg = useMsg();
  const [tab, setTab] = useState(TABS.PROFILE);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  console.log("[SettingsPage.rndr]", { tab });

  return (
    <Layout>
      <Header text={msg("settings.heading")} noDivider />
      <Box sx={{ width: "100%" }}>
        <StyledTabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab
            label={msg("settings.tabs.profile.label")}
            value={TABS.PROFILE}
            {...a11yProps(TABS.PROFILE)}
          />
          <StyledTab
            label={msg("settings.tabs.general.label")}
            value={TABS.GENERAL}
            {...a11yProps(TABS.GENERAL)}
          />
          <StyledTab
            label={msg("settings.tabs.availability.label")}
            value={TABS.AVAILABILITY}
            {...a11yProps(TABS.AVAILABILITY)}
          />
        </StyledTabs>
        {/* </Box> */}
        <TabPanel
          value={tab}
          tabName={TABS.PROFILE}
          Component={ProfileSettings}
        />
        <TabPanel
          value={tab}
          tabName={TABS.GENERAL}
          Component={GeneralSettings}
        />
        <TabPanel
          value={tab}
          tabName={TABS.AVAILABILITY}
          Component={AvailabilitySettings}
        />
      </Box>
    </Layout>
  );
}

export function SettingsPage() {
  return (
    <MsgProvider messages={messages}>
      <SettingsPageInner />
    </MsgProvider>
  );
}
