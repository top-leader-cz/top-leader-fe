import {
  ArrowBack,
  ArrowForward,
  ArrowRight,
  BarChart,
  BarChartOutlined,
  BarChartRounded,
  InsertChart,
  InsertChartOutlined,
  InsertChartOutlinedRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { useLocalStorage } from "../../features/auth/useLocalStorage";
import { routes } from "../../features/navigation";
import { Layout } from "../Layout";
import { GRAY_BG_LIGHT, PRIMARY_BG_LIGHT } from "../Strengths/Strengths";
import { H1, H2, P } from "../Typography";
import { HistoryRightMenu, useHistoryEntries } from "../Values/MyValues";
import {
  ScrollableRightMenu,
  SelectableChip,
  useSelection,
} from "../Values/SetValues";

const STEPS = [
  {
    name: "Choose area",
    description: "Et nihil quis vero.",
    IconComponent: InsertChart,
  },
  {
    name: "Choose area",
    description: "Et nihil quis vero.",
    IconComponent: InsertChartOutlined,
  },
  {
    name: "Choose area",
    description: "Et nihil quis vero.",
    IconComponent: InsertChartOutlinedRounded,
  },
  {
    name: "Choose area",
    description: "Et nihil quis vero.",
    IconComponent: BarChart,
  },
  {
    name: "Choose area",
    description: "Et nihil quis vero.",
    IconComponent: BarChartOutlined,
  },
  {
    name: "Choose area",
    description: "Et nihil quis vero.",
    IconComponent: BarChartRounded,
  },
  {
    name: "Understand issue",
    description: "Et nihil quis vero.",
    IconComponent: "Target",
  },
];

export const RightMenu = ({
  heading,
  activeStepIndex = 0,
  steps = STEPS,
  buttonProps,
}) => {
  return (
    <ScrollableRightMenu heading={heading} buttonProps={buttonProps}>
      {/* {steps.map((step) => (
        <Box>
          <pre>{JSON.stringify(step, null, 2)}</pre>
        </Box>
      ))} */}
      <Stepper activeStep={activeStepIndex} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={step.IconComponent}
              optional={
                <Typography variant="caption">{step.description}</Typography>
              }
            >
              {step.name}
            </StepLabel>
            {/* <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent> */}
          </Step>
        ))}
      </Stepper>
    </ScrollableRightMenu>
  );
};

const SessionStepCard = ({
  currentStepIndex = 0,
  stepsCount = 0,
  heading,
  perex,
  children,
  sx = { mb: 3 },
}) => {
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardContent sx={{ flexDirection: "column" }}>
        <Box>
          <P>
            Step {currentStepIndex}/{stepsCount}
          </P>
          <H1>{heading}</H1>
          {perex && <P>{perex}</P>}
        </Box>
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
};

const AREAS = {
  1: { name: "Become an active listener" },
  2: { name: "Become more efficient" },
  3: { name: "Show appreciation, recognition and empathy for your team" },
  4: { name: "Be honest, transparent and accountable" },
  5: { name: "Be an effective communicator" },
  6: { name: "Being more assertive" },
  7: { name: "Negotiate effectively" },
  8: { name: "Be more self-confident" },
  9: { name: "Apply critical thinking" },
};

const useNewSession = () => {
  return {
    areas: Object.entries(AREAS).map(([key, value]) => ({
      data: value,
      key,
      label: value.name,
    })),
  };
};

function NewSession() {
  const { authFetch } = useAuth();
  const { areas } = useNewSession();
  //   const history = useHistoryEntries({ storageKey: "sessions_history" });
  const navigate = useNavigate();
  const { selectedKeys, toggleItem } = useSelection({ initialValue: [] });

  console.log("[NewSession.rndr]", {
    // history,
  });

  return (
    <Layout
      rightMenuContent={
        <RightMenu
          heading={"My session 22/06/2022"}
          buttonProps={{
            children: "End session",
            onClick: () => navigate(routes.sessions),
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
          <Button
            color="inherit"
            href={routes.sessions}
            startIcon={<ArrowBack />}
          >
            <H2>Back to the sessions</H2>
          </Button>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      <SessionStepCard heading={"Set area for your development"}>
        <Box sx={{ my: 12.5, ...SelectableChip.wrapperSx }}>
          {areas.map((item) => (
            <SelectableChip
              label={item.label}
              selected={selectedKeys.includes(item.key)}
              onClick={(e) => toggleItem(item)}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "baseline",
            gap: 5,
          }}
        >
          <TextField
            margin="normal"
            // required
            // fullWidth
            id="customArea"
            // label="Area"
            placeholder="Type your own area for growth"
            name="customArea"
            autoFocus
            size="small"
            hiddenLabel
            sx={{ flex: "1 1 auto" }}
          />
          <Button variant="contained" endIcon={<ArrowForward />}>
            Next
          </Button>
        </Box>
      </SessionStepCard>
    </Layout>
  );
}

export default NewSession;
