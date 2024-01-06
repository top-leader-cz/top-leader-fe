import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1, P } from "../../components/Typography";
import { routes } from "../../routes";
import { QueryRenderer } from "../QM/QueryRenderer";
import { controlsMessages } from "../Sessions/steps/Controls";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { getCollectedMaybe } from "./GetFeedback.page";
import { Results } from "./Results";
import { useFeedbackResultsQuery, useSaveFeedbackFormMutation } from "./api";
import { messages } from "./messages";
import { evolve, prop } from "ramda";
import { Box, Button, Divider } from "@mui/material";
import { Icon } from "../../components/Icon";
import { RHForm } from "../../components/Forms/Form";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";

const AddRecipient = ({ feedback, onSuccess }) => {
  const msg = useMsg({ dict: messages });
  const form = useForm({
    defaultValues: { recipient: "" },
  });
  const mutation = useSaveFeedbackFormMutation({
    id: feedback?.id,
    enabled: !!feedback?.id,
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });
  const handleSubmit = ({ recipient }) => {
    const updated = evolve({
      recipients: (prev) => [...prev, { username: recipient }],
    })(feedback);
    mutation.mutate(updated);
  };
  const disabled = mutation.isLoading;

  return (
    <RHForm form={form} onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: 3,
          mt: 1,
        }}
      >
        <RHFTextField
          name={"recipient"}
          placeholder="Email"
          rules={{ required: "Required" }}
          size="small"
          sx={{ flexGrow: 2 }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={disabled}
          sx={{ ml: 1, alignItems: "center", justifyContent: "space-between" }}
          // startIcon={<Icon name="Add" />}
          // onClick={handleAdd}
        >
          {msg("feedback.results.add-email")}
        </Button>
      </Box>
    </RHForm>
  );
};

const SharedWith = ({ feedback }) => {
  const msg = useMsg({ dict: messages });
  const [addVisible, setAddVisible] = useState(false);
  const handleAdd = () => setAddVisible(true);

  // if (!feedback?.recipients) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <P bigger sx={{ color: "black" }}>
          {msg("feedback.results.shared-with")}
        </P>
        <Button
          variant="text"
          startIcon={<Icon name="Add" />}
          // disabled={addVisible}
          onClick={handleAdd}
          sx={{
            ml: 1,
            visibility: addVisible ? "hidden" : "visible",
          }}
        >
          {msg("feedback.results.add-email")}
        </Button>
      </Box>

      {addVisible && (
        <AddRecipient
          feedback={feedback}
          onSuccess={() => setAddVisible(false)}
        />
      )}

      {feedback?.recipients?.map(({ username, submitted }, i) => (
        <P bigger sx={{ mt: 2 }}>
          {username}
        </P>
      ))}
    </Box>
  );
};

function FeedbackResultsPageInner() {
  const { id } = useParams();
  const msg = useMsg();
  const query = useFeedbackResultsQuery({ params: { id } });
  const controlsMsg = useMsg({ dict: controlsMessages });

  console.log("[FeedbackResultsPageInner]", { data: query.data });
  // debugger;

  useRightMenu(
    useMemo(() => {
      const collected = getCollectedMaybe(query.data);
      console.log("[FeedbackResultsPageInner.memo]", {
        data: query.data,
        collected,
      });

      return (
        <FeedbackRightMenu
          isLoading={!query.data}
          collected={collected}
          stats={[
            {
              label: msg("feedback.respondents"),
              value: query.data?.recipients?.length || 0,
            },
            {
              label: msg("feedback.submitted"),
              value:
                query.data?.recipients?.filter(prop("submitted"))?.length || 0,
            },
          ]}
          // buttonProps={{ children: "Share form", onClick: onShareForm, }}
        >
          <Divider sx={{ my: 3 }} />
          <SharedWith feedback={query.data} />
        </FeedbackRightMenu>
      );
    }, [msg, query.data])
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
        query={query}
        success={({ data: feedback }) => {
          return <Results feedback={feedback} />;
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
