import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1 } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { Results } from "./Results";
import { messages } from "./messages";

function FeedbackResultsPageInner() {
  const msg = useMsg();
  const { language } = useContext(I18nContext);
  const { authFetch, user } = useAuth();
  const [formBuilderValues, setFormBuilderValues] = useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const feedbackResultsQuery = useMyQuery({
    queryKey: ["feedback", "results"],
    fetchDef: { url: `/api/latest/feedback/TODO` },
  });
  //   const postFeedbackFormMutation = useMutation({
  //     mutationFn: async (data) =>
  //       console.log("mutating", { data }) ||
  //       authFetch({
  //         method: "POST",
  //         url: "/api/latest/feedback",
  //         data,
  //       }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ exact: false, queryKey: ["feedback"] });
  //       setFormBuilderValues();
  //       navigate(routes.getFeedback);
  //     },
  //   });

  return (
    <Layout>
      <Header
        text={msg("feedback.create.heading")}
        back={{ href: routes.dashboard }}
      />
      <H1 mb={4}>{msg("feedback.heading")}</H1>
      <QueryRenderer
        data={{}}
        // {...feedbackResultsQuery}
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
