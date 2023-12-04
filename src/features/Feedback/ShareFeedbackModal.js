import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  OutlinedInput,
  Paper,
} from "@mui/material";
import { useCallback } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { DatePickerField, RHFTextField } from "../../components/Forms";
import { invalidDate, todayOrFuture } from "../../components/Forms/validations";
import { Icon } from "../../components/Icon";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { messages } from "./messages";

export const SHARE_FIELDS = {
  validTo: "validTo",
  emailList: "emailList",
};

const FIELD_FIELDS = {
  email: "email",
  // role: "role",
};

export const FIELD_DEFAULT_VALUES = {
  // email: "email1@gmail.com",
  email: "",
  // role: null,
};

// const ROLE_OPTIONS = [{ value: "manager", label: "Manager" }];

const EmailListItem = ({ index, remove, getName }) => {
  return (
    <Box display="flex" alignItems="center" gap={3}>
      <RHFTextField
        name={getName(FIELD_FIELDS.email)}
        placeholder="Email"
        rules={{ required: "Required" }}
        size="small"
        sx={{ flexGrow: 2 }}
      />
      {/* <AutocompleteSelect
        name={getName(FIELD_FIELDS.role)}
        placeholder="Role"
        options={ROLE_OPTIONS}
        sx={{ width: "50%" }}
      /> */}

      {index > 0 && (
        <IconButton
          onClick={() => remove(index)}
          sx={{
            // mx: 2,
            width: "40px",
            visibility: index > 0 ? "visible" : "hidden",
            color: "error.main",
          }}
        >
          <Icon name="DeleteOutlined" />
        </IconButton>
      )}
    </Box>
  );
};

const EmailList = ({ name, addLabel }) => {
  const { fields, append, remove } = useFieldArray({
    name,
    rules: { required: true },
  });
  console.log({ fields });

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {fields.map((field, i) => (
        <EmailListItem
          key={field.id}
          index={i}
          remove={remove}
          getName={(fieldName) => `${name}.${i}.${fieldName}`}
          sx={{ mt: 3 }}
        />
      ))}
      <Button
        onClick={() => append(FIELD_DEFAULT_VALUES)}
        startIcon={<Icon name={"Add"} />}
        sx={{ alignSelf: "flex-start" }}
      >
        {addLabel}
      </Button>
    </Box>
  );
};

// TODO: Form reset?
export const ShareFeedbackModal = ({
  open,
  onSubmit,
  onClose,
  link,
  error,
  isLoading,
  initialValues,
}) => {
  const msg = useMsg({ dict: messages });
  const form = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    // defaultValues: {
    //   [SHARE_FIELDS.validTo]: initialValues?.validTo ?? null,
    //   [SHARE_FIELDS.emailList]: initialValues?.emailList?.length
    //     ? initialValues?.emailList
    //     : [FIELD_DEFAULT_VALUES],
    // },
    defaultValues: initialValues || {
      [SHARE_FIELDS.validTo]: null,
      [SHARE_FIELDS.emailList]: [FIELD_DEFAULT_VALUES],
    },
  });

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(link).then(
      () => {
        console.log("Copy success", { link });
      },
      () => {
        console.log("Copy error", { link });
      }
    );
  }, [link]);

  return (
    <FormProvider {...form}>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", md: "800px" },
              bgcolor: "background.paper",
              borderRadius: "6px",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              // border: "2px solid #000",
              // boxShadow: 24,
            }}
          >
            <FormProvider {...form}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
                  <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
                    <Icon name="PersonAdd" sx={{ color: "#667085" }} />
                  </Avatar>
                </Avatar>
                <IconButton onClick={onClose}>
                  <Icon name="Close" sx={{ color: "#667085" }} />
                </IconButton>
              </Box>
              <H2 id="modal-modal-title">
                {msg("feedback.create.share-modal.title")}
              </H2>
              <P id="modal-modal-description">
                {msg("feedback.create.share-modal.desc")}
              </P>
              {error && <Alert severity="error">{error.message}</Alert>}
              <Box
                display="flex"
                flexDirection="row"
                alignItems="baseline"
                gap={3}
              >
                {/* <TextField */}
                <OutlinedInput
                  name="link"
                  value={link}
                  label=""
                  disabled
                  size="small"
                  placeholder="Not available yet"
                  sx={{ flexGrow: 2 }}
                  endAdornment={
                    <InputAdornment position="end">
                      {/* <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton> */}
                      <IconButton
                        onClick={onCopy}
                        disabled={!link}
                        sx={{ mr: -1 }}
                      >
                        <Icon name="ContentCopy" />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <P sx={{ color: "black" }}>
                  {msg("feedback.create.share-modal.deadline")}
                </P>
                <DatePickerField
                  name={SHARE_FIELDS.validTo}
                  rules={{
                    required: "Required",
                    validate: { invalidDate, todayOrFuture },
                  }}
                  disablePast
                  clearable
                />
              </Box>
              <Divider flexItem />
              <EmailList
                name={SHARE_FIELDS.emailList}
                addLabel={msg("feedback.create.share-modal.add-email")}
              />
              <Divider flexItem />
              <Box display="flex" flexDirection="row" gap={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onClose()}
                  disabled={isLoading}
                >
                  {msg("feedback.create.share-modal.cancel")}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                >
                  {msg("feedback.create.share-modal.share")}
                </Button>
              </Box>
            </FormProvider>
          </Paper>
        </form>
      </Modal>
    </FormProvider>
  );
};
