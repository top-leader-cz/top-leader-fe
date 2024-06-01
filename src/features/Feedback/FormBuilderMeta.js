import { Card, CardContent, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { FEEDBACK_FIELDS } from "./constants";
import { notBlank } from "../../components/Forms/validations";
import { useMsg } from "../../components/Msg/Msg";

export const FormBuilderMeta = ({ isExistingTitle }) => {
  const msg = useMsg();

  return (
    <Card>
      <CardContent>
        <Controller
          name={FEEDBACK_FIELDS.title}
          rules={{
            required: true,
            validate: { notBlank: notBlank() },
          }}
          render={({ field, fieldState, formState }) => {
            // console.log("[FormBuilderMeta.title]", { field, fieldState });
            return (
              <TextField
                variant="standard"
                error={!!fieldState.error}
                placeholder={msg("feedback.create.title.placeholder")}
                fullWidth
                helperText={
                  isExistingTitle && msg("feedback.create.title.error.exists")
                }
                {...field}
                // sx={{ fontSize: "2rem" }}
              />
            );
          }}
        />
        <RHFTextField
          name={FEEDBACK_FIELDS.description}
          placeholder={msg("feedback.create.description.placeholder")}
          rules={{}}
          variant="standard"
          fullWidth
          sx={{ mt: 3 }}
        />
      </CardContent>
    </Card>
  );
};
