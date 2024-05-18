import {
  Box,
  Button,
  CardActionArea,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import { any, chain, equals, findIndex, identity, map, prop } from "ramda";
import { useMemo, useState } from "react";
import { Icon } from "../../../components/Icon";
import { Msg } from "../../../components/Msg";
import { useMsg } from "../../../components/Msg/Msg";
import { SelectableChip } from "../../../components/SelectableChip";
import { SessionStepCard } from "../SessionStepCard";
import { useAreasDict } from "../areas";
import { SESSION_FIELDS } from "./constants";
import { H2, P } from "../../../components/Typography";
import { primary25, primary500 } from "../../../theme";
import { useAuth } from "../../Authorization";
import { useStrengths } from "../../Strengths/talents";

export const useAreas = () => {
  const { areas: areasDict } = useAreasDict();
  const areasArr = Object.entries(areasDict).map(([key, value]) => ({
    key,
    name: value.label,
    label: value.label,
  }));
  return areasArr;
};

export const useArea = ({
  valueArr,
  value = valueArr?.length ? valueArr[0] : "",
  knownNames = [],
}) => {
  const areasArr = useAreas();
  const areaMaybe = areasArr.find((area) => area.key === value); // backward compatibility
  const name = areaMaybe?.name || value;

  const isKnown = knownNames.includes(name);

  const areaNameMaybe = isKnown ? name : undefined;
  const customAreaMaybe = isKnown ? undefined : name;

  return {
    areaText: name,
    areaNameMaybe,
    customAreaMaybe,
  };
};

const AreaTile = ({
  title,
  items,
  selectedAreaName,
  onItemSelect,
  fallback,
  isTileSelected = true,
  onClick,
}) => {
  return (
    <CardActionArea
      // <Box
      component="div"
      disableRipple
      onClick={onClick}
      sx={{ p: 3, bgcolor: "#FCFCFD", borderRadius: "4px", minHeight: "190px" }}
    >
      <H2 sx={{ mb: 3, color: isTileSelected ? primary500 : "#344054" }}>
        {title}
      </H2>
      {!isTileSelected ? null : (
        <TagsOrFallback
          items={items}
          fallback={fallback}
          selected={selectedAreaName}
          onSelect={onItemSelect}
        />
      )}
    </CardActionArea>
  );
};

const SelectableWithFallback = ({ items, fallback, selected, onSelect }) => {
  if (!items?.length) return <P>{fallback}</P>;

  return items.map(({ name, label }) => (
    <SelectableChip
      key={name}
      label={label}
      selected={selected === name}
      // noIcon
      onClick={(e) => {
        onSelect({ name, label });
        e.stopPropagation();
      }}
    />
  ));
};

const TagsOrFallback = ({ items, fallback, selected, onSelect }) => {
  if (!items?.length) return <P>{fallback}</P>;

  const selectedSx = {
    color: primary500,
    backgroundColor: primary25,
    border: `1px solid ${primary500}`,
  };

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {items.map(({ name, label }) => (
        <Chip
          key={name}
          label={label}
          sx={{
            borderRadius: "6px",
            backgroundColor: "#F9F8FF",
            ...(selected === name ? selectedSx : {}),
          }}
          onClick={(e) => {
            onSelect({ name, label });
            e.stopPropagation();
          }}
        />
      ))}
    </Box>
  );
};

export const AreaStep = ({
  handleNext,
  data,
  setData,
  step: { fieldDefMap, ...step },
  stepper,
}) => {
  const { user } = useAuth();
  const topStrengths = useStrengths({
    keys: user?.data?.strengths?.slice(0, 5),
  });
  const bottomStrengths = useStrengths({
    keys: user?.data?.strengths?.slice(-10),
  });
  const areas = useAreas();
  const tilesItems = useMemo(
    () => [topStrengths, bottomStrengths, areas],
    [areas, bottomStrengths, topStrengths]
  );
  const knownNamesByTile = useMemo(
    () => map(map(prop("name")), tilesItems),
    [tilesItems]
  );

  const valueArr = data[SESSION_FIELDS.AREA_OF_DEVELOPMENT];
  const { areaNameMaybe, customAreaMaybe } = useArea({
    valueArr,
    knownNames: chain(identity, knownNamesByTile),
  });

  const selectedTileIndex = findIndex(
    any(equals(areaNameMaybe)),
    knownNamesByTile
  );
  const initialSelectedTile = [0, 1, 2].includes(selectedTileIndex)
    ? selectedTileIndex
    : 0;
  const [selectedTile, setSelectedTile] = useState(initialSelectedTile);

  const [selectedArea, setSelected] = useState(
    areaNameMaybe || customAreaMaybe || ""
  );
  // const [customArea, setCustomArea] = useState(customAreaMaybe ?? "");
  const newArea = selectedArea?.trim();
  // const newArea = customArea?.trim() || selectedArea;
  const field = fieldDefMap[SESSION_FIELDS.AREA_OF_DEVELOPMENT];
  const areaValue = (field?.map || identity)(newArea);
  console.log("[AreaStep.rndr]", { areaValue });
  const next = () => {
    handleNext({ [SESSION_FIELDS.AREA_OF_DEVELOPMENT]: areaValue });
  };
  const msg = useMsg();
  const createOnSelect = (key) => () => {
    setSelectedTile(key);
    // setSelected();
    // setCustomArea("");
  };
  const onItemSelect = (item) => {
    setSelected(item?.name);
    // setCustomArea("");
  };
  const onCustomAreaChange = (value) => {
    setSelected(value);
    // setCustomArea(value);
  };

  console.log("[AreaStep.rndr]", {
    data,
    selectedArea,
    // customArea,
    selectedTile,
  });

  return (
    <SessionStepCard {...{ step, stepper }}>
      <Grid container spacing={3} sx={{ my: 3 }}>
        <Grid item xs={12} md={6} lg={4}>
          <AreaTile
            title={msg("sessions.new.steps.area.strengths.title")}
            items={tilesItems[0]}
            selectedAreaName={selectedArea}
            onItemSelect={onItemSelect}
            fallback={msg("sessions.new.steps.area.fallback.title")}
            isTileSelected={selectedTile === 0}
            onClick={createOnSelect(0)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AreaTile
            title={msg("sessions.new.steps.area.weaknesses.title")}
            items={tilesItems[1]}
            selectedAreaName={selectedArea}
            onItemSelect={onItemSelect}
            fallback={msg("sessions.new.steps.area.fallback.title")}
            isTileSelected={selectedTile === 1}
            onClick={createOnSelect(1)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AreaTile
            title={msg("sessions.new.steps.area.recommended.title")}
            items={tilesItems[2]}
            selectedAreaName={selectedArea}
            onItemSelect={onItemSelect}
            fallback={null}
            isTileSelected={selectedTile === 2}
            onClick={createOnSelect(2)}
          />
        </Grid>
      </Grid>
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
          // autoFocus
          size="small"
          hiddenLabel
          value={selectedArea}
          onChange={(e) => {
            onCustomAreaChange(e.target.value);
          }}
          sx={{ flex: "1 1 auto" }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<Icon name="ArrowForward" />}
          onClick={next}
          disabled={!newArea}
        >
          <Msg id="sessions.new.steps.area.next" />
        </Button>
      </Box>
    </SessionStepCard>
  );
};
