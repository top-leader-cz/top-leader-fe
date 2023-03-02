import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { StyledTab, StyledTabs, TabPanel } from "../Settings/Settings.page";
import { GetFeedbackForm } from "./GetFeedbackForm";
import { messages } from "./messages";
import { Results } from "./Results";
import { ShareFeedbackModal } from "./ShareFeedbackModal";

const TABS = {
  form: "form",
  results: "results",
};

function GetFeedbackPageInner() {
  const msg = useMsg();
  const [tab, setTab] = useState(TABS.form);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const handleShareForm = useCallback(() => setShareModalOpen(true), []);

  return (
    <Layout>
      <Header text={msg("feedback.heading")} />
      <Box sx={{ width: "100%" }}>
        <StyledTabs value={tab} onChange={handleChange}>
          <StyledTab
            label={msg("feedback.tabs.form.label")}
            value={TABS.form}
            // {...a11yProps(TABS.form)}
          />
          <StyledTab
            label={msg("feedback.tabs.results.label")}
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

export function GetFeedbackPage() {
  return (
    <MsgProvider messages={messages}>
      <GetFeedbackPageInner />
    </MsgProvider>
  );
}
