import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { StyledTab, StyledTabs, TabPanel } from "../Settings/Settings.page";
import { GetFeedbackForm } from "./GetFeedbackForm";
import { messages } from "./messages";
import { Results } from "./Results";
import { ShareFeedbackModal } from "./ShareFeedbackModal";
import { TLTabs } from "../Settings/Tabs";

const TABS = {
  form: "form",
  results: "results",
};

const GET_TABS = ({ msg, onShareForm }) => [
  {
    key: TABS.form,
    label: msg("feedback.tabs.form.label"),
    Component: GetFeedbackForm,
    props: { onShareForm },
  },
  {
    key: TABS.results,
    label: msg("feedback.tabs.results.label"),
    Component: Results,
    props: { onShareForm },
  },
];

function GetFeedbackPageInner() {
  const msg = useMsg();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const handleShareForm = useCallback(() => setShareModalOpen(true), []);
  const tabs = useMemo(
    () => GET_TABS({ msg, onShareForm: handleShareForm }),
    [handleShareForm, msg]
  );

  return (
    <Layout>
      <Header text={msg("feedback.heading")} />
      <TLTabs tabs={tabs} />
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
