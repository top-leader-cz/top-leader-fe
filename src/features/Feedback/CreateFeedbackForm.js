import { Divider } from "@mui/material";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRightMenu } from "../../components/Layout";
import { useMsg } from "../../components/Msg/Msg";
import { FeedbackRightMenu } from "./FeedbackRightMenu";
import { FormBuilderFields } from "./FormBuilderFields";
import { FormBuilderMeta } from "./FormBuilderMeta";
import { DEFAULT_VALUES, FEEDBACK_FIELDS } from "./constants";
import { messages } from "./messages";
import { evolve, pipe, prop, trim } from "ramda";
import { useFeedbackFormsQuery } from "./api";

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
  const _onShareForm = useCallback(
    (values) => {
      return pipe(
        evolve({ [FEEDBACK_FIELDS.title]: trim }),
        onShareForm
      )(values);
    },
    [onShareForm]
  );
  const feedbacksQuery = useFeedbackFormsQuery();
  const currentTitle = form.watch(FEEDBACK_FIELDS.title);
  const isExistingTitle = useMemo(() => {
    if (!feedbacksQuery.data?.length) return false;
    else
      return feedbacksQuery.data
        .map(prop(FEEDBACK_FIELDS.title))
        .some((title) => title === currentTitle);
  }, [currentTitle, feedbacksQuery.data]);

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
            onClick: form.handleSubmit(_onShareForm, onError),
          }}
        />
      ),
      [collected, count, form, msg, _onShareForm, requiredCount]
    )
  );

  console.log("[CreateFeedbackForm.rndr]", { initialValues });

  return (
    <FormProvider {...form}>
      <FormBuilderMeta isExistingTitle={isExistingTitle} />
      <Divider sx={{ my: 3 }} />
      <FormBuilderFields name="fields" />
    </FormProvider>
  );
};
