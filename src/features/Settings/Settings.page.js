import {
  Avatar,
  Box,
  Button,
  Chip,
  OutlinedInput,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { format } from "date-fns-tz";
import { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { TextHeader } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout, useRightMenu } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import {
  FIELD_OPTIONS,
  getLabel,
  LANGUAGE_OPTIONS,
  renderLanguageOption,
} from "../Coaches/Coaches.page";
import { AutocompleteSelect } from "../Coaches/Fields";
import { AvailabilitySettings } from "./AvailabilitySettings";
import { FormRow } from "./FormRow";
import { GeneralSettings } from "./GeneralSettings";
import { ProfileSettings } from "./ProfileSettings";

function TabPanel({ children, value, tabName }) {
  console.log("TabPanel", { value, tabName });
  return (
    <Box
      role="tabpanel"
      hidden={value !== tabName}
      id={`simple-tabpanel-${tabName}`}
      aria-labelledby={`simple-tab-${tabName}`}
      sx={{ mt: 3 }}
    >
      {value === tabName && children}
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

const StyledTabs = styled(Tabs)(({ theme }) => ({
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

const StyledTab = styled(Tab)(({ theme }) => ({
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

export function SettingsPage() {
  const [tab, setTab] = useState(TABS.PROFILE);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  console.log("[SettingsPage.rndr]", { tab });

  return (
    <Layout>
      <TextHeader text={"Settings"} noDivider />
      <Box sx={{ width: "100%" }}>
        <StyledTabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab
            label={"Profile"}
            value={TABS.PROFILE}
            {...a11yProps(TABS.PROFILE)}
          />
          <StyledTab
            label={"General"}
            value={TABS.GENERAL}
            {...a11yProps(TABS.GENERAL)}
          />
          <StyledTab
            label={"Availability"}
            value={TABS.AVAILABILITY}
            {...a11yProps(TABS.AVAILABILITY)}
          />
        </StyledTabs>
        {/* </Box> */}
        <TabPanel value={tab} tabName={TABS.PROFILE}>
          <ProfileSettings />
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.GENERAL}>
          <GeneralSettings />
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.AVAILABILITY}>
          <AvailabilitySettings />
        </TabPanel>
      </Box>
    </Layout>
  );
}
