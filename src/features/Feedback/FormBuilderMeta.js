import { Card, CardContent, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { FEEDBACK_FIELDS } from "./constants";
import { notBlank } from "../../components/Forms/validations";

export const FormBuilderMeta = ({}) => {
  return (
    <Card>
      <CardContent>
        <Controller
          name={FEEDBACK_FIELDS.title}
          rules={{
            required: true,
            validate: { notBlank: notBlank(0) },
          }}
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
        <RHFTextField
          name={FEEDBACK_FIELDS.description}
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
