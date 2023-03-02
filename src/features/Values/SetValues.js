import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider } from "@mui/material";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { SelectableChip } from "../../components/SelectableChip";
import { H1, H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { useSelection } from "../../hooks/useSelection";
import { routes } from "../../routes";
import { messages } from "./messages";
import { useValuesDict } from "../../translations/values";

const RightMenu = ({ selectedKeys, saveDisabled, onSave }) => {
  const { values } = useValuesDict();

  return (
    <ScrollableRightMenu
      heading={<Msg id="values.set.aside.title" />}
      buttonProps={{
        disabled: saveDisabled,
        onClick: onSave,
        children: <Msg id="values.set.aside.save" />,
      }}
    >
      {selectedKeys
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((key) => values[key] || { name: key })
        .map(({ name, description }) => (
          <InfoBox
            color="primary"
            heading={name}
            sx={{ p: 2, mb: 3, borderRadius: "6px" }}
          >
            <P>{description}</P>
          </InfoBox>
        ))}
    </ScrollableRightMenu>
  );
};

const createValuesEntry = ({ selectedKeys }) => {
  return {
    date: new Date().toISOString(),
    timestamp: new Date().getTime(),
    selectedKeys,
  };
};

const useMyValues = () => {
  const { values } = useValuesDict();
  const valuesHistory = useHistoryEntries({ storageKey: "values_history" });
  const { selectedKeys, toggleItem } = useSelection({
    initialValue: valuesHistory.last?.selectedKeys ?? [],
  });
  const navigate = useNavigate();

  const save = useCallback(() => {
    valuesHistory.push(createValuesEntry({ selectedKeys }));
    navigate(routes.dashboard);
    // navigate(routes.myValues);
  }, [navigate, selectedKeys, valuesHistory]);

  console.log("[useMyValues]", {});

  return {
    save,
    items: Object.entries(values).map(([key, value]) => ({
      data: value,
      key,
      label: value.name,
    })),
    // [
    //   { label: "Accountability", key: "accountability" },
    //   { label: "Accuracy", key: "accuracy" },
    // ],
    selectedKeys,
    toggleItem,
  };
};

export function SetValuesPage() {
  const { items, selectedKeys, toggleItem, save } = useMyValues();

  console.log("[SetValues.rndr]", { items, selectedKeys });
  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <RightMenu
            selectedKeys={selectedKeys}
            saveDisabled={!selectedKeys.length}
            onSave={save}
          />
        }
      >
        <Box mt={4} mb={3} alignItems="flex-start">
          <Button
            color="inherit"
            href={routes.dashboard}
            startIcon={<ArrowBack />}
          >
            <H2>
              <Msg id="values.header.back" />
            </H2>
          </Button>
          <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
        </Box>

        <H1 mt={12.5} gutterBottom align="center">
          <Msg id="values.set.heading" />
        </H1>
        <P textAlign="center">
          <Msg id="values.set.perex" />
        </P>
        <Box width="100%" align="center">
          <Box
            component="img"
            borderRadius={2}
            width={500}
            alignSelf={"center"}
            src={"/Mediator_03.svg"}
            my={7.5}
          />
        </Box>
        <Box sx={SelectableChip.wrapperSx}>
          {items.map((item) => (
            <SelectableChip
              label={item.label}
              selected={selectedKeys.includes(item.key)}
              onClick={(e) => toggleItem(item)}
            />
          ))}
        </Box>
      </Layout>
    </MsgProvider>
  );
}
