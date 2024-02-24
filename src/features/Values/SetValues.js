import { Box, Button, Divider } from "@mui/material";
import { applySpec, prop } from "ramda";
import React, { useCallback } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { SelectableChip } from "../../components/SelectableChip";
import { H1, H2, P } from "../../components/Typography";
import { useSelection } from "../../hooks/useSelection";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { useMyMutation } from "../Authorization/AuthProvider";
import { messages } from "./messages";
import { useValuesDict } from "./values";

const RightMenu = ({ selectedKeys, saveDisabled, onSave }) => {
  const valuesDict = useValuesDict();

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
        .map((key) => valuesDict[key] || { name: key })
        .map(({ name, description }) => (
          <InfoBox
            color="primary"
            heading={name}
            sx={{ p: 2, mb: 3, borderRadius: "6px", textWrap: "wrap" }}
          >
            <P>{description}</P>
          </InfoBox>
        ))}
    </ScrollableRightMenu>
  );
};

const useMyValues = () => {
  const valuesDict = useValuesDict();
  const { user } = useAuth();
  const { selectedKeys, toggleItem } = useSelection({
    initialValue: user?.data?.values,
  });

  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-info/values`,
      from: applySpec({ data: prop("selectedKeys") }),
    },
    onSuccess: () => {
      navigate(routes.dashboard);
    },
    invalidate: [
      { queryKey: ["user-info"] },
      { queryKey: ["values"] },
      { queryKey: ["user-insight"] },
    ],
  });

  const navigate = useNavigate();

  const handleSave = useCallback(async () => {
    mutation.mutate({ selectedKeys });
  }, [mutation, selectedKeys]);

  return {
    handleSave,
    valuesArr: Object.values(valuesDict),
    selectedKeys,
    toggleItem,
  };
};

export function SetValuesPage() {
  const { valuesArr, selectedKeys, toggleItem, handleSave } = useMyValues();

  console.log("[SetValues.rndr]", { valuesArr, selectedKeys });
  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <RightMenu
            selectedKeys={selectedKeys}
            saveDisabled={!selectedKeys.length}
            onSave={handleSave}
          />
        }
      >
        <Box mt={4} mb={3} alignItems="flex-start">
          <Button
            color="inherit"
            href={routes.dashboard}
            startIcon={<Icon name="ArrowBack" />}
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
          {valuesArr.map((value) => (
            <SelectableChip
              key={value.name}
              label={value.name}
              selected={selectedKeys.includes(value.key)}
              onClick={() => toggleItem(value)}
            />
          ))}
        </Box>
      </Layout>
    </MsgProvider>
  );
}
