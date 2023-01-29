import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  AutocompleteSelect,
  CheckboxField,
  getLabel,
} from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { useRightMenu } from "../../components/Layout";
import { Score } from "../../components/Score";
import { H2 } from "../../components/Typography";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { FormBuilderMeta } from "./FormBuilderMeta";
import { ShareFeedbackModal } from "./ShareFeedbackModal";

export const INPUT_TYPES = {
  TEXT: "TEXT",
  SCALE: "SCALE",
};
const INPUT_TYPE_OPTIONS = [
  { value: INPUT_TYPES.TEXT, label: "Paragraph" },
  { value: INPUT_TYPES.SCALE, label: "Scale" },
];

export const QUESTION_TITLE_OPTIONS = [
  {
    value: "$id_style_rating",
    label: "What do you consider good about my leadership style?",
  },
  {
    value: "$id_public_speak_rating",
    label: "How good am I at public speaking?",
  },
];

export const FIELDS = {
  title: "title",
  description: "description",
  fields: "fields",
};

const FIELD_FIELDS = {
  title: "title",
  inputType: "inputType",
  required: "required",
};

const FIELD_DEFAULT_VALUES = {
  title: QUESTION_TITLE_OPTIONS[0].value,
  inputType: INPUT_TYPES.TEXT,
  required: true,
};

const DEFAULT_VALUES = {
  title: "",
  description: "",
  fields: [
    FIELD_DEFAULT_VALUES,
    {
      title: QUESTION_TITLE_OPTIONS[1].value,
      inputType: INPUT_TYPES.SCALE,
      required: false,
    },
  ],
};

const InputPreview = ({ inputType, index }) => {
  if (inputType === INPUT_TYPES.TEXT)
    return (
      <TextField
        // name={`_example_i_${index}`}
        placeholder={"Type your answer here"}
        // rules={{ required: true }}
        variant="standard"
        // fullWidth
        sx={{ mt: 3, width: "50%" }}
      />
    );

  if (inputType === INPUT_TYPES.SCALE)
    return (
      <Score
        left={null}
        right={null}
        sx={{ mt: 3, justifyContent: "flex-start" }}
        value={undefined}
        onChange={({ value }) => console.log({ value })}
      />
    );

  //   throw new Error("Missing inputType:" + inputType);
};

const FormBuilderField = ({ getName, index, remove, sx }) => {
  const form = useFormContext();

  const titleName = getName(FIELD_FIELDS.title);
  const title = form.watch(titleName);

  const inputTypeName = getName(FIELD_FIELDS.inputType);
  const inputType = form.watch(inputTypeName);

  const requiredName = getName(FIELD_FIELDS.required);
  const required = form.watch(requiredName);

  return (
    <Card elevation={0} sx={sx}>
      <CardContent>
        <H2>
          {index + 1}. {getLabel(QUESTION_TITLE_OPTIONS)(title)}
        </H2>
        <InputPreview inputType={inputType} index={index} />
        <Divider sx={{ my: 3 }} />
        <Box display="flex" flexDirection="row" gap={3}>
          <AutocompleteSelect
            name={titleName}
            options={QUESTION_TITLE_OPTIONS}
            sx={{ maxWidth: "50%", flex: "0 1 auto" }}
          />
          <AutocompleteSelect
            name={inputTypeName}
            options={INPUT_TYPE_OPTIONS}
            sx={{ maxWidth: "50%", flex: "0 1 180px" }}
          />

          <FormGroup>
            <FormControlLabel
              control={<CheckboxField name={getName(FIELD_FIELDS.required)} />}
              label="Required"
            />
          </FormGroup>
          {index > 0 && (
            <IconButton onClick={() => remove(index)} sx={{}}>
              <Icon sx={{ color: "primary.main" }} name="Delete" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const FormBuilderFields = ({ name }) => {
  const { fields, append, remove } = useFieldArray({
    name: FIELDS.fields,
    rules: { required: true },
  });
  console.log({ fields });

  return (
    <>
      {fields.map((field, i) => (
        <FormBuilderField
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
        sx={{ my: 3 }}
      >
        Add question
      </Button>
    </>
  );
};

// const onSubmit = (data, e) => console.log("[onSubmit]", data, e);
const onError = (errors, e) => console.log("[onError]", errors, e);

const collected = {
  count: 1,
  total: 10,
};

export const GetFeedbackForm = ({ onShareForm }) => {
  const form = useForm({
    shouldFocusError: true, // TODO: ref not working
    defaultValues: DEFAULT_VALUES,
  });
  const fields = form.watch(FIELDS.fields);
  const count = fields?.length;
  const requiredCount = fields?.filter((field) => field.required)?.length;

  useRightMenu(
    useMemo(
      () => (
        <FeedbackRightMenu
          collected={collected}
          stats={[
            { label: "Questions", value: count },
            { label: "Required", value: requiredCount },
          ]}
          buttonProps={{
            children: "Share form",
            onClick: form.handleSubmit(onShareForm, onError),
          }}
        />
      ),
      [count, form, onShareForm, requiredCount]
    )
  );

  console.log("[GetFeedbackPage.rndr]", {});

  return (
    <FormProvider {...form}>
      <FormBuilderMeta />
      <Divider sx={{ my: 3 }} />
      <FormBuilderFields name="fields" />
    </FormProvider>
  );
};
