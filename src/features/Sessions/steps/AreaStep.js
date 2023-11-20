import { ArrowForward } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { identity } from "ramda";
import { useMemo, useState } from "react";
import { Msg } from "../../../components/Msg";
import { useMsg } from "../../../components/Msg/Msg";
import { SelectableChip } from "../../../components/SelectableChip";
import { SessionStepCard } from "../SessionStepCard";
import { useAreasDict } from "../areas";
import { SESSION_FIELDS } from "./constants";

export const useAreas = ({ valueArr }) => {
  const { areas: areasDict } = useAreasDict();
  const areasArr = Object.entries(areasDict).map(([key, value]) => ({
    key,
    label: value.label,
  }));

  const mapped = useMemo(
    () =>
      valueArr.map((value) => {
        const areaMaybe = areasArr.find((area) => area.key === value);
        const isCustomArea = !areaMaybe;
        const customAreaMaybe = isCustomArea ? value : undefined;

        return {
          isCustomArea,
          areaMaybe,
          customAreaMaybe,
          areaLabelMaybe: areaMaybe?.label,
          areasArr,
          label: areaMaybe?.label || customAreaMaybe,
        };
      }),
    [areasArr, valueArr]
  );
  return mapped;
};

const useArea = ({ valueArr, value = valueArr?.length ? valueArr[0] : "" }) => {
  const { areas: areasDict } = useAreasDict();
  const areasArr = Object.entries(areasDict).map(([key, value]) => ({
    key,
    label: value.label,
  }));
  const areaMaybe = areasArr.find((area) => area.key === value);
  const isCustomArea = !areaMaybe;
  const customAreaMaybe = isCustomArea ? value : undefined;

  return {
    isCustomArea,
    areaMaybe,
    customAreaMaybe,
    areaLabelMaybe: areaMaybe?.label,
    areasArr,
  };
};

export const AreaStep = ({
  handleNext,
  data,
  setData,
  step: { fieldDefMap, ...step },
  stepper,
}) => {
  const valueArr = data[SESSION_FIELDS.AREA_OF_DEVELOPMENT];
  const value = valueArr?.length ? valueArr[0] : "";
  const { areasArr, isCustomArea, areaMaybe, customAreaMaybe } = useArea({
    value,
  });

  const [selected, setSelected] = useState(areaMaybe?.key);
  const [customArea, setCustomArea] = useState(customAreaMaybe ?? "");

  const newArea = customArea?.trim() || selected;
  const field = fieldDefMap[SESSION_FIELDS.AREA_OF_DEVELOPMENT];
  const map = field?.map || identity;
  const next = () => {
    handleNext({ [SESSION_FIELDS.AREA_OF_DEVELOPMENT]: map(newArea) });
  };
  const msg = useMsg();

  console.log("[AreaStep.rndr]", {
    data,
    selected,
    customArea,
    areasArr,
    isCustomArea,
    value,
  });

  return (
    <SessionStepCard {...{ step, stepper }}>
      <Box sx={{ my: 12.5, ...SelectableChip.wrapperSx }}>
        {areasArr.map((item) => (
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
