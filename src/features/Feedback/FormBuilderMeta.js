import { Card, CardContent, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { Input } from "../../components/Forms";
import { FIELDS } from "./GetFeedbackForm";

export const FormBuilderMeta = ({}) => {
  return (
    <Card elevation={0}>
      <CardContent>
        <Controller
          name={FIELDS.title}
          rules={{ required: true }}
          render={({ field, fieldState, formState }) => {
            // console.log("[FormBuilderMeta.title]", { field, fieldState });
            return (
              <TextField
                variant="standard"
                error={!!fieldState.error}
                placeholder={"Title"}
                fullWidth
                // size="small"
                // helperText={fieldState.error}
                // {...props}
                {...field}
                // InputProps={{ ref: field.ref }}
              />
            );
          }}
        />
        <Input
          name={FIELDS.description}
          placeholder={"Description (optional)"}
          rules={{}}
          variant="standard"
          fullWidth
          sx={{ mt: 3 }}
        />
      </CardContent>
    </Card>
  );
};
