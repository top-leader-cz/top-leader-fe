import { ArrowBack, Check, Close } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Paper } from "@mui/material";
import { styled } from "@mui/system";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { routes } from "../../features/navigation";
import { Layout } from "../Layout";
import { useHistoryEntries } from "../Strengths/Strengths";
import { H1, H2, P } from "../Typography";
import { InfoBox } from "./MyValues";
import { VALUES } from "./values";

export const ScrollableRightMenu = ({ heading, children, buttonProps }) => {
  return (
    <Paper
      square
      sx={{
        px: 3,
        // py: 4,
        height: "100vh",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
      }}
    >
      <H2 sx={{ my: 4 }}>{heading}</H2>
      <Box
        sx={{
          overflow: "scroll",
          flex: 1,
          display: "flex",
          flexFlow: "column nowrap",
        }}
      >
        {children}
      </Box>
      <Button fullWidth variant="contained" sx={{ my: 4 }} {...buttonProps} />
    </Paper>
  );
};

const RightMenu = ({ selectedKeys, saveDisabled, onSave }) => {
  return (
    <ScrollableRightMenu
      heading={"My values"}
      buttonProps={{
        disabled: saveDisabled,
        onClick: onSave,
        children: "Save my values",
      }}
    >
      {selectedKeys
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((key) => VALUES[key] || { name: key })
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

export const useSelection = ({ keyName = "key", initialValue = [] }) => {
  const [selectedKeys, setSelectedKeys] = useState(initialValue);

  const toggleItem = useCallback(
    (item) =>
      setSelectedKeys((keys) =>
        keys.includes(item[keyName])
          ? keys.filter((k) => k !== item[keyName])
          : [...keys, item[keyName]]
      ),
    [keyName]
  );

  return { selectedKeys, toggleItem };
};

const useMyValues = () => {
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
    items: Object.entries(VALUES).map(([key, value]) => ({
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

// https://mui.com/material-ui/react-chip/
// https://mui.com/material-ui/api/chip/

// https://mui.com/system/styled/#custom-components
// https://mui.com/material-ui/customization/how-to-customize/#2-reusable-component
// https://mui.com/system/styled/#styled-component-options-styles-component
// https://mui.com/material-ui/customization/theme-components/#creating-new-component-variants

const SelectableChip2 = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "bgcolor" && prop !== "selected",
  name: "SelectableChip",
  slot: "Root",
  // We are specifying here how the styleOverrides are being applied based on props
  overridesResolver: (props, styles) =>
    console.log("overridesResolver", { props, styles }) || [
      styles.root,
      props.color === "primary" && styles.primary,
      props.color === "secondary" && styles.secondary,
    ],
})(
  ({ theme, ...props }) =>
    console.log("styled", { theme, props }) || {
      backgroundColor: "pink",
    }
);

export const SelectableChip = ({ selected, ...props }) => {
  const selectedProps = selected
    ? { variant: "selected", icon: <Check /> }
    : { variant: "unselected", icon: <Close /> };

  return <Chip {...props} {...selectedProps} />;
};

SelectableChip.wrapperSx = {
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: 3,
  pb: 3,
};

function SetValues() {
  const { authFetch } = useAuth();
  const { items, selectedKeys, toggleItem, save } = useMyValues();

  console.log("[SetValues.rndr]", { items, selectedKeys });
  return (
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
          <H2>Back to the dashboard</H2>
        </Button>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>

      <H1 mt={12.5} gutterBottom align="center">
        Select the values that you believe in the most
      </H1>
      <P textAlign="center">
        Your values are a central part of who you are. When the things that you
        do and the way you respond match your values, you’ll feel confident that
        you are doing and saying the right thing.
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
  );
}

export default SetValues;
