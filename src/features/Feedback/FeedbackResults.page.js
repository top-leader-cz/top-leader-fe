import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Divider,
  Tooltip,
} from "@mui/material";
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
import { FieldResultsCard } from "./Results";
import { useFeedbackResultsQuery, useSaveFeedbackFormMutation } from "./api";
import { messages } from "./messages";
import { isBefore } from "date-fns/fp";
import { intervalToDuration } from "date-fns";
import { HeadingWithIcon } from "../Dashboard/HeadingWithIcon";
import { gray900, primary25 } from "../../theme";

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

const SUMMARY_MOCK = {
  strongAreas:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  areasOfImprovement: "areasOfImprovement",
};

const InfoBox = ({ title, text, sx = {} }) => {
  return (
    <Box
      sx={{
        bgcolor: primary25,
        mb: 1,
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        p: 2,
        ...sx,
      }}
    >
      <HeadingWithIcon emphasized withoutIcon title={title} />
      <P bigger sx={{ color: gray900 }}>
        {text}
      </P>
    </Box>
  );
};

const FeedbackResultsSummaryCard = ({ summary, sx }) => {
  const msg = useMsg({ dict: messages });
  const { strongAreas, areasOfImprovement } = summary || {};

  if (!strongAreas && !areasOfImprovement) return null;

  return (
    <Card sx={sx}>
      <Accordion
        defaultExpanded
        sx={{
          // bgcolor: gray50,
          borderRadius: "8px",
          "&:before": {
            display: "none", // remove border
          },
        }}
      >
        <AccordionSummary
          expandIcon={<Icon name="ExpandMore" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <HeadingWithIcon emphasized title={msg("feedback.results.summary")} />
        </AccordionSummary>
        {/* <CardActionArea sx={{}} href={href}> */}
        <AccordionDetails
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            gap: 3,
            pt: 0,
          }}
        >
          {!!strongAreas && (
            <InfoBox
              sx={{ flex: 1 }}
              title={msg("feedback.results.summary.strong-areas")}
              text={strongAreas}
            />
          )}
          {!!areasOfImprovement && (
            <InfoBox
              sx={{ flex: 1 }}
              title={msg("feedback.results.summary.areas-of-improvement")}
              text={areasOfImprovement}
            />
          )}
        </AccordionDetails>
        {/* </CardActionArea> */}
      </Accordion>
    </Card>
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
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FeedbackResultsSummaryCard
                summary={feedback?.summary}
                // summary={SUMMARY_MOCK}
              />
              {feedback?.questions?.map((question, i) => (
                <FieldResultsCard
                  key={question.id ?? i}
                  index={i}
                  question={question}
                  feedback={feedback}
                  // sx={{ mt: 3 }}
                />
              ))}
            </Box>
          );
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
