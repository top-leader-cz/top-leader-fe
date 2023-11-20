import { useCallback } from "react";
import { Msg, useMsg } from "../../../components/Msg/Msg";
import { useAreasDict } from "../areas";
import { SessionStepCard } from "../SessionStepCard";
import { Box, Button } from "@mui/material";
import { ControlsContainer } from "./Controls";
import { Icon } from "../../../components/Icon";
import { IconTile } from "../../../components/IconTile/IconTile";

export const AlignStep = ({
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
  setAdjust,
  previousArea = "",
  previousGoal = "",
}) => {
  const msg = useMsg();
  const { areas } = useAreasDict();

  const handleAdjust = useCallback(() => {
    console.log("handleAdjust");
    setAdjust(true);
    handleNext();
  }, [handleNext, setAdjust]);
  const handleAligned = useCallback(() => {
    console.log("handleAligned");
    setAdjust(false);
    handleNext();
  }, [handleNext, setAdjust]);

  return (
    <SessionStepCard {...{ step, stepper, handleNext, handleBack }}>
      <Box display="flex" flexDirection="row" gap={1} mt={7.5} mb={10}>
        <IconTile
          iconName={"InsertChart"}
          caption={msg("sessions.edit.steps.align.area.caption")}
          text={areas[previousArea]?.label || previousArea}
        />
        <IconTile
          iconName={"InsertChart"}
          caption={msg("sessions.edit.steps.align.goal.caption")}
          text={previousGoal}
        />
      </Box>
      <ControlsContainer>
        <Button variant="outlined" onClick={handleAdjust}>
          <Msg id="sessions.edit.steps.align.adjust" />
        </Button>
        <Button
          variant="contained"
          endIcon={<Icon name="ArrowForward" />}
          onClick={handleAligned}
        >
          <Msg id="sessions.edit.steps.align.confirm" />
        </Button>
      </ControlsContainer>
    </SessionStepCard>
  );
};
