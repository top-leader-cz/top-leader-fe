import { ArrowForward } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Msg } from "../../../components/Msg";
import { useMsg } from "../../../components/Msg/Msg";
import { SelectableChip } from "../../../components/SelectableChip";
import { AREAS_EN } from "../../../translations/areas";
import { SessionStepCard } from "../SessionStepCard";

const useNewSession = () => {
  return {
    areas: Object.entries(AREAS_EN).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  };
};

export const AreaStep = ({ handleNext, data, setData, ...props }) => {
  const { areas } = useNewSession();

  const isCustomArea = !areas.some((area) => area.key === data.area);
  const [selected, setSelected] = useState(
    isCustomArea ? undefined : data.area
  );
  const [customArea, setCustomArea] = useState(isCustomArea ? data.area : "");
  console.log({ selected, customArea });

  const newArea = customArea || selected;
  const next = () => {
    handleNext({ area: newArea });
  };
  const msg = useMsg();

  return (
    <SessionStepCard {...props}>
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
