import { ArrowBack, ArrowForward, Check } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { useLocalStorage } from "../../features/auth/useLocalStorage";
import { routes } from "../../features/navigation";
import { Layout } from "../Layout";
import { useAssessmentHistory } from "../Strengths/Strengths";
import { H1, H2, P } from "../Typography";

const RightMenu = ({ saveDisabled, onSave }) => {
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
        <H2>My values</H2>
      </Box>
      <Button
        fullWidth
        variant="contained"
        onClick={onSave}
        disabled={saveDisabled}
      >
        Save my values
      </Button>
    </Paper>
  );
};

const useMyValues = () => {
  const navigate = useNavigate();

  const save = useCallback(() => {
    navigate(routes.myValues);
  }, [navigate]);

  console.log("[useMyValues]", {});

  return {
    save,
    items: [
      { label: "Accountability", key: "accountability" },
      // { label: "Accuracy", key: "accuracy" },
    ],
    selectedKeys: [],
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

const SelectableChip = ({ selected, ...props }) => {
  const selectedProps = selected
    ? { variant: "selected", icon: <Check /> }
    : { variant: "unselected" };

  return <Chip {...props} {...selectedProps} />;
};

function SetValues() {
  const { authFetch } = useAuth();
  const { items, selectedKeys, save } = useMyValues();

  console.log("[SetValues.rndr]", { items, selectedKeys });
  return (
    <Layout
      rightMenuContent={
        <RightMenu saveDisabled={!selectedKeys.length} onSave={save} />
      }
    >
      <Box mt={4} mb={3} alignItems="flex-start">
        <Button href={routes.dashboard} startIcon={<ArrowBack />}>
          <H2>Back to the dashboard</H2>
        </Button>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>

      <H1 mt={12.5} gutterBottom align="center">
        Select the values that you believe in the most
      </H1>
      <P>
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
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        {items.map(({ label, key }) => (
          <>
            <Chip
              label={label}
              selected={true}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={label}
              selected={false}
              color="primary"
              variant="filled"
            />
            <Chip
              label={label}
              selected={true}
              color="default"
              variant="outlined"
            />
            <Chip
              label={label}
              selected={false}
              color="default"
              variant="filled"
            />
            <SelectableChip label={label} selected={true} />
            <SelectableChip label={label} selected={false} />
          </>
        ))}
      </Box>
    </Layout>
  );
}

export default SetValues;
