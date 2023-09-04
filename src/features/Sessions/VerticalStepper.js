import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { Icon } from "../../components/Icon";

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
      <Icon name={iconName} fallback={icon} />
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

export const VerticalStepper = ({ activeStepIndex, onStepClick, steps }) => {
  return (
    <Stepper
      activeStep={activeStepIndex}
      connector={<Connector />}
      orientation="vertical"
    >
      {steps.map(({ label, caption, iconName }, index) => (
        <Step key={`${label}_${caption}_${iconName}`}>
          <StepLabel
            //   icon={<Avatar><Icon name={step.iconName} fontSize="small" /></Avatar>}
            StepIconComponent={StepIcon}
            StepIconProps={{ iconName: iconName }}
            optional={<Typography variant="caption">{caption}</Typography>}
            sx={{ padding: 0 }}
            onClick={onStepClick ? () => onStepClick({ index }) : undefined}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
