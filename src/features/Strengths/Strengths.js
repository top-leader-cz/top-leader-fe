import { ArrowBack, Star } from "@mui/icons-material";
import { Box, Button, CardContent, Chip, Divider, Paper } from "@mui/material";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import { ChipsCard } from "../../components/ChipsCard";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useMakeSelectable } from "../Values/MyValues";
import { SwipeableStepper } from "./SwipeableStepper";
import { messages } from "./messages";
import { useTalentsDict } from "./talents";
import { primary25 } from "../../theme";
import { I18nContext } from "../I18n/I18nProvider";

const AssessmentRightMenu = ({
  history,
  selectedTimestamp,
  onSelect,
  onRemove,
  onRetake,
}) => {
  const { i18n } = useContext(I18nContext);
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
              bgcolor: primary25,
            }}
            color={
              entry.timestamp === selectedTimestamp ? "primary" : "secondary"
            }
            // variant={"contained"}
          >
            {i18n.formatLocal(i18n.parseUTCLocal(entry.date), "Pp")}
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

const SelectedStregth = ({
  positives = [],
  tips = [],
  positivesHeading = <Msg id="strengths.positives.title" />,
}) => {
  return (
    <CardContent sx={{ display: "flex", gap: 2, width: "100%" }}>
      <InfoBox
        color="primary"
        heading={positivesHeading}
        sx={{
          width: "50%",
          minWidth: "49%",
          maxWidth: "50%",
          overflow: "hidden",
        }}
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
        sx={{
          width: "50%",
          minWidth: "49%",
          maxWidth: "50%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SwipeableStepper
          key={JSON.stringify(tips)}
          steps={tips.map((text) => ({ key: text, text }))}
        />
      </InfoBox>
    </CardContent>
  );
};

const useStrengthsHistoryQuery = () => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["strengths"],
    queryFn: () => authFetch({ url: "/api/latest/history/STRENGTHS" }),
  });
};

export function StrengthsPage() {
  const query = useStrengthsHistoryQuery();
  const sel = useMakeSelectable({
    entries: query.data ?? [],
    map: (el) => ({
      // status
      date: el.createdAt,
      timestamp: new Date(el.createdAt).getTime(),
      orderedTalents: el.data.strengths,
    }),
  });
  // const assessmentHistory = useHistoryEntries({
  //   storageKey: "assessment_history",
  // });
  const navigate = useNavigate();
  const { talents } = useTalentsDict();

  console.log("[Strengths.rndr]", {
    // assessmentHistory,
    sel,
    query,
    talents,
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
          <QueryRenderer
            {...query}
            success={() => (
              <>
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
                        positivesHeading={
                          <Msg id="strengths.positives.title-last" />
                        }
                        positives={selected.positives}
                        tips={selected.tips}
                      />
                    )}
                  />
                )}
              </>
            )}
          />
        </Box>
      </Layout>
    </MsgProvider>
  );
}
