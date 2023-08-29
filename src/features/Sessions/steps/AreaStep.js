import { ArrowForward } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Msg } from "../../../components/Msg";
import { useMsg } from "../../../components/Msg/Msg";
import { SelectableChip } from "../../../components/SelectableChip";
import { SessionStepCard } from "../SessionStepCard";
import { useAreasDict } from "../areas";

const useNewSession = () => {
  const { areas } = useAreasDict();
  return {
    areas: Object.entries(areas).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  };
};

export const AreaStep = ({
  keyName = "areaOfDevelopment",
  handleNext,
  data,
  setData,
  step,
  stepper,
}) => {
  const { areas } = useNewSession();
  const valueArr = data[keyName];
  const value = valueArr?.length ? valueArr[0] : "";

  const isCustomArea = !areas.some((area) => area.key === value);
  const [selected, setSelected] = useState(isCustomArea ? undefined : value);
  const [customArea, setCustomArea] = useState(isCustomArea ? value : "");

  const newArea = customArea || selected;
  const next = () => {
    handleNext({ [keyName]: [newArea] });
  };
  const msg = useMsg();

  console.log("[AreaStep.rndr]", {
    data,
    selected,
    customArea,
    areas,
    isCustomArea,
    value,
  });

  return (
    <SessionStepCard {...{ step, stepper }}>
      <Box sx={{ my: 12.5, ...SelectableChip.wrapperSx }}>
        {areas.map((item) => (
          <SelectableChip
            key={item.key}
            label={item.label}
            selected={selected === item.key}
            onClick={() => {
              setSelected(item.key);
              setCustomArea("");
            }}
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
          placeholder={msg("sessions.new.steps.area.customarea.placeholder")}
          name="customArea"
          autoFocus
          size="small"
          hiddenLabel
          value={customArea}
          onChange={(e) => {
            setSelected();
            setCustomArea(e.target.value);
          }}
          sx={{ flex: "1 1 auto" }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={next}
          disabled={!newArea}
        >
          <Msg id="sessions.new.steps.area.next" />
        </Button>
      </Box>
    </SessionStepCard>
  );
};
