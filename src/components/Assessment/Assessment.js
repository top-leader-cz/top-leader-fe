import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useAuth } from "../../features/auth";
import { Layout } from "../Layout";
import { H1, H2, P } from "../Typography";
import { ArrowBack, ArrowForward, ArrowRight } from "@mui/icons-material";
import { routes } from "../../features/navigation";
import { QUESTIONS } from "./questions";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../features/auth/useLocalStorage";
import { useAssessmentHistory } from "../Strengths/Strengths";

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
      <Box sx={{ mx: 2, display: "flex", flexFlow: "row nowrap" }}>
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
  console.log({ value });
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

const AssessmentRightMenu = ({
  currentIndex,
  saveDisabled,
  totalCount,
  responsesCount,
  onSave,
}) => {
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
          value={(100 * responsesCount) / totalCount}
          sx={{ alignSelf: "center", my: 7.5 }}
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
      <Button
        fullWidth
        variant="contained"
        onClick={onSave}
        disabled={saveDisabled}
      >
        Save assessment
      </Button>
    </Paper>
  );
};

const createAssessmentEntry = ({ questions, scores }) => {
  const scoreSumByTalent = questions.reduce(
    (acc, q) => ({
      ...acc,
      [q.data.talent]: (acc[q.data.talent] ?? 0) + scores[q.id] ?? 0,
    }),
    {}
  );
  const orderedTalents = Object.entries(scoreSumByTalent)
    .sort(([, aScore], [, bScore]) => bScore - aScore)
    .map(([talent]) => talent);
  const status =
    Object.entries(scores).filter(([id, score]) => typeof score === "number")
      .length === questions.length
      ? "Assessment completed"
      : "Incomplete";

  console.log({ orderedTalents, scoreSumByTalent, questions, scores, status });

  return {
    date: new Date().toISOString(),
    timestamp: new Date().getTime(),
    status,
    orderedTalents,
    scoreSumByTalent,
    questions,
    scores,
  };
};

const useAssessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useLocalStorage("assessment", {});
  const assessmentHistory = useAssessmentHistory();
  const navigate = useNavigate();

  const question = QUESTIONS[currentIndex];
  const saveAssessment = useCallback(() => {
    assessmentHistory.push(
      createAssessmentEntry({ questions: QUESTIONS, scores })
    );
    setScores({});
    navigate(routes.strengths);
  }, [assessmentHistory, navigate, scores, setScores]);

  console.log("[useAssessment]", { currentIndex, scores, question });

  return {
    saveAssessment,
    pagination: {
      currentIndex,
      totalCount: QUESTIONS.length,
      back: () => setCurrentIndex((i) => Math.max(0, i - 1)),
      next: () => setCurrentIndex((i) => Math.min(QUESTIONS.length - 1, i + 1)),
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
  const { pagination, question, score, responsesCount, saveAssessment } =
    useAssessment();
  const handleNext =
    typeof score.value !== "number"
      ? () => {}
      : pagination.currentIndex < pagination.totalCount - 1
      ? pagination.next
      : saveAssessment;

  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;
  const handleBackRef = useRef(pagination.back);
  handleBackRef.current = pagination.back;
  const onScoreChangeRef = useRef(score.onChange);
  onScoreChangeRef.current = score.onChange;
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Enter" || e.key === "ArrowRight") handleNextRef.current();
      if (e.key === "Escape" || e.key === "ArrowLeft") handleBackRef.current();
      if (e.key?.match(/^\d$/)) {
        let value = Number(e.key);
        if (value === 0) value = 10;
        onScoreChangeRef.current({ value });
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  console.log("[Assessment.rndr]", { pagination, question, score });
  return (
    <Layout
      rightMenuContent={
        <AssessmentRightMenu
          saveDisabled={responsesCount !== pagination.totalCount}
          currentIndex={pagination.currentIndex}
          totalCount={pagination.totalCount}
          responsesCount={responsesCount}
          onSave={saveAssessment}
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
          type="submit"
          sx={{ mx: 4 }}
          variant="contained"
          disabled={typeof score.value !== "number"}
          onClick={handleNext}
          endIcon={<ArrowForward />}
        >
          {pagination.currentIndex >= pagination.totalCount - 1
            ? "Save"
            : "Next"}
        </Button>
      </Box>
    </Layout>
  );
}

export default Assessment;
