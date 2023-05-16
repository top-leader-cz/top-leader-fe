import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CardContent, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChipsCard } from "../../components/ChipsCard";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { H1, H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { messages } from "./messages";
import { useValuesDict } from "./values";

export function MyValuesPage() {
  const history = useHistoryEntries({ storageKey: "values_history" });
  const navigate = useNavigate();
  const { values } = useValuesDict();

  console.log("[MyValues.rndr]", {
    history,
  });

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <HistoryRightMenu
            heading={<Msg id="values.aside.title" />}
            perex={<Msg id="values.aside.perex" />}
            history={history}
            onRemove={history.remove}
            buttonProps={{
              children: <Msg id="values.aside.save" />,
              onClick: () => navigate(routes.setValues),
            }}
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
                <Msg id="values.header.back" />
              </H2>
            </Button>
          </Box>
          <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
        </Box>
        <Box>
          <H1>
            <Msg id="values.heading" />
          </H1>
          <P mt={1} mb={3}>
            <Msg id="values.perex" />
          </P>
          <ChipsCard
            keys={history.selected?.selectedKeys}
            dict={values}
            renderSummary={() => (
              <CardContent>
                <P>
                  <Msg id="values.card.summary" />
                </P>
              </CardContent>
            )}
            renderSelected={({ name, description }) => (
              <CardContent>
                <InfoBox color="primary" heading={name}>
                  {description}
                </InfoBox>
              </CardContent>
            )}
          />
        </Box>
      </Layout>
    </MsgProvider>
  );
}
