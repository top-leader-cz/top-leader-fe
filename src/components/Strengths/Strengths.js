import { ArrowBack, Star } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { useLocalStorage } from "../../features/auth/useLocalStorage";
import { routes } from "../../features/navigation";
import { Layout } from "../Layout";
import { H1, H2, P } from "../Typography";
import { ChipsCard, InfoBox } from "../Values/MyValues";
import { TALENTS } from "./talents";

export const PRIMARY_BG_LIGHT = (theme) =>
  console.log({ theme }) || alpha(theme.palette.primary.main, 0.05);
export const GRAY_BG_LIGHT = (theme) =>
  console.log({ theme }) || alpha(theme.palette.action.selected, 0.05);

const AssessmentRightMenu = ({
  history,
  selectedTimestamp,
  onSelect,
  onRemove,
  onRetake,
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
        <P mt={5}>History</P>
        {history.map((entry) => (
          <Button
            onClick={(e) =>
              console.log({ e }) || (onRemove && e.metaKey && e.shiftKey)
                ? onRemove(entry)
                : onSelect(entry)
            }
            sx={{
              mt: 3,
              p: 2,
              flexFlow: "column nowrap",
              alignItems: "flex-start",
              bgcolor: PRIMARY_BG_LIGHT,
            }}
            color={
              entry.timestamp === selectedTimestamp ? "primary" : "secondary"
            }
            // variant={"contained"}
          >
            {entry.date}
            <br />
            <P>{entry.status}</P>
          </Button>
        ))}
      </Box>
      <Button fullWidth variant="contained" onClick={onRetake}>
        Retake assessment
      </Button>
    </Paper>
  );
};

export const useHistoryEntries = ({ storageKey, idKey = "timestamp" }) => {
  const [history, setHistory] = useLocalStorage(storageKey, []);
  const last = history[history.length - 1];
  const [selectedId, setSelectedId] = useState(last?.[idKey]);
  const selected = history.find(
    (entry) => selectedId && entry[idKey] === selectedId
  );

  return {
    last,
    all: history,
    selected,
    setSelected: useCallback((entry) => setSelectedId(entry?.[idKey]), []),
    push: useCallback(
      (entry) => setHistory((history) => [...history, entry]),
      [setHistory]
    ),
    update: useCallback(
      (newEntry) => {
        setHistory((entries) =>
          entries.map((entry) =>
            entry[idKey] === newEntry[idKey] ? { ...entry, ...newEntry } : entry
          )
        );
      },
      [idKey, setHistory]
    ),
    remove: useCallback(
      (rmEntry) =>
        setHistory((entries) =>
          entries.filter((entry) => entry[idKey] !== rmEntry[idKey])
        ),
      [idKey, setHistory]
    ),
  };
};

export const useAssessmentHistory = () => {
  return useHistoryEntries({ storageKey: "assessment_history" });
};

const SelectedStregth = ({ positives = [], tips = "" }) => {
  return (
    <CardContent sx={{ display: "flex", gap: 2, width: "100%" }}>
      <InfoBox
        color="primary"
        heading={"What’s great about your talent"}
        sx={{ flex: "1 1 50%" }}
      >
        <ul>
          {positives.map((text) => (
            <li>{text}</li>
          ))}
        </ul>
      </InfoBox>
      <InfoBox
        color="default"
        heading={"💡 Tips for action"}
        sx={{ flex: "1 1 50%" }}
      >
        <P>{tips}</P>
      </InfoBox>
    </CardContent>
  );
};

function Strengths() {
  const { authFetch } = useAuth();
  const assessmentHistory = useAssessmentHistory();
  const navigate = useNavigate();

  console.log("[Strengths.rndr]", {
    assessmentHistory,
  });

  return (
    <Layout
      rightMenuContent={
        <AssessmentRightMenu
          history={assessmentHistory.all}
          selectedTimestamp={assessmentHistory.selected?.timestamp}
          onSelect={assessmentHistory.setSelected}
          onRemove={assessmentHistory.remove}
          onRetake={() => navigate(routes.assessment)}
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
      <Box>
        <H1>Here are your strengths</H1>
        <P mt={1} mb={3}>
          Harum ipsa tenetur porro error quaerat. Est porro facilis tenetur
          repellendus id fugiat et doloribus.
        </P>
        <ChipsCard
          keys={assessmentHistory.selected?.orderedTalents.slice(0, 5)}
          dict={TALENTS}
          renderSummary={() => (
            <CardContent>
              <H1 gutterBottom>
                1-5&nbsp;
                <Chip
                  sx={{ borderRadius: 0.5 }}
                  label="Top"
                  icon={<Star />}
                  size="small"
                  color="warning"
                />
              </H1>
              <P>
                "Did you know that you have much more potential for growth when
                you invest energy in developing your strengths? Many research
                have shown how a strengths-based approach improves your
                confidence, direction, and kindness toward others."
              </P>
            </CardContent>
          )}
          renderSelected={(selected) => (
            <SelectedStregth
              positives={selected.positives}
              tips={selected.tips}
            />
          )}
        />

        {assessmentHistory.selected?.orderedTalents.length > 5 && (
          <ChipsCard
            keys={assessmentHistory.selected?.orderedTalents.slice(5, 10)}
            dict={TALENTS}
            renderSummary={() => (
              <CardContent>
                <H1 gutterBottom>6-10</H1>
                <P>
                  "Whilst the list of your Top 5 strengths shows you the areas
                  where you have the greatest potential to use your natural
                  talents, here you can see the next five stenghts that you
                  should be also aware of. They might be a big help in your
                  professional and private life journey."
                </P>
              </CardContent>
            )}
            renderSelected={(selected) => (
              <SelectedStregth
                positives={selected.positives}
                tips={selected.tips}
              />
            )}
          />
        )}
        {assessmentHistory.selected?.orderedTalents.length > 10 && (
          <ChipsCard
            keys={assessmentHistory.selected?.orderedTalents.slice(10)}
            dict={TALENTS}
            renderSummary={() => (
              <CardContent>
                <H1 gutterBottom>11-20</H1>
                <P>
                  "In any role, it’s good to know your areas of lesser talent.
                  In many cases, simply being aware of your areas of lesser
                  talent can help you avoid major barriers. Either try to
                  establish systems to manage them or try to partner with
                  someone who has more talent in the areas in which you are
                  lacking."
                </P>
              </CardContent>
            )}
            renderSelected={(selected) => (
              <SelectedStregth
                positives={selected.positives}
                tips={selected.tips}
              />
            )}
          />
        )}
      </Box>
    </Layout>
  );
}

export default Strengths;
