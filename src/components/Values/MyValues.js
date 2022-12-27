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
import { GRAY_BG_LIGHT, PRIMARY_BG_LIGHT } from "../Strengths/Strengths";
import { H1, H2, P } from "../Typography";
import { ScrollableRightMenu } from "./SetValues";
import { VALUES } from "./values";

export const HistoryRightMenu = ({
  heading,
  history,
  onRemove,
  buttonProps,
}) => {
  return (
    <ScrollableRightMenu heading={heading} buttonProps={buttonProps}>
      <P mt={1}>History</P>
      {history.all.map((entry) => (
        <Button
          onClick={(e) =>
            onRemove && e.metaKey && e.shiftKey
              ? onRemove(entry)
              : history.setSelected(entry)
          }
          sx={{
            mt: 3,
            p: 2,
            flexFlow: "column nowrap",
            alignItems: "flex-start",
            bgcolor: PRIMARY_BG_LIGHT,
          }}
          color={history.isSelected(entry) ? "primary" : "secondary"}
          // variant={"contained"}
        >
          {entry.date}
          <br />
          <P>{entry.status}</P>
        </Button>
      ))}
    </ScrollableRightMenu>
  );
};

export const ChipsCard = ({
  keys = [],
  dict = {},
  renderSummary = () => {},
  renderSelected = () => {},
  sx = { mb: 3 },
}) => {
  const [selectedKey, setSelectedKey] = useState();
  const selected = selectedKey ? dict[selectedKey] : undefined;
  useEffect(() => {
    if (selectedKey && !keys.includes(selectedKey)) setSelectedKey(undefined);
  }, [selectedKey, keys]);

  return (
    <Card sx={{ display: "flex", ...sx }} elevation={0}>
      <CardContent>
        <Stack direction="column" spacing={1}>
          {keys.map((key) => (
            <Chip
              color={key === selectedKey ? "primary" : "default"}
              sx={{ borderRadius: 1, justifyContent: "flex-start" }}
              label={[dict[key]?.emoji ?? "👤", dict[key]?.name || key]
                .filter(Boolean)
                .join(" ")}
              onClick={(e) =>
                setSelectedKey((selectedKey) =>
                  selectedKey === key ? undefined : key
                )
              }
            />
          ))}
        </Stack>
      </CardContent>
      <Divider sx={{ my: 2 }} orientation="vertical" flexItem />
      {!selected ? renderSummary() : renderSelected(selected)}
    </Card>
  );
};

export const useHistoryEntries = ({ storageKey, idKey = "timestamp" }) => {
  const [history, setHistory] = useLocalStorage(storageKey, []);
  const last = history[history.length - 1];
  const [selectedId, setSelectedId] = useState(last?.[idKey]);
  const isSelected = useCallback(
    (entry) => selectedId && entry[idKey] === selectedId,
    [idKey, selectedId]
  );
  const selected = history.find(isSelected);

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
    isSelected,
  };
};

export const InfoBox = ({ heading, children, color = "default", sx = {} }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 0.5,
        bgcolor: color === "primary" ? PRIMARY_BG_LIGHT : GRAY_BG_LIGHT,
        ...sx,
      }}
    >
      {heading && (
        <H2 gutterBottom color={color}>
          {heading}
        </H2>
      )}
      {children}
    </Box>
  );
};

export const useAssessmentHistory = () => {
  return useHistoryEntries({ storageKey: "assessment_history" });
};

function MyValues() {
  const { authFetch } = useAuth();
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

export default MyValues;
