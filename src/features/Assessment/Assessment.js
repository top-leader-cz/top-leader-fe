import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Button, Divider } from "@mui/material";
import { groupBy, sort } from "ramda";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { Score } from "../../components/Score";
import { H1, H2, P } from "../../components/Typography";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { AssessmentRightMenu } from "./AssessmentRightMenu";
import {
  useAnswerMutation,
  useAnswersMutation,
  useAnswersQuery,
  useDeleteAnswersMutation,
} from "./api";
import { messages } from "./messages";
import { useQuestionsDict } from "./questions";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { useMsg } from "../../components/Msg/Msg";

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
    </Box>
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

  console.log("createAssessmentEntry", {
    orderedTalents,
    scoreSumByTalent,
    questions,
    scores,
    status,
  });

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

const useSaveStrengthsMutation = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();
  const { authFetch, fetchUser } = useAuth();

  const deleteAnswersMutation = useMutation({
    mutationFn: async () => {
      return authFetch({
        method: "DELETE",
        url: `/api/latest/user-assessments`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ exact: false, queryKey: ["assessment"] });
    },
  });

  const strengthsMutation = useMutation({
    mutationFn: async ({ orderedTalents }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-info/strengths`,
        data: { data: orderedTalents },
      }),
    onSuccess: () => {
      deleteAnswersMutation.mutate();
      fetchUser();
      queryClient.invalidateQueries({ exact: false, queryKey: ["strengths"] });
      onSuccess?.();
    },
  });
  return strengthsMutation;
};

const shuffle = sort(() => Math.random() - 0.5);

// It looks better for the user when questions are in different order for each assessment
const useRandomizedQuestions = ({ originalQuestions }) => {
  const [state, setState] = useState({ questions: [], answeredCount: 0 });
  const { questions, answeredCount } = state;
  const initializeQuestions = useCallback(
    (scores) => {
      if (questions.length) {
        throw new Error("useRandomizedQuestions initialized twice!"); // TODO
      }
      const answeredIds = Object.keys(scores);
      const { answered, unanswered } = groupBy(
        (question) =>
          answeredIds.includes(`${question.id}`) ? "answered" : "unanswered",
        originalQuestions
      );
      const randomized = [
        ...shuffle(answered || []),
        ...shuffle(unanswered || []),
      ];
      console.log("[useRandomizedQuestions]", {
        originalQuestions,
        questions,
        scores,
        answeredIds,
        answered,
        unanswered,
        randomized,
      });
      setState({ questions: randomized, answeredCount: answeredIds.length });
    },
    [originalQuestions, questions]
  );

  return {
    questions,
    initializeQuestions,
    isInitialized: !!questions.length,
    answeredCount,
  };
};

const DUMMY_Q = {
  id: 0,
  data: {
    themes_subject: "",
    talent: "",
    text: "",
    ts_key: "",
    img: { src: "" },
  },
};

const useAssessment = () => {
  const { questions: originalQuestions } = useQuestionsDict();
  const { questions, initializeQuestions, answeredCount, isInitialized } =
    useRandomizedQuestions({ originalQuestions });
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex(answeredCount);
  }, [answeredCount]);
  const [scores, setScores] = useLocalStorage("assessment", {});

  const [unfinishedAssessment, setUnfinishedAssessment] = useState();
  const initializeAssessment = useCallback(
    (scores) => {
      setScores(scores);
      initializeQuestions(scores);
    },
    [initializeQuestions, setScores]
  );
  const deleteMutation = useDeleteAnswersMutation();
  const handleContinueUnfinished = useCallback(() => {
    initializeAssessment(unfinishedAssessment);
    setUnfinishedAssessment();
  }, [initializeAssessment, unfinishedAssessment]);
  const handleDiscard = useCallback(() => {
    initializeAssessment({});
    deleteMutation.mutate();
    setUnfinishedAssessment();
  }, [deleteMutation, initializeAssessment]);

  const answersQuery = useAnswersQuery({
    onSuccess: (scores) => {
      if (Object.values(scores ?? {}).length) {
        setUnfinishedAssessment(scores);
      } else {
        initializeQuestions({});
      }
    },
  });
  const answerMutation = useAnswerMutation({});
  const answersMutation = useAnswersMutation({});
  const navigate = useNavigate();
  const handleLeave = useCallback(() => {
    setScores({});
    navigate(routes.strengths);
  }, [navigate, setScores]);
  const { mutate } = useSaveStrengthsMutation({
    onSuccess: handleLeave,
  });

  const question = questions[currentIndex] ?? DUMMY_Q;

  const saveAssessment = useCallback(() => {
    const entry = createAssessmentEntry({ questions, scores });
    mutate({ orderedTalents: entry.orderedTalents });
  }, [mutate, questions, scores]);

  const onPaginationChange = useCallback(
    ({ value }) => {
      setScores((prev) => ({ ...prev, [question.id]: value }));
    },
    [question.id, setScores]
  );

  const score = useMemo(
    () => ({
      value: scores[question.id],
      onChange: onPaginationChange,
    }),
    [onPaginationChange, question.id, scores]
  );

  const submitDisabled =
    typeof score.value !== "number" || answersQuery.isLoading;

  const pagination = {
    currentIndex,
    totalCount: questions.length,
    back: useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []),
    next: useCallback(
      () => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1)),
      [questions.length]
    ),
    onChange: useCallback(({ value }) => {
      setCurrentIndex(value);
    }, []),
  };

  const handleNext =
    typeof score.value !== "number"
      ? () => {}
      : pagination.currentIndex < pagination.totalCount - 1
      ? pagination.next
      : saveAssessment;

  const saveAnswer = useCallback(() => {
    const answer = { questionId: question.id, answer: score.value };
    console.log("nextWithSave next", answer);
    answerMutation.mutate(answer);
  }, [answerMutation, question.id, score.value]);

  const nextWithSave = () => {
    if (handleNext === pagination.next) {
      saveAnswer(); // TODO: onScoreChange - save answer on change, not next click
    }
    handleNext();
  };
  const handleSaveAndLeave = useCallback(() => {
    answersMutation.mutate(scores);
    // if (typeof score.value === "number") saveAnswer();
    handleLeave();
  }, [answersMutation, handleLeave, scores]);

  console.log("[useAssessment.rndr]", {
    currentIndex,
    scores,
    question,
  });

  return {
    handleSaveAndLeave,
    pagination,
    question: question.data,
    score,
    responsesCount: Object.values(scores).filter(
      (score) => typeof score === "number"
    ).length,
    nextWithSave,
    submitDisabled,
    isLoading: answersQuery.isLoading,
    isInitialized,
    unfinished: {
      handleContinueUnfinished,
      unfinishedAssessment,
      handleDiscard,
    },
  };
};

function Assessment() {
  const msg = useMsg({ dict: messages });
  const {
    pagination,
    question,
    score,
    responsesCount,
    handleSaveAndLeave,
    nextWithSave,
    submitDisabled,
    isInitialized,
    unfinished: {
      handleContinueUnfinished,
      unfinishedAssessment,
      handleDiscard,
    },
  } = useAssessment();

  const handleNextRef = useRef(nextWithSave);
  handleNextRef.current = nextWithSave;
  const handleBackRef = useRef(pagination.back);
  handleBackRef.current = pagination.back;
  const onScoreChangeRef = useRef(score.onChange);
  onScoreChangeRef.current = score.onChange;
  useEffect(() => {
    const fn = (e) => {
      console.log("keydown eff");
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

  // console.log("[Assessment.rndr]", { pagination, question, score });
  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          !isInitialized ? null : (
            <AssessmentRightMenu
              // saveDisabled={responsesCount !== pagination.totalCount}
              currentIndex={pagination.currentIndex}
              totalCount={pagination.totalCount}
              responsesCount={responsesCount}
              onSave={handleSaveAndLeave}
            />
          )
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
              <H2>
                <Msg id="assessment.header.back" />
              </H2>
            </Button>
          </Box>
          <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
        </Box>

        {isInitialized && (
          <>
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
            <Score
              sx={{ my: 12.5 }}
              value={score.value}
              onChange={score.onChange}
            />
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
                <Msg id="assessment.button.back" />
              </Button>
              <Button
                type="submit"
                sx={{ mx: 4 }}
                variant="contained"
                disabled={submitDisabled}
                onClick={nextWithSave}
                endIcon={<ArrowForward />}
              >
                {pagination.currentIndex >= pagination.totalCount - 1 ? (
                  <Msg id="assessment.button.save" />
                ) : (
                  <Msg id="assessment.button.next" />
                )}
              </Button>
            </Box>
          </>
        )}
      </Layout>
      <ConfirmModal
        open={!!unfinishedAssessment}
        onClose={handleContinueUnfinished}
        iconName="RocketLaunch"
        title={msg("assessment.unfinished.title")}
        desc={msg("assessment.unfinished.desc")}
        buttons={[
          {
            variant: "outlined",
            type: "button",
            children: msg("assessment.unfinished.discard"),
            onClick: handleDiscard,
          },
          {
            variant: "contained",
            type: "button",
            children: msg("assessment.unfinished.continue"),
            onClick: handleContinueUnfinished,
          },
        ]}
        sx={{ width: "800px" }}
      />
    </MsgProvider>
  );
}

export default Assessment;
