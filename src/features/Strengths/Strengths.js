import { Box, Button, CardContent, Chip, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChipsCard } from "../../components/ChipsCard";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useMyQuery } from "../Authorization/AuthProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useMakeSelectable } from "../Values/MyValues";
import { SelectedStregth } from "./SelectedStregth";
import { StrengthsRightMenu } from "./StrengthsRightMenu";
import { messages } from "./messages";
import { useAllTalentsDict } from "./talents";
import { descend, head, prop, sort, sortBy } from "ramda";

const useStrengthsHistoryQuery = () =>
  useMyQuery({
    queryKey: ["strengths"],
    fetchDef: { url: "/api/latest/history/STRENGTHS" },
  });

export function StrengthsPage() {
  const query = useStrengthsHistoryQuery();
  const sel = useMakeSelectable({
    entries: query.data ?? [],
    sorter: sort(descend(prop("date"))),
    getDefaultSelected: head,
    map: (el) => ({
      // status
      date: el.createdAt,
      timestamp: new Date(el.createdAt).getTime(),
      orderedTalents: el.data.strengths,
    }),
  });
  const navigate = useNavigate();
  const talents = useAllTalentsDict();

  console.log("[Strengths.rndr]", {
    sel,
    query,
    talents,
  });

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <StrengthsRightMenu
            items={sel.all}
            selectedTimestamp={sel.selected?.timestamp}
            onSelect={sel.setSelected}
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
              <Icon name="ArrowBack" />
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
                          icon={<Icon name="Star" />}
                          size="small"
                          color="warning"
                        />
                      </H1>
                      <P>
                        <Msg id="strengths.first.summary" />
                      </P>
                    </CardContent>
                  )}
                  isSelectable={(item) =>
                    item?.positives?.length || item?.tips?.length
                  }
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
                    isSelectable={(item) =>
                      item?.positives?.length || item?.tips?.length
                    }
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
                    isSelectable={(item) =>
                      item?.positives?.length || item?.tips?.length
                    }
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
