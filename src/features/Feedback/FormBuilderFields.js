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
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  AutocompleteSelect,
  CheckboxField,
  getLabel,
} from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { useMsg } from "../../components/Msg/Msg";
import { Score } from "../../components/Score";
import { H2 } from "../../components/Typography";
import { FEEDBACK_FIELDS } from "./constants";
import { SUBFIELD_DEFAULT_VALUES, INPUT_TYPES, SUBFIELDS } from "./constants";
import { messages } from "./messages";
import { useFeedbackQuestionOptionsDict } from "./useFeedbackQuestionOptionsDict";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export const FEEDBACK_INPUT_TYPE_OPTIONS = [
  { value: INPUT_TYPES.TEXT, label: "Paragraph" },
  { value: INPUT_TYPES.SCALE, label: "Scale" },
];

export const InputPreview = ({ inputType, index }) => {
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

  const titleName = getName(SUBFIELDS.title);
  const title = form.watch(titleName);

  const inputTypeName = getName(SUBFIELDS.inputType);
  const inputType = form.watch(inputTypeName);

  const requiredName = getName(SUBFIELDS.required);
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
            options={FEEDBACK_INPUT_TYPE_OPTIONS}
            sx={{ maxWidth: "50%", flex: "0 1 180px" }}
          />

          <FormGroup>
            <FormControlLabel
              control={<CheckboxField name={getName(SUBFIELDS.required)} />}
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

export const FormBuilderFields = ({ name, feedbackOptions }) => {
  const msg = useMsg({ dict: messages });

  const { fields, append, remove } = useFieldArray({
    name: FEEDBACK_FIELDS.fields,
    rules: { required: true, minLength: 1 },
  });

  const { feedbackQuestionOptions } = useFeedbackQuestionOptionsDict({
    apiKeys: feedbackOptions?.options?.map(prop("key")) || [],
  });
  const missingTranslations = feedbackQuestionOptions
    ?.map(prop("missing"))
    ?.filter(Boolean);
  const tsMissing = !!missingTranslations?.length && (
    <>
      Missing translations:
      <pre>{JSON.stringify(missingTranslations, null, 2)}</pre>
    </>
  );

  return (
    <>
      {tsMissing}
      {fields.map((field, i) => (
        <ErrorBoundary key={field.id}>
          <FormBuilderField
            key={field.id}
            index={i}
            remove={remove}
            getName={(fieldName) => `${name}.${i}.${fieldName}`}
            sx={{ mt: 3 }}
            feedbackQuestionOptions={feedbackQuestionOptions}
          />
        </ErrorBoundary>
      ))}
      <Button
        onClick={() => append(SUBFIELD_DEFAULT_VALUES)}
        startIcon={<Icon name={"Add"} />}
        sx={{ my: 3 }}
      >
        {msg("feedback.create.add-question")}
      </Button>
    </>
  );
};
