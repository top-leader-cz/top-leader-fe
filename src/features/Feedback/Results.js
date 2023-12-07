import { Alert, Box, Card, CardContent, Divider } from "@mui/material";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { getLabel } from "../../components/Forms";
import { H2, P } from "../../components/Typography";
import { INPUT_TYPES } from "./constants";
import { useFeedbackOptions } from "./useFeedbackQuestionOptionsDict";

const TextResults = ({ data }) => {
  return (
    <>
      {data.map((text, i) => (
        <Box key={text + i}>
          <P sx={{ my: 2 }}>{text}</P>
          {i < data.length - 1 ? <Divider /> : null}
        </Box>
      ))}
    </>
  );
};

const ScaleResults = ({ data }) => {
  return (
    <Box display="flex" flexDirection="row" gap={2}>
      {data.map((value, index) => (
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

const FieldResults = ({ question, results }) => {
  if (!results) return <Alert severity="error">Missing results</Alert>;
  if (question.type === INPUT_TYPES.TEXT) return <TextResults data={results} />;
  if (question.type === INPUT_TYPES.SCALE)
    return <ScaleResults data={results} />;
  return null;
};

const FieldResultsCard = ({ index, question, feedback, sx }) => {
  const { optionsProps } = useFeedbackOptions();

  return (
    <ErrorBoundary>
      <Card elevation={0} sx={sx}>
        <CardContent>
          <H2 sx={{ mb: 2 }}>
            {index + 1}. {getLabel(optionsProps.options, question.key)}
          </H2>
          <FieldResults question={question} results={feedback?.results} />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

/* {
    "id": 74,
    "title": "MMFDBCK",
    "description": "Desc",
    "username": "slavik.dan12@gmail.com",
    "validTo": "2023-12-06T23:00:00",
    "questions": [
        {
            "key": "question.general.work-in-respectful-manners",
            "type": "PARAGRAPH",
            "required": true
        }
    ],
    "recipients": [
        {
            "id": 45,
            "username": "matej.matiasko@gmail.com",
            "submitted": false
        } ] } */

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
