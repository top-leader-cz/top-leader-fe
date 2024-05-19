import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { AutocompleteSelect } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { useMsg } from "../../components/Msg/Msg";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { useExternalTalentsOptions } from "../Strengths/talents";
import { messages } from "./messages";

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
  const options = useExternalTalentsOptions();

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
        <AutocompleteSelect
          name="0"
          rules={{ required: true }}
          placeholder={msg("assessment.external.strength.placeholder")}
          autoFocus
          size="small"
          fullWidth
          options={options}
        />
        <AutocompleteSelect
          name="1"
          rules={{ required: true }}
          placeholder={msg("assessment.external.strength.placeholder")}
          size="small"
          fullWidth
          options={options}
        />
        <AutocompleteSelect
          name="2"
          rules={{ required: true }}
          placeholder={msg("assessment.external.strength.placeholder")}
          size="small"
          fullWidth
          options={options}
        />
        <AutocompleteSelect
          name="3"
          rules={{ required: true }}
          placeholder={msg("assessment.external.strength.placeholder")}
          size="small"
          fullWidth
          options={options}
        />
        <AutocompleteSelect
          name="4"
          rules={{ required: true }}
          placeholder={msg("assessment.external.strength.placeholder")}
          size="small"
          fullWidth
          options={options}
        />

        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 3, width: "100%" }}
        >
          <Button
            {...{
              variant: "outlined",
              type: "submit",
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
