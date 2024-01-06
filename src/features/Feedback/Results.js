import { Alert, Box, Card, CardContent, Divider } from "@mui/material";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { getLabel } from "../../components/Forms";
import { H2, P } from "../../components/Typography";
import { INPUT_TYPES } from "./constants";
import { useFeedbackOptions } from "./useFeedbackQuestionOptionsDict";
import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";

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

const ScaleResults = ({ answers = [] }) => {
  return (
    <Box display="flex" flexDirection="row" gap={2}>
      {answers.map(({ answer: value }, index) => (
        <Box
          key={`${value}_${index}`}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <P sx={{ mb: 0.5 }}>{value}%</P>
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
                height: value + "%",
                bgcolor: "primary.main",
                borderRadius: "4px",
              }}
            />
          </Box>
          <P sx={{ mt: 0.5 }}>{index + 1}</P>
        </Box>
      ))}
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
  const msg = useMsg({ dict: messages });
  if (!question?.answers?.length)
    return <Alert severity="info">{msg("feedback.results.no-answers")}</Alert>;
  if (question.type === INPUT_TYPES.TEXT)
    return <TextResults answers={question?.answers} />;
  if (question.type === INPUT_TYPES.SCALE)
    return <ScaleResults answers={question?.answers} />;
  return null;
};

const FieldResultsCard = ({ index, question, feedback, sx }) => {
  const msg = useMsg({ dict: messages });
  const { optionsProps } = useFeedbackOptions();
  const answersCount = question?.answers?.length || 0;
  const recipientsCount = feedback?.recipients?.length || 0;

  return (
    <ErrorBoundary>
      <Card sx={sx}>
        <CardContent>
          <H2 sx={{ mb: 2 }}>
            {index + 1}. {getLabel(optionsProps.options, question.key)}
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

export const Results = ({ feedback }) => {
  return (
    <>
      {feedback?.questions?.map((question, i) => (
        <FieldResultsCard
          key={question.id ?? i}
          index={i}
          question={question}
          feedback={feedback}
          sx={{ mt: 3 }}
        />
      ))}
    </>
  );
};
