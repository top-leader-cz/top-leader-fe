import { ArrowForward } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { SelectableChip } from "../../../components/SelectableChip";
import { SessionStepCard } from "../SessionStepCard";

export const AREAS = {
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
          placeholder="Type your own area for growth"
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
          Next
        </Button>
      </Box>
    </SessionStepCard>
  );
};
