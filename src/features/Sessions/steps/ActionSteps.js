import { Box, Button, Chip, IconButton } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defineMessages } from "react-intl";
import {
  DatePickerField,
  RHFTextField,
} from "../../../components/Forms/Fields";
import {
  invalidDate,
  notBlank,
  todayOrFuture,
} from "../../../components/Forms/validations";
import { Icon } from "../../../components/Icon";
import { MsgProvider } from "../../../components/Msg";
import { useMsg } from "../../../components/Msg/Msg";
import { P } from "../../../components/Typography";
import { primary25, primary500 } from "../../../theme";
import { Loaders } from "../../QM/QueryRenderer";

export const actionStepsMessages = defineMessages({
  "action-steps.label.placeholder": {
    id: "action-steps.label.placeholder",
    defaultMessage: "Label",
  },
  "action-steps.due-date.label": {
    id: "action-steps.due-date.label",
    defaultMessage: "Due date",
  },
  "action-steps.add-button": {
    id: "action-steps.add-button",
    defaultMessage: "Add action",
  },
  "action-steps.done": {
    id: "action-steps.done",
    defaultMessage: "Done",
  },
});

const RefreshableChip = ({ index, text, onChipClick, handleRefreshTip }) => {
  // const isHidden = unusedHints.length === 0 || value === text;

  if (!text) return null;

  return (
    <Chip
      sx={{
        m: "6px",
        p: "6px",
        borderRadius: "6px",
        color: primary500,
        bgcolor: primary25,
        // justifyContent: "flex-start",
        // pointerEvents: "none",
        // height: "auto",
        "& .MuiChip-label": {
          // textWrap: "wrap",
          paddingLeft: 0,
          whiteSpace: "pre-wrap",
          // paddingRight: 0,
        },
      }}
      key={text}
      label={text}
      onClick={() => onChipClick({ text, index })}
      {...(handleRefreshTip
        ? {
            onDelete: handleRefreshTip,
            deleteIcon: (
              <Icon
                name="Sync"
                sx={{ width: 16, height: 16, color: primary500 }}
              />
            ),
          }
        : {})}
    />
  );
};

const getListHints = (hints, labelValues) => {
  const { listHints, unusedHints } = labelValues.reduce(
    (acc, label) => {
      const labelIsHint = hints.some((h) => h === label);
      const [nextHint, ...unused] = acc.unusedHints;

      if (labelIsHint || !nextHint || label) {
        return {
          listHints: acc.listHints.concat(""),
          unusedHints: acc.unusedHints,
        };
      }

      return {
        listHints: acc.listHints.concat(nextHint),
        unusedHints: unused,
      };
    },
    {
      listHints: [],
      unusedHints: hints.filter((h) => !labelValues.some((v) => v === h)),
    }
  );
  return { listHints, unusedHints };
};

export const ActionStepsInner = ({
  name,
  rules,
  control,
  sx = {},
  hints = [],
  hintsLoading = false,
}) => {
  const msg = useMsg();
  const methods = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control || methods?.control,
    name,
    rules,
  });
  const getLabelName = (index) => `${name}.${index}.label`;

  const [hintsShift, setHintsShift] = useState(0);
  const onChipClick = ({ text, index }) => {
    methods.setValue(getLabelName(index), text, { shouldValidate: true });
  };
  const handleRefreshTip = useCallback(() => {
    setHintsShift((i) => i + 1);
  }, []);

  console.log("[ActionSteps.rndr]", {
    methods,
    value: methods.watch(name),
    name,
  });

  const labelValues = methods.watch(name).map((item) => item.label);
  const shiftedHints = useMemo(() => {
    const shifted = hints
      .slice(hintsShift % hints.length, hints.length)
      .concat(hints.slice(0, hintsShift))
      .slice(0, hints.length);
    return shifted;
  }, [hints, hintsShift]);
  const { listHints, unusedHints } = useMemo(
    () => getListHints(shiftedHints, labelValues),
    [labelValues, shiftedHints]
  );
  const getHint = (index) => listHints[index] || "";

  console.log("[ActionStepsInner.rndr]", {
    labelValues,
    hints,
    hintsShift,
    shiftedHints,
    listHints,
    unusedHints,
  });

  return (
    <Box sx={{ ...sx }}>
      {fields.map((field, i) => (
        <Box
          key={field.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            mb: 2,
          }}
        >
          <Box
            key={field.id}
            sx={{
              display: "flex",
              alignItems: "stretch",
              // mb: 2,
            }}
          >
            <Box sx={{ width: 16, mx: 1, mt: 1.5 }}>{i + 1}.</Box>
            <Box
              // component={"li"}
              sx={{
                display: "flex",
                alignItems: "baseline",
                // mb: 2,
              }}
            >
              <RHFTextField
                control={control}
                name={getLabelName(i)}
                placeholder={msg("action-steps.label.placeholder")}
                rules={{
                  required: true,
                  validate: { notBlank: notBlank(0) },
                }}
                withHelperTextSpace
                autoFocus
                sx={{
                  mx: 1,
                  mb: 0.5,
                  minWidth: { lg: 320 },
                  // "& .MuiFormHelperText-root.Mui-error": { height: 0, position: "relative", mt: 0, textAlign: "right", },
                }}
              />
              <P sx={{ ml: 4, mr: 2 }}>{msg("action-steps.due-date.label")}</P>
              <DatePickerField
                control={control}
                name={`${name}.${i}.date`}
                rules={{ validate: { invalidDate, todayOrFuture } }}
                disablePast
                clearable
                sx={{ width: 180 }}
              />
              {i > 0 && (
                <IconButton
                  onClick={() => remove(i)}
                  sx={{
                    mx: 2,
                    position: "relative",
                    top: "5px",
                  }}
                >
                  <Icon name="Delete" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Box sx={{ ml: 4 }}>
            {hintsLoading ? (
              <Loaders.Skeleton loaderProps={{ rows: 2, sx: { mb: 1 } }} />
            ) : (
              <RefreshableChip
                index={i}
                text={getHint(i)}
                onChipClick={onChipClick}
                handleRefreshTip={
                  unusedHints.length ? handleRefreshTip : undefined
                }
              />
            )}
          </Box>
        </Box>
      ))}
      <Button
        onClick={() =>
          append({
            label: "",
            date: null,
          })
        }
        startIcon={<Icon name="Add" />}
      >
        {msg("action-steps.add-button")}
      </Button>
    </Box>
  );
};

export const ActionSteps = (props) => (
  <MsgProvider messages={actionStepsMessages}>
    <ActionStepsInner {...props} />
  </MsgProvider>
);
