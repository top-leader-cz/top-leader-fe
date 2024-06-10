import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Tooltip } from "@mui/material";
import { evolve, mergeRight, pipe, prop, slice } from "ramda";
import {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1, P } from "../../components/Typography";
import { routes } from "../../routes";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { controlsMessages } from "../Sessions/steps/Controls";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { getCollectedMaybe } from "./GetFeedback.page";
import { Results } from "./Results";
import { useFeedbackResultsQuery, useSaveFeedbackFormMutation } from "./api";
import { messages } from "./messages";
import { isBefore } from "date-fns/fp";
import { intervalToDuration } from "date-fns";

export const ConditionalWrapper = ({
  condition,
  WrapperComponent,
  wrapperProps = {},
  renderWrapped = ({ children }) => (
    <WrapperComponent {...wrapperProps}>{children}</WrapperComponent>
  ),
  children,
}) => {
  return condition ? renderWrapped({ children }) : children;
};

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
  const { language } = useContext(I18nContext);
  const handleSubmit = ({ recipient }) => {
    const updated = pipe(
      mergeRight({ locale: language }),
      evolve({
        recipients: (prev) => [...prev, { username: recipient }],
        locale: slice(0, 2),
      })
    )(feedback);
    mutation.mutate(updated);
  };
  const loading = mutation.isLoading;

  return (
    <RHForm form={form} onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
          mt: 1,
        }}
      >
        <RHFTextField
          name={"recipient"}
          placeholder={msg("feedback.results.email.placeholder")}
          rules={{ required: "Required" }}
          size="small"
          sx={{ flexGrow: 2 }}
          autoFocus
        />
        <LoadingButton variant="contained" type="submit" loading={loading}>
          {msg("feedback.results.add")}
        </LoadingButton>
      </Box>
    </RHForm>
  );
};

function useInterval(callback, delay) {
  const savedCallback = useRef();
  savedCallback.current = callback;

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const SharedWith = ({ feedback }) => {
  const msg = useMsg({ dict: messages });
  const [addVisible, setAddVisible] = useState(false);
  const handleAdd = () => setAddVisible(true);

  const [, rerender] = useReducer((x) => x + 1, 0);
  useInterval(rerender, 1000);
  const { i18n } = useContext(I18nContext);
  const isStillValid = isBefore(
    i18n.parseUTCLocal(feedback.validTo),
    Date.now()
  );
  const timeToExpire = i18n.dffp.formatDurationWithMergeOptions(
    {},
    intervalToDuration({
      start: Date.now(),
      end: i18n.parseUTCLocal(feedback.validTo),
    })
  );
  // const timeToExpire = i18n.dffp.formatDistanceWithMergeOptions(
  //   { addSuffix: false, includeSeconds: true },
  //   i18n.parseUTCLocal(feedback.validTo),
  //   Date.now()
  // );

  console.log("[SharedWith.rndr]", { feedback, isStillValid, timeToExpire });

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
        <ConditionalWrapper
          condition={isStillValid}
          WrapperComponent={Tooltip}
          wrapperProps={{
            title: timeToExpire,
          }}
        >
          <Button
            variant="text"
            startIcon={<Icon name="Add" />}
            onClick={handleAdd}
            sx={{
              ml: 1,
              visibility: addVisible ? "hidden" : "visible",
            }}
          >
            {msg("feedback.results.add-email")}
          </Button>
        </ConditionalWrapper>
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
    <Layout initialPrintLeftMenuHidden>
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
