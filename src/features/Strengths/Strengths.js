import { ArrowBack, Star } from "@mui/icons-material";
import { Box, Button, CardContent, Chip, Divider, Paper } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChipsCard } from "../../components/ChipsCard";
import { InfoBox, PRIMARY_BG_LIGHT } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { H1, H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { messages } from "./messages";
import { useTalentsDict } from "./talents";
import { useAuth } from "../Authorization";
import { useQuery } from "react-query";
import { useMakeSelectable } from "../Values/MyValues";

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
        <H2>
          <Msg id="strengths.aside.title" />
        </H2>
        <P mt={5}>
          <Msg id="strengths.aside.perex" />
        </P>
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
        <Msg id="strengths.aside.retake-button" />
      </Button>
    </Paper>
  );
};

const SelectedStregth = ({ positives = [], tips = "" }) => {
  return (
    <CardContent sx={{ display: "flex", gap: 2, width: "100%" }}>
      <InfoBox
        color="primary"
        heading={<Msg id="strengths.positives.title" />}
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
        heading={<Msg id="strengths.tips.title" />}
        sx={{ flex: "1 1 50%" }}
      >
        <P>{tips}</P>
      </InfoBox>
    </CardContent>
  );
};

const useStrengthsHistoryQuery = () => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["strengths"],
    onSuccess: (data) => {
      // console.log("q s", { data });
    },
    queryFn: async () =>
      authFetch({ url: "/api/latest/history/STRENGTHS" }).then(
        ({ json }) => json
      ),
  });
};

export function StrengthsPage() {
  const { data } = useStrengthsHistoryQuery();
  const sel = useMakeSelectable({
    entries: data ?? [],
    map: (el) => ({
      // status
      date: el.createdAt,
      timestamp: new Date(el.createdAt).getTime(),
      orderedTalents: el.data.strengths,
    }),
  });
  const assessmentHistory = useHistoryEntries({
    storageKey: "assessment_history",
  });
  const navigate = useNavigate();
  const { talents } = useTalentsDict();

  console.log("[Strengths.rndr]", {
    assessmentHistory,
    sel,
    data,
  });

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <AssessmentRightMenu
            history={sel.all}
            selectedTimestamp={sel.selected?.timestamp}
            onSelect={sel.setSelected}
            // onRemove={assessmentHistory.remove}
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
              <H2>
                <Msg id="strengths.header.back" />
              </H2>
            </Button>
          </Box>
          <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
        </Box>
        <Box>
          <H1>
            <Msg id="strengths.heading.title" />
          </H1>
          <P mt={1} mb={3}>
            <Msg id="strengths.heading.perex" />
          </P>
          <ChipsCard
            keys={sel.selected?.orderedTalents.slice(0, 5)}
            dict={talents}
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
                  <Msg id="strengths.first.summary" />
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

          {sel.selected?.orderedTalents.length > 5 && (
            <ChipsCard
              keys={sel.selected?.orderedTalents.slice(5, 10)}
              dict={talents}
              renderSummary={() => (
                <CardContent>
                  <H1 gutterBottom>6-10</H1>
                  <P>
                    <Msg id="strengths.second.summary" />
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
          {sel.selected?.orderedTalents.length > 10 && (
            <ChipsCard
              keys={sel.selected?.orderedTalents.slice(10)}
              dict={talents}
              renderSummary={() => (
                <CardContent>
                  <H1 gutterBottom>11-20</H1>
                  <P>
                    <Msg id="strengths.third.summary" />
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
    </MsgProvider>
  );
}
