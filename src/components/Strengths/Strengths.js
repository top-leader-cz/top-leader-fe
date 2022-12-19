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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { routes } from "../../features/navigation";
import { Icon } from "../Icon";
import { Layout } from "../Layout";
import { H1, H2, P } from "../Typography";

const PRIMARY_BG_LIGHT = (theme) => alpha(theme.palette.primary.main, 0.05);
const GRAY_BG_LIGHT = (theme) =>
  console.log({ theme }) || alpha(theme.palette.action.selected, 0.05);
//   console.log({ theme }) || alpha(theme.palette.common.black, 0.05);

const AssessmentRightMenu = ({ history, onRetake }) => {
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
        {history.map(({ date, status }) => (
          <Button
            sx={{
              mt: 3,
              p: 2,
              flexFlow: "column nowrap",
              alignItems: "flex-start",
              bgcolor: PRIMARY_BG_LIGHT,
            }}
          >
            {date}
            <br />
            <P>{status}</P>
          </Button>
        ))}
      </Box>
      <Button fullWidth variant="contained" onClick={onRetake}>
        Retake assessment
      </Button>
    </Paper>
  );
};

const todoTalent = {
  positives: ["TODO", "positives"],
  tips: ["TODO: some tips"],
};

const TALENTS = {
  responsible: {
    name: "Responsible",
    emoji: "🤝",
    // iconName: "Handshake",
    positives: [
      "you don’t like easy tasks",
      "you love it when you face challenges and when you can think a few steps ahead",
      "you have an ability to see situations from a higher perspective which helps you to find the best way through",
      "where others see only problems you have the ability to see patterns",
    ],
    tips: [
      "Having the skill to see big picture can sometimes lead to the fact that you missed very important details. It helps to stop within the process, regularly, to look back to be sure nothing was missed.",
    ],
  },
  communicator: {
    name: "Communicator",
    emoji: "🗣",
    ...todoTalent,
  },
  strategist: {
    name: "Strategist",
    emoji: "📈",
    ...todoTalent,
  },
  analyser: {
    name: "Analyser",
    emoji: "📊",
    ...todoTalent,
  },
  ideamaker: {
    name: "Ideamaker",
    emoji: "💡",
    ...todoTalent,
  },
};

const StrengthCard2 = ({ heading, description, talents }) => {
  return (
    <Card>
      <CardContent sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {talents.map((talent) => (
            <Button>{talent.name}</Button>
          ))}
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <H1>{heading}</H1>
          <P>{description}</P>
        </Box>
      </CardContent>
    </Card>
  );
};

const StrengthCard3 = ({ heading, description, talents }) => {
  return (
    <Card>
      <CardContent sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {talents.map((talent) => (
            <Button>{talent.name}</Button>
          ))}
        </Box>
        <Divider orientation="vertical" flexItem />
        <CardContent sx={{ py: 0 }}>
          <H1 gutterBottom>{heading}</H1>
          <P>{description}</P>
        </CardContent>
      </CardContent>
    </Card>
  );
};

const StrengthCard4 = ({ heading, description, talents }) => {
  return (
    <Card sx={{ display: "flex" }}>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {talents.map((talent) => (
            <Button>{talent.name}</Button>
          ))}
        </Box>
      </CardContent>
      <Divider sx={{ my: 2 }} orientation="vertical" flexItem />
      <CardContent>
        <H1 gutterBottom>{heading}</H1>
        <P>{description}</P>
      </CardContent>
    </Card>
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

const TalentInfo = ({ positives, tips }) => {
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
  const [selected, setSelected] = useState();

  return (
    <Card sx={{ display: "flex", ...sx }} elevation={0}>
      <CardContent>
        <Stack direction="column" spacing={1}>
          {talents.map((talent) => (
            <Chip
              color={talent === selected ? "primary" : "default"}
              sx={{ borderRadius: 1, justifyContent: "flex-start" }}
              label={[talent.emoji, talent.name].filter(Boolean).join(" ")}
              onClick={(e) =>
                setSelected((selected) =>
                  selected === talent ? undefined : talent
                )
              }
              {...(talent.iconName
                ? { icon: <Icon name={talent.iconName} /> }
                : {})}

              //   variant="outlined"
            />
          ))}
        </Stack>
      </CardContent>
      <Divider sx={{ my: 2 }} orientation="vertical" flexItem />
      {!selected ? (
        <StrengthSummary heading={heading} description={description} />
      ) : (
        <TalentInfo positives={selected.positives} tips={selected.tips} />
      )}
    </Card>
  );
};

const useStrengths = () => {
  const history = [
    { date: "21/05/2022", status: "Assessment completed" },
    { date: "15/09/2021", status: "Assessment completed" },
  ];

  return { history };
};

function Strengths() {
  const { authFetch } = useAuth();
  const { history } = useStrengths();
  const navigate = useNavigate();

  console.log("[Strengths.rndr]", { history });

  return (
    <Layout
      rightMenuContent={
        <AssessmentRightMenu
          history={history}
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
              1-5{" "}
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
          talents={[
            TALENTS.responsible,
            TALENTS.communicator,
            TALENTS.strategist,
            TALENTS.analyser,
            TALENTS.ideamaker,
          ]}
        />
        <StrengthCard
          heading={"6-10"}
          description="Whilst the list of your Top 5 strengths shows you the areas where you have the greatest potential to use your natural talents, here you can see the next five stenghts that you should be also aware of. They might be a big help in your professional and private life journey."
          talents={[
            TALENTS.responsible,
            TALENTS.communicator,
            TALENTS.strategist,
            TALENTS.analyser,
            TALENTS.ideamaker,
          ]}
        />
        <StrengthCard
          heading={"11-20"}
          description="In any role, it’s good to know your areas of lesser talent. In many cases, simply being aware of your areas of lesser talent can help you avoid major barriers. Either try to establish systems to manage them or try to partner with someone who has more talent in the areas in which you are lacking. "
          talents={[
            TALENTS.responsible,
            TALENTS.communicator,
            TALENTS.strategist,
            TALENTS.analyser,
            TALENTS.ideamaker,
          ]}
        />
      </Box>
    </Layout>
  );
}

export default Strengths;
