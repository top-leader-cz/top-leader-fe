import { Alert, Box, Card, CardContent, Divider } from "@mui/material";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { getLabel } from "../../components/Forms";
import { H2, P } from "../../components/Typography";
import { INPUT_TYPES } from "./constants";
import { useFeedbackOptions } from "./useFeedbackQuestionOptionsDict";
import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";
import { multiply, pipe, replace, tap } from "ramda";

const TextResults = ({ answers = [] }) => {
  return (
    <>
      {answers.map(({ answer: text, recipient }, i) => (
        <Box key={text + i}>
          <P sx={{ my: 2, color: "#344054" }}>{text}</P>
          {i < answers.length - 1 ? <Divider /> : null}
        </Box>
      ))}
    </>
  );
};

const toPercents = (value) =>
  pipe(
    replace("scale.", ""), // scale.1 .. scale.10
    (n) => parseInt(n, 10),
    multiply(10),
    tap((percents) => console.log("toScore", { value, percents }))
  )(value);

const ScaleResults = ({ answers = [] }) => {
  return (
    <Box display="flex" flexDirection="row" gap={2}>
      {answers.map(
        ({ recipient, answer, _percents = toPercents(answer) }, index) => (
          <Box
            key={`${_percents}_${index}_${recipient}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <P sx={{ mb: 0.5 }}>{_percents}%</P>
            <Box
              sx={{
                width: { xs: 20, md: 35, xl: 60 },
                height: 120,
                bgcolor: "#F9FAFB",
                borderRadius: "4px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: _percents + "%",
                  bgcolor: "primary.main",
                  borderRadius: "4px",
                }}
              />
            </Box>
            <P sx={{ mt: 0.5 }}>{index + 1}</P>
          </Box>
        )
      )}
    </Box>
  );
};

const messages = defineMessages({
  "feedback.results.no-answers": {
    id: "feedback.results.no-answers",
    defaultMessage: "No answers yet.",
  },
  "feedback.results.question-answers-stats": {
    id: "feedback.results.question-answers-stats",
    defaultMessage: "{answersCount} of {recipientsCount} people answered",
  },
});

const FieldResults = ({ question }) => {
  // const msg = useMsg({ dict: messages });
  if (!question?.answers?.length) return null;
  // return <Alert severity="info">{msg("feedback.results.no-answers")}</Alert>;

  if (question.type === INPUT_TYPES.TEXT)
    return <TextResults answers={question?.answers} />;
  if (question.type === INPUT_TYPES.SCALE)
    return <ScaleResults answers={question?.answers} />;

  return null;
};

export const FieldResultsCard = ({ index, question, feedback, sx }) => {
  const msg = useMsg({ dict: messages });
  const { optionsProps } = useFeedbackOptions();
  const answersCount =
    question?.answers?.filter(({ answer }) => !!answer?.trim())?.length || 0;
  const recipientsCount = feedback?.recipients?.length || 0;

  return (
    <ErrorBoundary>
      <Card sx={sx}>
        <CardContent>
          <H2 sx={{ mb: 2 }}>
            {index + 1}. {getLabel(optionsProps.options, question.key)}{" "}
            {question.required ? "*" : null}
          </H2>
          <P>
            {msg("feedback.results.question-answers-stats", {
              answersCount,
              recipientsCount,
            })}
          </P>
          <FieldResults question={question} />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
