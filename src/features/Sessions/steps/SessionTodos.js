import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  InputLabel,
  Stack,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CheckboxField, StaticValueField } from "../../../components/Forms";
import { useMsg } from "../../../components/Msg/Msg";

const userInputSx = { my: 3, p: 3, bgcolor: "#FCFCFD" };

export const SessionTodosFields = ({ name, rules, withoutControls }) => {
  const msg = useMsg();
  const { setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name,
    rules,
    // shouldUnregister: false,
  });
  const list = watch(name);

  const [allChecked, setAllChecked] = useState();
  const handleCheckAll = useCallback(
    (e, value) => {
      console.log(name, "handleCheckAll", { e, value });
      list.forEach((field, i) => {
        setValue(`${name}.${i}.checked`, value);
      });
      setAllChecked(value);
    },
    [list, setValue, name]
  );
  const isAllChecked = !!list.length && list.every((field) => field.checked);
  useEffect(() => {
    console.log("[SessionTodosFields.useEffect]", { list, isAllChecked });
    setAllChecked(isAllChecked);
  }, [list, isAllChecked, name]);

  console.log("[SessionTodosFields.rndr]", { fields, list, allChecked });

  return (
    <Stack sx={{ ...userInputSx }}>
      {fields.map(({ id, ...fieldDefaultValues }, i) => (
        <FormControlLabel
          key={id}
          control={<CheckboxField name={`${name}.${i}.checked`} />}
          // label={label} // just defaultValue, not updated
          label={<StaticValueField name={`${name}.${i}.label`} />}
        />
      ))}
      {!withoutControls && (
        <>
          <Divider sx={{ my: 2, opacity: 0.4 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="allChecked"
                  checked={!!allChecked}
                  onChange={handleCheckAll}
                />
              }
              label={msg("sessions.edit.steps.reflect.mark-all-as-completed")}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};

export const SessionTodos = ({ actionSteps = [], withoutControls }) => {
  const msg = useMsg();
  const [allChecked, setAllChecked] = useState();
  const onCheckAll = useCallback(() => {
    setAllChecked((v) => !v);
  }, []);
  console.log({ allChecked });

  return (
    <Stack sx={{ ...userInputSx }}>
      {actionSteps.map(
        ({ id, label, date = "2023-09-06", checked = false }) => (
          <FormControlLabel
            key={id}
            control={<Checkbox defaultChecked={checked} />}
            label={label}
          />
        )
      )}
      {!withoutControls && (
        <>
          <Divider sx={{ my: 2, opacity: 0.4 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Checkbox id="allChecked" sx={{ py: 0 }} checked={allChecked} />
            <InputLabel htmlFor="allChecked" onClick={onCheckAll}>
              {msg("sessions.edit.steps.reflect.mark-all-as-completed")}
            </InputLabel>
          </Box>
        </>
      )}
    </Stack>
  );
};
