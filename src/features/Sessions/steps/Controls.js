import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export const ControlsContainer = ({ sx, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "baseline",
        justifyContent: "flex-end",
        gap: 3,
        ...sx,
      }}
      {...props}
    />
  );
};

export const Controls2 = ({ ...props }) => {
  return <ControlsContainer></ControlsContainer>;
};

export const Controls = ({
  handleNext,
  nextProps,
  handleBack,
  data,
  sx = {},
}) => {
  console.log("[Controls.rndr]", data);
  return (
    <ControlsContainer>
      <Button
        variant="outlined"
        endIcon={<ArrowBack />}
        onClick={() => handleBack(data)}
      >
        Back
      </Button>

      <Button
        type="submit"
        variant="contained"
        endIcon={<ArrowForward />}
        onClick={() => handleNext(data)}
        children="Next"
        {...nextProps}
      />
    </ControlsContainer>
  );
};
