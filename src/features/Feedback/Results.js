import { Box, Card, CardContent, Divider } from "@mui/material";
import { useMemo } from "react";
import { getLabel } from "../../components/Forms";
import { useRightMenu } from "../../components/Layout";
import { H2, P } from "../../components/Typography";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { FIELDS, INPUT_TYPES } from "./GetFeedbackForm";

// TODO: useFeedbackQuestionOptionsDict
const QUESTION_TITLE_OPTIONS = [
  {
    value: "$id_style_rating",
    label: "What do you consider good about my leadership style?",
  },
  {
    value: "$id_public_speak_rating",
    label: "How good am I at public speaking?",
  },
];

const TODO = 2;

const MOCK_TEXT_RESULTS = [
  "Asperiores dolores temporibus voluptas facere a illum ducimus explicabo nostrum. Dolores dolorem ab qui voluptatem. Ut in minima ut quo expedita. Unde et ut voluptate amet quis omnis.",
  "Placeat officiis unde quia qui nobis ipsum omnis. Eos quas quasi dolores libero nemo ad eligendi. Eveniet placeat repellendus modi soluta repellat. Labore eveniet enim nostrum. Ut rerum dolore quis. Quas quae sunt quo id ex.",
];
const MOCK_SCALE_RESULTS = [0, 0, 0, 0, 0, 0, 0, 0, 50, 50];
const MOCK_RESULTS = [
  {
    title: QUESTION_TITLE_OPTIONS[0].value,
    inputType: INPUT_TYPES.TEXT,
    data: MOCK_TEXT_RESULTS,
  },
  {
    title: QUESTION_TITLE_OPTIONS[1].value,
    inputType: INPUT_TYPES.SCALE,
    data: MOCK_SCALE_RESULTS,
  },
];

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

const FieldResults = ({ field }) => {
  if (field.inputType === INPUT_TYPES.TEXT)
    return <TextResults data={field.data} />;
  if (field.inputType === INPUT_TYPES.SCALE)
    return <ScaleResults data={field.data} />;
  return null;
};

const FieldResultsCard = ({ index, field, sx }) => {
  return (
    <Card elevation={0} sx={sx}>
      <CardContent>
        <H2 sx={{ mb: 2 }}>
          {index + 1}. {getLabel(QUESTION_TITLE_OPTIONS)(field[FIELDS.title])}
        </H2>

        <FieldResults field={field} />
      </CardContent>
    </Card>
  );
};

const collected = {
  count: 1,
  total: 10,
};

export const Results = ({ feedbackResults }) => {
  useRightMenu(
    useMemo(
      () => (
        <FeedbackRightMenu
          collected={collected}
          stats={[
            { label: "Views", value: TODO },
            { label: "Submitted", value: TODO },
          ]}
          // buttonProps={{
          //   children: "Share form",
          //   onClick: onShareForm,
          // }}
        />
      ),
      []
    )
  );

  console.log("[GetFeedbackPage.rndr]", {});

  return (
    <>
      {MOCK_RESULTS.map((field, i) => (
        <FieldResultsCard
          key={field.id ?? i}
          index={i}
          field={field}
          sx={{ mt: 3 }}
        />
      ))}
    </>
  );
};
