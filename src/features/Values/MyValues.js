import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CardContent, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChipsCard } from "../../components/ChipsCard";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { H1, H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { VALUES } from "./values";

export function MyValuesPage() {
  const history = useHistoryEntries({ storageKey: "values_history" });
  const navigate = useNavigate();

  console.log("[MyValues.rndr]", {
    history,
  });

  return (
    <Layout
      rightMenuContent={
        <HistoryRightMenu
          heading={"My values"}
          history={history}
          onRemove={history.remove}
          buttonProps={{
            children: "Change my values",
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
            <H2>Back to the dashboard</H2>
          </Button>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      <Box>
        <H1>Here are your values</H1>
        <P mt={1} mb={3}>
          Harum ipsa tenetur porro error quaerat. Est porro facilis tenetur
          repellendus id fugiat et doloribus.
        </P>
        <ChipsCard
          keys={history.selected?.selectedKeys}
          dict={VALUES}
          renderSummary={() => (
            <CardContent>
              <P>Click on your value to understand more about it.</P>
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
  );
}
