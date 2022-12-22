import { ArrowBack, Star } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { useLocalStorage } from "../../features/auth/useLocalStorage";
import { routes } from "../../features/navigation";
import { Icon } from "../Icon";
import { Layout } from "../Layout";
import { H1, H2, P } from "../Typography";
import { TALENTS } from "./talents";

const PRIMARY_BG_LIGHT = (theme) =>
  console.log({ theme }) || alpha(theme.palette.primary.main, 0.05);
const GRAY_BG_LIGHT = (theme) =>
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

const StrengthSummary = ({ heading, description }) => {
  return (
    <CardContent>
      <H1 gutterBottom>{heading}</H1>
      <P>{description}</P>
    </CardContent>
  );
};

const CardBox = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        flex: "1 1 50%",
        p: 3,
        borderRadius: 0.5,
        bgcolor: PRIMARY_BG_LIGHT,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

const TalentInfo = ({ positives = [], tips = "" }) => {
  return (
    <CardContent sx={{ display: "flex", gap: 2, width: "100%" }}>
      <CardBox>
        <H2 color="primary.main">What’s great about your talent</H2>
        <ul>
          {positives.map((text) => (
            <li>{text}</li>
          ))}
        </ul>
      </CardBox>
      <CardBox sx={{ bgcolor: GRAY_BG_LIGHT }}>
        <H2 sx={{ mb: 1.5 }}>💡 Tips for action</H2>
        <P>{tips}</P>
      </CardBox>
    </CardContent>
  );
};

const StrengthCard = ({ heading, description, talents, sx = { mb: 3 } }) => {
  const [selectedKey, setSelectedKey] = useState();
  const selectedTalent = selectedKey ? TALENTS[selectedKey] : undefined;
  useEffect(() => {
    if (selectedKey && !talents.includes(selectedKey))
      setSelectedKey(undefined);
  }, [selectedKey, talents]);

  return (
    <Card sx={{ display: "flex", ...sx }} elevation={0}>
      <CardContent>
        <Stack direction="column" spacing={1}>
          {talents.map((key) => (
            <Chip
              color={key === selectedKey ? "primary" : "default"}
              sx={{ borderRadius: 1, justifyContent: "flex-start" }}
              label={[TALENTS[key]?.emoji ?? "👤", TALENTS[key]?.name || key]
                .filter(Boolean)
                .join(" ")}
              onClick={(e) =>
                setSelectedKey((selected) =>
                  selected === key ? undefined : key
                )
              }
              //   icon={<Icon name={talent.iconName} />}
              //   variant="outlined"
            />
          ))}
        </Stack>
      </CardContent>
      <Divider sx={{ my: 2 }} orientation="vertical" flexItem />
      {!selectedKey ? (
        <StrengthSummary heading={heading} description={description} />
      ) : (
        <TalentInfo
          positives={selectedTalent?.positives}
          tips={selectedTalent?.tips}
        />
      )}
    </Card>
  );
};

export const useAssessmentHistory = () => {
  const [assessmentHistory, setAssessmentHistory] = useLocalStorage(
    "assessment_history",
    []
  );
  const last = assessmentHistory[assessmentHistory.length - 1];
  const [selectedTimestamp, setSelectedTimestamp] = useState(last?.timestamp);
  const selected = assessmentHistory.find(
    ({ timestamp }) => selectedTimestamp && timestamp === selectedTimestamp
  );

  return {
    last,
    all: assessmentHistory,
    selected,
    setSelected: useCallback(
      (entry) => setSelectedTimestamp(entry?.timestamp),
      []
    ),
    push: useCallback(
      (entry) => setAssessmentHistory((history) => [...history, entry]),
      [setAssessmentHistory]
    ),
    remove: useCallback(
      (entry) =>
        setAssessmentHistory((entries) =>
          entries.filter(({ timestamp }) => timestamp !== entry.timestamp)
        ),
      [setAssessmentHistory]
    ),
  };
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
        <StrengthCard
          heading={
            <>
              1-5&nbsp;
              <Chip
                sx={{ borderRadius: 0.5 }}
                label="Top"
                icon={<Star />}
                size="small"
                color="warning"
              />
            </>
          }
          description="Did you know that you have much more potential for growth when you invest energy in developing your strengths? Many research have shown how a strengths-based approach improves your confidence, direction, and kindness toward others."
          talents={assessmentHistory.selected?.orderedTalents.slice(0, 5)}
        />
        {assessmentHistory.selected?.orderedTalents.length > 5 && (
          <StrengthCard
            heading={"6-10"}
            description="Whilst the list of your Top 5 strengths shows you the areas where you have the greatest potential to use your natural talents, here you can see the next five stenghts that you should be also aware of. They might be a big help in your professional and private life journey."
            talents={assessmentHistory.selected?.orderedTalents.slice(5, 10)}
          />
        )}
        {assessmentHistory.selected?.orderedTalents.length > 10 && (
          <StrengthCard
            heading={"11-20"}
            description="In any role, it’s good to know your areas of lesser talent. In many cases, simply being aware of your areas of lesser talent can help you avoid major barriers. Either try to establish systems to manage them or try to partner with someone who has more talent in the areas in which you are lacking. "
            talents={assessmentHistory.selected?.orderedTalents.slice(10)}
          />
        )}
      </Box>
    </Layout>
  );
}

export default Strengths;
