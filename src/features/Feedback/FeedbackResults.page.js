import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1 } from "../../components/Typography";
import { routes } from "../../routes";
import { QueryRenderer } from "../QM/QueryRenderer";
import { Results } from "./Results";
import { useFeedbackOptionsQuery, useFeedbackResultsQuery } from "./api";
import { messages } from "./messages";
import { controlsMessages } from "../Sessions/steps/Controls";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { useMemo } from "react";
import { getCollectedMaybe } from "./GetFeedback.page";

function FeedbackResultsPageInner() {
  const { id } = useParams();
  const msg = useMsg();
  const query = useFeedbackResultsQuery({ params: { id } });
  const controlsMsg = useMsg({ dict: controlsMessages });

  const feedbackOptionsQuery = useFeedbackOptionsQuery({});

  console.log("[GetFeedbackPage]", {});
  // debugger;

  useRightMenu(
    useMemo(() => {
      const collected = getCollectedMaybe(query.data?.recipients);
      return (
        <FeedbackRightMenu
          isLoading={!query.data}
          collected={collected}
          stats={[
            // { label: "Views", value: TODO },
            { label: "Submitted", value: collected?.count ?? 0 },
          ]}
          // buttonProps={{
          //   children: "Share form",
          //   onClick: onShareForm,
          // }}
        />
      );
    }, [query.data])
  );

  return (
    <Layout>
      <Header
        // back={{ href: routes.dashboard }}
        // text={msg("feedback.create.heading")} // TODO: change textation and use this
        text={controlsMsg("controls.back")}
        back={{ href: routes.getFeedback }}
      />
      <H1 mb={4}>{msg("feedback.heading")}</H1>
      <QueryRenderer
        query={feedbackOptionsQuery}
        success={({ data: feedbackOptions }) => (
          <QueryRenderer
            query={query}
            success={({ data: feedback }) => {
              return (
                <Results
                  feedback={feedback}
                  // feedbackOptions={feedbackOptions}
                />
              );
            }}
          />
        )}
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
