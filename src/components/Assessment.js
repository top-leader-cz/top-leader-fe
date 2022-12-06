import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { useAuth } from "../features/auth";
import { Layout } from "./Layout";
import { H1, H2, P } from "./Typography";
import { ArrowBack, ArrowForward, ArrowRight } from "@mui/icons-material";
import { routes } from "../features/navigation";

const ProgressItem = ({ value, active }) => {
  const Component = active ? "b" : "span";

  return (
    <>
      <Component sx={{ right: 12 }}>{value}</Component>&nbsp;
    </>
  );
};

const AssessmentProgress = ({ currentIndex, totalCount, sx = {} }) => {
  const currentQuestion = currentIndex + 1;

  return (
    <Box sx={sx}>
      <P sx={{ justifyContent: "center", display: "flex", cursor: "default" }}>
        {currentQuestion !== 1 && <ProgressItem value={1} />}
        <ProgressItem value={currentQuestion} active />
        {currentQuestion !== totalCount && <ProgressItem value={totalCount} />}
      </P>
      {/* <Pagination
          count={10}
          page={pagination.currentIndex}
            disabled
            onChange={handleChange}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
        /> */}
    </Box>
  );
};

const Score = ({ value, onChange, sx = {} }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      {...sx}
    >
      <P>Not me at all</P>
      <Box mx={2}>
        {Array(10)
          .fill()
          .map((_, i) => (
            <Button
              variant={value === i + 1 ? "contained" : "outlined"}
              sx={{ minWidth: 32, mx: 1 }}
              onClick={() => onChange({ value: i + 1 })}
            >
              {i + 1}
            </Button>
          ))}
      </Box>
      <P>Totally me</P>
    </Box>
  );
};

const PROGRESS_PROPS = {
  size: 220,
  thickness: 4,
};

function CircularProgressWithLabel({ value, sx = {} }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex", ...sx }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        {...PROGRESS_PROPS}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={{
          position: "absolute",
          left: 0,
          // color: (theme) =>
          //   theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          // animationDuration: "550ms",
          // [`& .${circularProgressClasses.circle}`]: {
          //   strokeLinecap: "round",
          // },
        }}
        value={value}
        {...PROGRESS_PROPS}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column nowrap",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          Progress
        </Typography>
        <Typography variant="h1" component="div">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Count = ({ label, value, sx = {} }) => {
  return (
    <Box sx={{ display: "flex", flexFlow: "column nowrap", ...sx }}>
      <Typography variant="body" mb={2}>
        {label}
      </Typography>
      <Typography variant="h1">{value}</Typography>
    </Box>
  );
};

const AssessmentRightMenu = ({ currentIndex, totalCount, responsesCount }) => {
  return (
    <Paper
      square
      sx={{
        px: 3,
        py: 4,
        height: "100vh",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexFlow: "column nowrap" }}>
        <H2>Find my strengths assessment</H2>
        <CircularProgressWithLabel
          sx={{ alignSelf: "center", my: 7.5 }}
          value={25}
        />
        <Box
          sx={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "space-between",
          }}
        >
          <Count sx={{ flexGrow: 1 }} label="Questions" value={totalCount} />
          <Count
            sx={{ flexGrow: 1 }}
            label="Responses"
            value={responsesCount}
          />
        </Box>
      </Box>
      <Button fullWidth variant="contained">
        Save assessment
      </Button>
    </Paper>
  );
};

const version = 0;
const QUESTIONS = [
  {
    id: 1,
    version,
    data: {
      talent: "empathizer",
      text: "I easily help others to find the right words to express their feelings.",
      img: { src: "/Empathizer_02.svg" },
    },
  },
  {
    id: 2,
    version,
    data: {
      talent: "initiator",
      text: `"Don't stop me now!" Do you find yourself often in a situation where you just need to take action?`,
      img: { src: "/Initiator_01.svg" },
    },
  },
  {
    id: 3,
    version,
    data: {
      talent: "initiator",
      text: `"Hey everyone, let's start!" Does it sound like you?`,
      img: { src: "/Initiator_02.svg" },
    },
  },
  {
    id: 4,
    version,
    data: {
      talent: "initiator",
      text: `"I can't stand it when there's no action! I hate wasting time." Is that you?`,
      img: { src: "/Initiator_03.svg" },
    },
  },
];

const useAssessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({});

  const question = QUESTIONS[currentIndex];

  console.log("[useAssessment]", { currentIndex, scores, question });

  return {
    pagination: {
      currentIndex,
      totalCount: QUESTIONS.length,
      back: () => setCurrentIndex((i) => i - 1),
      next: () => setCurrentIndex((i) => i + 1),
      onChange: ({ value }) => {
        setCurrentIndex(value);
      },
    },
    question: question.data,
    score: {
      value: scores[question.id],
      onChange: ({ value }) => {
        setScores((prev) => ({ ...prev, [question.id]: value }));
      },
    },
    responsesCount: Object.values(scores).filter(
      (score) => typeof score === "number"
    ).length,
  };
};

function Assessment() {
  const { authFetch } = useAuth();
  const { pagination, question, score, responsesCount } = useAssessment();

  console.log("[Assessment.rndr]", { pagination, question, score });
  return (
    <Layout
      rightMenuContent={
        <AssessmentRightMenu
          currentIndex={pagination.currentIndex}
          totalCount={pagination.totalCount}
          responsesCount={responsesCount}
        />
      }
    >
      <Box mt={4} mb={3}>
        <Box
          display="flex"
          flexWrap="nowrap"
          alignItems="center"
          flexDirection="row"
        >
          <Button href={routes.dashboard}>
            <ArrowBack />
            <H2>Back to the dashboard</H2>
          </Button>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      <AssessmentProgress
        sx={{ my: 4 }}
        currentIndex={pagination.currentIndex}
        totalCount={pagination.totalCount}
      />
      <H1 my={7.5} minHeight={"4rem"} align="center">
        {question.text}
      </H1>
      <Box width="100%" align="center">
        <Box
          component="img"
          borderRadius={2}
          width={500}
          alignSelf={"center"}
          src={question.img.src}
        />
      </Box>
      <Score sx={{ my: 12.5 }} value={score.value} onChange={score.onChange} />
      {/* <ButtonGroup></ButtonGroup> */}
      <Box
        display={"flex"}
        flexFlow="row nowrap"
        justifyContent={"center"}
        mt={8}
      >
        <Button
          sx={{ mx: 4 }}
          variant="outlined"
          disabled={pagination.currentIndex <= 0}
          onClick={pagination.back}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Button
          sx={{ mx: 4 }}
          variant="contained"
          disabled={pagination.currentIndex >= pagination.totalCount - 1}
          onClick={pagination.next}
          endIcon={<ArrowForward />}
        >
          Next
        </Button>
      </Box>
    </Layout>
  );
}

export default Assessment;
