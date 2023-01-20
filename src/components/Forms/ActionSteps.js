import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DatePicker, Input } from ".";
import { P } from "../Typography";

export const ActionSteps = ({ name, rules, control, sx = {} }) => {
  const methods = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control || methods?.control,
    name,
    rules,
  });

  return (
    // <Box component={"ol"}>
    <Box sx={{ ...sx }}>
      {fields.map((field, i) => (
        <Box
          key={field.id}
          // component={"li"}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ width: 16, mx: 1 }}>{i + 1}.</Box>
          <Input
            control={control}
            name={`${name}.${i}.label`}
            placeholder={"Label"}
            rules={{ required: true }}
            size="small"
            autoFocus
            sx={{ mx: 1, minWidth: { lg: 320 } }}
          />
          <P sx={{ ml: 4, mr: 2 }}>Due date</P>
          <DatePicker
            control={control}
            name={`${name}.${i}.date`}
            size="small"
            inputFormat="MM/dd/yyyy"
          />
          {i > 0 && (
            <IconButton
              onClick={() => remove(i)}
              sx={{
                mx: 2,
              }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}
      <Button
        onClick={() =>
          append({
            label: "",
            date: null,
          })
        }
        startIcon={<Add />}
      >
        Add action
      </Button>
    </Box>
  );
};
