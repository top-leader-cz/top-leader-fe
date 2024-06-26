import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import { prop, remove as ramdaRemove } from "ramda";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import {
  AutocompleteSelect,
  CheckboxField,
  FreeSoloField,
  getLabel,
} from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { useMsg } from "../../components/Msg/Msg";
import { Score } from "../../components/Score";
import { H2 } from "../../components/Typography";
import {
  FEEDBACK_FIELDS,
  INPUT_TYPES,
  SUBFIELDS,
  SUBFIELD_DEFAULT_VALUES,
} from "./constants";
import { messages } from "./messages";
import { useFeedbackOptions } from "./useFeedbackQuestionOptionsDict";
import { validationMessages } from "../../components/Forms/validations";

export const FEEDBACK_INPUT_TYPE_OPTIONS = [
  { value: INPUT_TYPES.TEXT, label: "Paragraph" },
  { value: INPUT_TYPES.SCALE, label: "Scale" },
];

export const InputPreview = ({ inputType, index }) => {
  if (inputType === INPUT_TYPES.TEXT) return null;
  // return (
  //   <TextField
  //     // name={`_example_i_${index}`}
  //     placeholder={msg("feedback.external.answer-placeholder")}
  //     // rules={{ required: true }}
  //     variant="standard"
  //     // fullWidth
  //     sx={{ mt: 3, width: "50%" }}
  //     disabled
  //   />
  // );

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

const FormBuilderField = ({ getName, index, remove, otherValues, sx }) => {
  const form = useFormContext();

  const titleName = getName(SUBFIELDS.title);
  const title = form.watch(titleName);

  const inputTypeName = getName(SUBFIELDS.inputType);
  const inputType = form.watch(inputTypeName);

  const requiredName = getName(SUBFIELDS.required);
  const required = form.watch(requiredName);

  const { optionsProps } = useFeedbackOptions();
  const validationMsg = useMsg({ dict: validationMessages });
  const uniqueError =
    !!title && otherValues.includes(title)
      ? validationMsg("dict.validation.notUnique")
      : null;

  console.log("FormBuilderField.rndr", {
    index,
    optionsProps,
    titleName,
    title,
  });

  return (
    <Card sx={sx}>
      <CardContent>
        <H2>
          {index + 1}.&nbsp;{getLabel(optionsProps.options, title)}
        </H2>
        <InputPreview inputType={inputType} index={index} />
        <Divider sx={{ my: 3 }} />
        <Box display="flex" flexDirection="row" gap={3}>
          <FreeSoloField
            name={titleName}
            parametrizedValidate={[["required"], ["notBlank"]]}
            sx={{ maxWidth: "50%", flex: "0 1 auto" }}
            customError={uniqueError}
            {...optionsProps}
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

export const FormBuilderFields = ({ name }) => {
  const msg = useMsg({ dict: messages });

  const { fields, append, remove } = useFieldArray({
    name,
    rules: { required: true, minLength: 1 },
  });
  const { query, optionsProps } = useFeedbackOptions();
  const form = useFormContext();
  const titles = form.watch(name).map(({ title }) => title);
  console.log({ titles });

  const missingTranslations = optionsProps.options
    ?.map(prop("missing"))
    ?.filter(Boolean);
  const tsMissing = !!missingTranslations?.length && (
    <>
      Missing translations:
      <pre>{JSON.stringify(missingTranslations, null, 2)}</pre>
    </>
  );

  // TODO: with initial values (edit) and without this row, autocomplete is rendered without options, containing just key, not label
  if (!query.data) return null;

  return (
    <>
      {tsMissing}
      {fields.map((field, index) => (
        <ErrorBoundary key={field.id}>
          <FormBuilderField
            key={field.id}
            index={index}
            remove={remove}
            getName={(fieldName) => `${name}.${index}.${fieldName}`}
            sx={{ mt: 3 }}
            otherValues={ramdaRemove(index, 1, titles)}
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
