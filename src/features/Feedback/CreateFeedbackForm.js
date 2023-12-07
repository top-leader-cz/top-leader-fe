import { Divider } from "@mui/material";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRightMenu } from "../../components/Layout";
import { useMsg } from "../../components/Msg/Msg";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { FormBuilderFields } from "./FormBuilderFields";
import { FormBuilderMeta } from "./FormBuilderMeta";
import { DEFAULT_VALUES, FEEDBACK_FIELDS } from "./constants";
import { messages } from "./messages";

// const onSubmit = (data, e) => console.log("[onSubmit]", data, e);
const onError = (errors, e) => console.log("[onError]", { errors, e });

export const CreateFeedbackForm = ({
  initialValues,
  onShareForm,
  collected,
}) => {
  const msg = useMsg({ dict: messages });
  const form = useForm({
    shouldFocusError: true, // TODO: ref not working
    defaultValues: initialValues || DEFAULT_VALUES,
  });
  const fields = form.watch(FEEDBACK_FIELDS.fields);
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
      [collected, count, form, msg, onShareForm, requiredCount]
    )
  );

  console.log("[CreateFeedbackForm.rndr]", { initialValues });

  return (
    <FormProvider {...form}>
      <FormBuilderMeta />
      <Divider sx={{ my: 3 }} />
      <FormBuilderFields name="fields" />
    </FormProvider>
  );
};
