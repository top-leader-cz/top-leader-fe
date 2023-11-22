import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { Icon } from "../../components/Icon";
// import { autoPlay } from "react-swipeable-views-utils";

export function SwipeableStepper({ steps }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    // <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
    <Box
      sx={{
        display: "flex",
        flexFlow: "column",
        height: "100%",
      }}
    >
      {/* <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography>{images[activeStep].label}</Typography>
      </Paper> */}
      <Box>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{
            width: "100%",
            minWidth: "20px",
            maxWidth: "100%",
            position: "relative",
          }}
          slideStyle={{ width: "100%", minWidth: "20px", maxWidth: "100%" }} // each slide component
          containerStyle={{ width: "100%", minWidth: "20px", maxWidth: "100%" }} // each slide container
        >
          {steps.map((step, index) => (
            <div key={step.key || index}>
              {Math.abs(activeStep - index) <= 2 ? step.text : null}
            </div>
          ))}
        </SwipeableViews>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <MobileStepper
        sx={{ background: "transparent" }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {/* Next */}
            {theme.direction === "rtl" ? (
              <Icon name="KeyboardArrowLeft" />
            ) : (
              <Icon name="KeyboardArrowRight" />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <Icon name="KeyboardArrowRight" />
            ) : (
              <Icon name="KeyboardArrowLeft" />
            )}
            {/* Back */}
          </Button>
        }
      />
    </Box>
  );
}
