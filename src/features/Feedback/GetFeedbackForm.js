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
import { prop } from "ramda";
import { useMemo } from "react";
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
import { useMsg } from "../../components/Msg/Msg";
import { Score } from "../../components/Score";
import { H2 } from "../../components/Typography";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { FormBuilderMeta } from "./FormBuilderMeta";
import { messages } from "./messages";
import { useFeedbackQuestionOptionsDict } from "./useFeedbackQuestionOptionsDict";

export const INPUT_TYPES = {
  TEXT: "PARAGRAPH",
  SCALE: "SCALE",
};
const INPUT_TYPE_OPTIONS = [
  { value: INPUT_TYPES.TEXT, label: "Paragraph" },
  { value: INPUT_TYPES.SCALE, label: "Scale" },
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
  title: "question.general.work-in-respectful-manners",
  title: "",
  inputType: INPUT_TYPES.TEXT,
  required: true,
};

const DEFAULT_VALUES = {
  title: "MM feedback",
  title: "",
  description: "",
  fields: [FIELD_DEFAULT_VALUES],
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
        disabled
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

const FormBuilderField = ({
  feedbackQuestionOptions = [],
  getName,
  index,
  remove,
  sx,
}) => {
  const form = useFormContext();

  const titleName = getName(FIELD_FIELDS.title);
  const title = form.watch(titleName);

  const inputTypeName = getName(FIELD_FIELDS.inputType);
  const inputType = form.watch(inputTypeName);

  const requiredName = getName(FIELD_FIELDS.required);
  const required = form.watch(requiredName);

  console.log("FormBuilderField.rndr", {
    feedbackQuestionOptions,
  });

  return (
    <Card sx={sx}>
      <CardContent>
        <H2>
          {index + 1}.&nbsp;{getLabel(feedbackQuestionOptions, title)}
        </H2>
        <InputPreview inputType={inputType} index={index} />
        <Divider sx={{ my: 3 }} />
        <Box display="flex" flexDirection="row" gap={3}>
          <AutocompleteSelect
            name={titleName}
            rules={{ required: "Required" }}
            options={feedbackQuestionOptions}
            sx={{ maxWidth: "50%", flex: "0 1 auto" }}
          />
          <AutocompleteSelect
            name={inputTypeName}
            rules={{ required: "Required" }}
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

const FormBuilderFields = ({ name, feedbackOptions }) => {
  const msg = useMsg({ dict: messages });
  const { feedbackQuestionOptions } = useFeedbackQuestionOptionsDict({
    apiKeys: feedbackOptions?.options?.map(prop("key")) || [],
  });
  const missingTranslations = feedbackQuestionOptions
    ?.map(prop("missing"))
    ?.filter(Boolean);

  const { fields, append, remove } = useFieldArray({
    name: FIELDS.fields,
    rules: { required: true, minLength: 1 },
  });
  console.log({ fields });
  const tsMissing = missingTranslations?.length && (
    <>
      Missing translations:
      {missingTranslations?.some?.(({ apiKey } = {}) => apiKey?.startsWith("1"))
        ? " (typo @JK)"
        : null}
      <pre>{JSON.stringify(missingTranslations, null, 2)}</pre>
    </>
  );

  return (
    <>
      {tsMissing}
      {fields.map((field, i) => (
        <FormBuilderField
          key={field.id}
          index={i}
          remove={remove}
          getName={(fieldName) => `${name}.${i}.${fieldName}`}
          sx={{ mt: 3 }}
          feedbackQuestionOptions={feedbackQuestionOptions}
        />
      ))}
      <Button
        onClick={() => append(FIELD_DEFAULT_VALUES)}
        startIcon={<Icon name={"Add"} />}
        sx={{ my: 3 }}
      >
        {msg("feedback.create.add-question")}
      </Button>
    </>
  );
};

// const onSubmit = (data, e) => console.log("[onSubmit]", data, e);
const onError = (errors, e) => console.log("[onError]", errors, e);

const collected = {
  // TODO
  count: 1,
  total: 10,
};

export const GetFeedbackForm = ({ feedbackOptions, onShareForm }) => {
  const msg = useMsg({ dict: messages });
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
            { label: msg("feedback.create.stats.questions"), value: count },
            {
              label: msg("feedback.create.stats.required"),
              value: requiredCount,
            },
          ]}
          buttonProps={{
            children: msg("feedback.create.next-btn"),
            onClick: form.handleSubmit(onShareForm, onError),
          }}
        />
      ),
      [count, form, msg, onShareForm, requiredCount]
    )
  );

  console.log("[GetFeedbackPage.rndr]", {});

  return (
    <FormProvider {...form}>
      <FormBuilderMeta />
      <Divider sx={{ my: 3 }} />
      <FormBuilderFields feedbackOptions={feedbackOptions} name="fields" />
    </FormProvider>
  );
};
