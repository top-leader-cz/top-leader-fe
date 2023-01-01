import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { SelectableChip } from "../../components/SelectableChip";
import { H1, H2, P } from "../../components/Typography";
import { useSelection } from "../../hooks/useSelection";
import { routes } from "../../routes";

const Controls = ({ handleNext, handleBack }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "baseline",
        justifyContent: "flex-end",
        gap: 5,
      }}
    >
      <Button variant="outlined" endIcon={<ArrowBack />} onClick={handleBack}>
        Back
      </Button>

      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
};

const AreaStep = (props) => {
  const { areas } = useNewSession();
  const { selectedKeys, toggleItem } = useSelection({ initialValue: [] });

  return (
    <SessionStepCard
      {...props}
      renderControls={() => (
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
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={props.handleNext}
          >
            Next
          </Button>
        </Box>
      )}
    >
      <Box sx={{ my: 12.5, ...SelectableChip.wrapperSx }}>
        {areas.map((item) => (
          <SelectableChip
            key={item.label}
            label={item.label}
            selected={selectedKeys.includes(item.key)}
            onClick={(e) => toggleItem(item)}
          />
        ))}
      </Box>
    </SessionStepCard>
  );
};

const STEPS = [
  {
    label: "Choose area",
    caption: "Area for development",
    // caption: "InsertChart",
    iconName: "InsertChart",
    heading: "Set area for your development",
    perex: "",
    StepComponent: AreaStep,
  },
  {
    label: "Set long-term goal",
    caption: "Goals give you focus",
    // caption: "Adjust",
    iconName: "Adjust",
    heading: "Set the long term goal",
    perex:
      "Goals give you focus. Goals help you measure progress and stay motivated.",
    focusedList: ["Focus on building relationship", "TODO", "TODO", "TODO"],
  },
  {
    label: "Motivation",
    caption: "See yourself to excel",
    // caption: "RocketLaunch",
    iconName: "RocketLaunch",
    heading: "Motivation/visualization",
    perex: "Imagine the situation where you excel in this area.",
    focusedList: [
      "TODO",
      "How do you feel when you excel in it?",
      "How can your strenghts help you to achieve excellence in that?",
    ],
  },
  {
    label: "Set action steps",
    caption: "Be specific",
    // caption: "Explore",
    iconName: "Explore",
    heading: "Set your action steps",
    perex:
      "Create SMART goals (Specific, Measurable, Attainable, Realistic, Time-bound) - The more specific you can be with your action step, the higher the chance you’ll complete it.",
  },
];

const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#EAECF0",
  color: "#667085",
  zIndex: 1,
  width: 48,
  height: 48,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  }),
  ...(ownerState.completed &&
    {
      // color: theme.palette.common.white,
      // backgroundColor: theme.palette.secondary.light,
    }),
}));

function StepIcon({ active, completed, className, icon, iconName }) {
  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      <Icon name={iconName} fallback={icon} fontSize="small" />
    </StepIconRoot>
  );
}

const Connector = styled(StepConnector)(({ theme }) => ({
  marginLeft: "24px",
  //   [`&.${stepConnectorClasses.active}`]: {
  //     [`& .${stepConnectorClasses.line}`]: {},
  //   },
  //   [`&.${stepConnectorClasses.completed}`]: {
  //     [`& .${stepConnectorClasses.line}`]: {},
  //   },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#EAECF0",
    minHeight: 40,
  },
}));

export const RightMenu = ({
  heading,
  activeStepIndex = 0,
  steps,
  buttonProps,
}) => {
  return (
    <ScrollableRightMenu heading={heading} buttonProps={buttonProps}>
      {/* {steps.map((step) => (
        <Box>
          <pre>{JSON.stringify(step, null, 2)}</pre>
        </Box>
      ))} */}
      <Stepper
        activeStep={activeStepIndex}
        connector={<Connector />}
        orientation="vertical"
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              //   icon={<Avatar><Icon name={step.iconName} fontSize="small" /></Avatar>}
              StepIconComponent={StepIcon}
              StepIconProps={{ iconName: step.iconName }}
              optional={
                <Typography variant="caption">{step.caption}</Typography>
              }
              sx={{ padding: 0 }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </ScrollableRightMenu>
  );
};

const FocusedListRoot = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create(),
}));

const FocusedList = ({
  items,
  initialCount = 1,
  showMoreLabel = "Show another",
}) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  return (
    <FocusedListRoot>
      <ul>
        {Array(visibleCount)
          .fill(null)
          .map((_, i) => {
            const item = items[i];
            return <li key={item}>{item}</li>;
          })}
      </ul>
      {visibleCount < items.length ? (
        <Button variant="text" onClick={() => setVisibleCount((c) => c + 1)}>
          {showMoreLabel}
        </Button>
      ) : null}
    </FocusedListRoot>
  );
};

const SessionStepCard = ({
  step: { perex, heading, focusedList } = {},
  stepper,
  handleNext,
  handleBack,
  children,
  renderControls = ({ handleNext, handleBack }) => (
    <Controls handleNext={handleNext} handleBack={handleBack} />
  ),
  sx = { mb: 3 },
}) => {
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardContent sx={{ flexDirection: "column" }}>
        <Box>
          {stepper && (
            <P sx={{ mb: 1 }}>
              Step {stepper.currentIndex + 1}/{stepper.totalCount}
            </P>
          )}
          <H1 gutterBottom>{heading}</H1>
          {perex && <P>{perex}</P>}
        </Box>
        {focusedList && <FocusedList items={focusedList} />}
        <Box>{children}</Box>
        {renderControls({ handleNext, handleBack })}
      </CardContent>
    </Card>
  );
};

const AREAS = {
  1: { label: "Become an active listener" },
  2: { label: "Become more efficient" },
  3: { label: "Show appreciation, recognition and empathy for your team" },
  4: { label: "Be honest, transparent and accountable" },
  5: { label: "Be an effective communicator" },
  6: { label: "Being more assertive" },
  7: { label: "Negotiate effectively" },
  8: { label: "Be more self-confident" },
  9: { label: "Apply critical thinking" },
};

const useNewSession = () => {
  return {
    areas: Object.entries(AREAS).map(([key, value]) => ({
      data: value,
      key,
      label: value.label,
    })),
  };
};

const useSteps = ({ steps, initialIndex = 0, initialData = {} }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(initialIndex);
  const [data, setData] = useState(initialData);
  const activeStep = steps[activeStepIndex];

  const handleNext = useCallback((data) => {
    setData((prev) => ({ ...prev, data }));
    setActiveStepIndex((i) => (i + 1) % STEPS.length);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStepIndex((i) => Math.max(0, i - 1));
  }, []);

  return {
    steps,
    activeStep,
    activeStepIndex,
    isFirst: activeStepIndex === 0,
    isLast: activeStepIndex === steps.length - 1,
    handleNext,
    handleBack,
    data,
    setData,
  };
};

function NewSession() {
  //   const history = useHistoryEntries({ storageKey: "sessions_history" });
  const navigate = useNavigate();
  const {
    activeStep: { StepComponent = SessionStepCard, ...activeStep },
    activeStepIndex,
    handleNext,
    handleBack,
  } = useSteps({
    steps: STEPS,
  });

  return (
    <Layout
      rightMenuContent={
        <RightMenu
          heading={"My session 22/06/2022"}
          activeStepIndex={activeStepIndex}
          steps={STEPS}
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
      <StepComponent
        step={activeStep}
        stepper={{ currentIndex: activeStepIndex, totalCount: STEPS.length }}
        handleNext={handleNext}
        handleBack={handleBack}
      />
    </Layout>
  );
}

export default NewSession;
