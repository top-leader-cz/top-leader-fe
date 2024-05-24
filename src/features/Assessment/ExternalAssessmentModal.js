import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { AutocompleteSelect } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { useMsg } from "../../components/Msg/Msg";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { useExternalTalentsOptions } from "../Strengths/talents";
import { messages } from "./messages";
import { includes, omit, pipe, values } from "ramda";
import { useMemo } from "react";

const names = [0, 1, 2, 3, 4].map((i) => i.toString());

export const ExternalAssessmentModal = ({ visible, onClose, onSubmit }) => {
  const msg = useMsg({ dict: messages });
  const form = useForm({
    defaultValues: {
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
    },
  });

  const valuesRaw = Object.fromEntries(
    names.map((name) => [name, form.watch(name)])
  );
  const valuesStr = JSON.stringify(valuesRaw);
  const valuesMemoized = useMemo(() => JSON.parse(valuesStr), [valuesStr]);

  const options = useExternalTalentsOptions();

  console.log({ valuesMemoized, valuesStr });

  return (
    <ConfirmModal
      open={!!visible}
      onClose={onClose}
      iconName="DescriptionOutlined"
      title={msg("assessment.external.title")}
      noDivider
      sx={{ width: "500px" }}
    >
      <RHForm
        form={form}
        onSubmit={onSubmit} // async
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* {mutation.error && (
          <Alert severity="error" sx={{ my: 3 }}>
            {mutation.error?.message}
          </Alert>
        )} */}
        {names.map((name) => (
          <AutocompleteSelect
            key={name}
            name={name}
            parametrizedValidate={[
              ["required"],
              // [
              //   "forbiddenValues",
              //   { forbiddenList: pipe(omit([name]), values)(valuesMemoized) },
              //   // { tsKey: "" },
              // ],
            ]}
            // validationDeps={valuesStr}
            placeholder={msg("assessment.external.strength.placeholder")}
            autoFocus
            size="small"
            fullWidth
            options={options.filter(
              ({ value }) =>
                !pipe(omit([name]), values, includes(value))(valuesMemoized)
            )}
          />
        ))}

        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 3, width: "100%" }}
        >
          <Button
            {...{
              variant: "outlined",
              children: msg("assessment.external.cancel"),
              fullWidth: true,
            }}
          />
          <Button
            {...{
              variant: "contained",
              type: "submit",
              children: msg("assessment.external.save"),
              fullWidth: true,
            }}
          />
        </Box>
      </RHForm>
    </ConfirmModal>
  );
};
