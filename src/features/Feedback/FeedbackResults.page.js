import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1 } from "../../components/Typography";
import { routes } from "../../routes";
import { QueryRenderer } from "../QM/QueryRenderer";
import { Results } from "./Results";
import { useFeedbackResultsQuery } from "./api";
import { messages } from "./messages";

function FeedbackResultsPageInner() {
  const { id } = useParams();
  const msg = useMsg();
  const query = useFeedbackResultsQuery({ params: { id } });

  return (
    <Layout>
      <Header
        text={msg("feedback.create.heading")}
        back={{ href: routes.dashboard }}
      />
      <H1 mb={4}>{msg("feedback.heading")}</H1>
      <QueryRenderer
        data={{}}
        // {...query}
        success={({ data }) => {
          return <Results feedbackResults={data} />;
        }}
      />
    </Layout>
  );
}

export function FeedbackResultsPage() {
  return (
    <MsgProvider messages={messages}>
      <FeedbackResultsPageInner />
    </MsgProvider>
  );
}
