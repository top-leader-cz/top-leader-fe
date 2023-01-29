import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import { TextHeader } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { StyledTab, StyledTabs, TabPanel } from "../Settings/Settings.page";
import { GetFeedbackForm } from "./GetFeedbackForm";
import { Results } from "./Results";
import { ShareFeedbackModal } from "./ShareFeedbackModal";

const TABS = {
  form: "form",
  results: "results",
};

export function GetFeedbackPage() {
  const [tab, setTab] = useState(TABS.form);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const handleShareForm = useCallback(() => setShareModalOpen(true), []);

  return (
    <Layout>
      <TextHeader text={"Feedback form"} sx={{}} />
      <Box sx={{ width: "100%" }}>
        <StyledTabs value={tab} onChange={handleChange}>
          <StyledTab
            label={"Form"}
            value={TABS.form}
            // {...a11yProps(TABS.form)}
          />
          <StyledTab
            label={"Results"}
            value={TABS.results}
            // {...a11yProps(TABS.results)}
          />
        </StyledTabs>
        <TabPanel value={tab} tabName={TABS.form}>
          <GetFeedbackForm onShareForm={handleShareForm} />
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.results}>
          <Results onShareForm={handleShareForm} />
        </TabPanel>
      </Box>
      <ShareFeedbackModal
        open={!!shareModalOpen}
        onSubmit={console.log.bind(console, "onSubmit")}
        onClose={() => setShareModalOpen(false)}
        link="http://topleader.io/juRcHHx7r8QTPYP"
      />
    </Layout>
  );
}
