import { Alert, Box, Button, Card, CardContent } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { RHFTextField, ScoreField, getLabel } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Header } from "../../components/Header";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { gray200 } from "../../theme";
import { formatName } from "../Coaches/CoachCard";
import { I18nContext } from "../I18n/I18nProvider";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { QueryRenderer } from "../QM/QueryRenderer";
import {
  useExternalFeedbackMutation,
  useExternalFeedbackQuery,
  useRequestAccessMutation,
} from "./api";
import { EXTERNAL_FEEDBACK_FIELDS, INPUT_TYPES } from "./constants";
import { messages } from "./messages";
import { useFeedbackOptions } from "./useFeedbackQuestionOptionsDict";
import { notBlank } from "../../components/Forms/validations";

const SUBFIELDS = {
  question: "question",
  answer: "answer",
  type: "type",
  required: "required",
};

export const FeedbackField = ({ index, name, required, inputType, scales }) => {
  const msg = useMsg();
  if (inputType === INPUT_TYPES.TEXT)
    return (
      <RHFTextField
        name={name}
        placeholder={msg("feedback.external.answer-placeholder")}
        rules={{ required, validate: { notBlank: notBlank() } }}
        variant="standard"
        // fullWidth
        sx={{ mt: 3, width: "50%" }}
      />
    );

  if (inputType === INPUT_TYPES.SCALE)
    return (
      <ScoreField
        name={name}
        rules={{ required }}
        left={null}
        right={null}
        sx={{ mt: 3, justifyContent: "flex-start" }}
        options={scales.map((key, i) => ({
          label: i + 1,
          value: key,
        }))}
      />
    );

  throw new Error("Missing inputType:" + inputType);
};

const FeedbackFieldCard = ({ getName, index, sx }) => {
  const { query, optionsProps } = useFeedbackOptions();
  const form = useFormContext();

  const question = form.watch(getName(SUBFIELDS.question));
  // const answer = form.watch(getName(SUBFIELDS.answer));
  const type = form.watch(getName(SUBFIELDS.type));
  const required = form.watch(getName(SUBFIELDS.required));

  console.log("FeedbackFieldCard.rndr", {
    optionsProps,
  });

  return (
    <Card sx={sx}>
      <CardContent>
        <H2>
          {index + 1}.&nbsp;{getLabel(optionsProps.options, question)}
          {required && <>&nbsp;*</>}
        </H2>
        <QueryRenderer
          query={query}
          success={({ data }) => (
            <FeedbackField
              index={index}
              name={getName(SUBFIELDS.answer)}
              required={required}
              inputType={type}
              scales={data.scales}
            />
          )}
        />
      </CardContent>
    </Card>
  );
};

const FeedbackMeta = ({ data, sx = {} }) => {
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);

  return (
    <Card sx={{ ...sx, bgcolor: "primary.main" }}>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "row", mb: 3 }}>
          <H2 sx={{ color: "white", fontSize: 24 }}>
            {data.title}
            {/* {msg("feedback.external.title", { name: data.username })} */}
          </H2>
          <Button
            variant="contained"
            sx={{
              ml: "auto",
              bgcolor: "white",
              color: "primary.main",
              pointerEvents: "none",
            }}
          >
            {msg("feedback.external.deadline", {
              date: i18n.formatLocalMaybe(
                i18n.parseUTCLocal(data.validTo),
                "Pp"
              ),
            })}
          </Button>
        </Box>
        <P sx={{ color: gray200 }}>{data.description}</P>
      </CardContent>
    </Card>
  );
};

const ExternalFeedbackForm = ({ data, submitDisabled, onSubmit }) => {
  const msg = useMsg();
  const form = useForm({
    defaultValues: {
      [EXTERNAL_FEEDBACK_FIELDS.answers]: data.questions.map((question) => ({
        [SUBFIELDS.question]: question.key,
        [SUBFIELDS.type]: question.type,
        [SUBFIELDS.required]: question.required,
        [SUBFIELDS.answer]: question.type === INPUT_TYPES.TEXT ? "" : null,
      })),
    },
  });
  const { fields } = useFieldArray({
    name: EXTERNAL_FEEDBACK_FIELDS.answers,
    control: form.control,
  });

  return (
    <RHForm form={form} onSubmit={onSubmit}>
      <FeedbackMeta data={data} />
      {fields.map(({ id }, i) => (
        <FeedbackFieldCard
          key={id}
          index={i}
          getName={(fieldName) =>
            `${EXTERNAL_FEEDBACK_FIELDS.answers}.${i}.${fieldName}`
          }
          sx={{ mt: 3 }}
        />
      ))}
      <Box sx={{ textAlign: "right" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={submitDisabled}
          sx={{ mt: 4 }}
        >
          {msg("feedback.external.submit")}
        </Button>
      </Box>
    </RHForm>
  );
};

const FinishedModal = ({ visible, onConfirm, onClose, feedback, msg }) =>
  console.log("EFP.r", { feedback }) || (
    <ConfirmModal
      open={!!visible}
      onClose={onClose}
      iconName="RocketLaunch"
      title={msg("feedback.external.finished-modal.title", {
        user: formatName(feedback || {}) || feedback.username,
      })}
      desc={msg("feedback.external.finished-modal.desc")}
      buttons={[
        {
          variant: "outlined",
          type: "button",
          children: msg("feedback.external.finished-modal.request-access.no"),
          onClick: onClose,
        },
        {
          variant: "contained",
          type: "button",
          children: msg("feedback.external.finished-modal.request-access.yes"),
          onClick: onConfirm,
        },
      ]}
      sx={{ width: "500px" }}
    />
  );

const RequestAccessModal = ({ visible, onClose, params }) => {
  const msg = useMsg();
  const form = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      hrEmail: "",
    },
  });
  const mutation = useRequestAccessMutation({ params, onSuccess: onClose });

  return (
    <ConfirmModal
      open={!!visible}
      onClose={onClose}
      iconName="Login"
      title={{
        children: msg("feedback.external.request-access-modal.title"),
        props: { textAlign: "center" },
      }}
      desc={{
        children: msg("feedback.external.request-access-modal.desc"),
        props: { textAlign: "center" },
      }}
      noDivider
      sx={{ width: "400px" }}
    >
      <RHForm
        form={form}
        onSubmit={mutation.mutateAsync}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {mutation.error && (
          <Alert severity="error" sx={{ my: 3 }}>
            {mutation.error?.message}
          </Alert>
        )}
        <RHFTextField
          name="firstName"
          rules={{ required: true, minLength: 2 }}
          label={msg("feedback.external.request-access-modal.fields.firstName")}
          autoFocus
          size="small"
          fullWidth
        />
        <RHFTextField
          name="lastName"
          rules={{ required: true, minLength: 2 }}
          label={msg("feedback.external.request-access-modal.fields.lastName")}
          autoFocus
          size="small"
          fullWidth
        />
        <RHFTextField
          name="email"
          rules={{ required: true, minLength: 5 }}
          label={msg("feedback.external.request-access-modal.fields.email")}
          autoFocus
          size="small"
          fullWidth
        />
        <RHFTextField
          name="company"
          // rules={{}}
          label={msg("feedback.external.request-access-modal.fields.company")}
          autoFocus
          size="small"
          fullWidth
        />
        <RHFTextField
          name="hrEmail"
          // rules={{}}
          label={msg("feedback.external.request-access-modal.fields.hrEmail")}
          autoFocus
          size="small"
          fullWidth
        />
        <Button
          {...{
            variant: "contained",
            type: "submit",
            children: msg("feedback.external.request-access-modal.request"),
          }}
        />
      </RHForm>
    </ConfirmModal>
  );
};

const ExternalFeedbackPageInner = () => {
  const msg = useMsg();
  const { formId, username, token } = useParams();
  // const navigate = useNavigate();

  const [finishedModalVisible, setFinishedModalVisible] = useState();
  const [submitted, setSubmitted] = useState();
  const [requestAccessModalVisible, setRequestAccessModalVisible] = useState();

  const enabled = !!formId && !!username && !!token;
  const externalFeedbackQuery = useExternalFeedbackQuery({
    params: { formId, username, token },
    enabled,
  });
  const mutation = useExternalFeedbackMutation({
    params: { formId, username, token },
    onSuccess: () => {
      setSubmitted(true);
      setFinishedModalVisible(true);
    },
  });

  const onSubmit = useCallback(
    (values) => mutation.mutateAsync(values),
    [mutation]
  );

  console.log("[ExternalFeedbackPageInner.rndr]", {
    params: { formId, username, token },
    externalFeedbackQuery,
    mutation,
    submitted,
  });

  return (
    <Box sx={{ px: 3 }}>
      {mutation.error && (
        <Alert severity="error" sx={{ my: 3 }}>
          {mutation.error?.message}
        </Alert>
      )}
      <Header text={msg("feedback.external.heading")} />
      {!enabled ? (
        <div>Oops! Incomplete url.</div>
      ) : (
        <QueryRenderer
          {...externalFeedbackQuery}
          loaderName="Block"
          success={({ data }) => {
            return (
              <>
                <ExternalFeedbackForm
                  data={data}
                  onSubmit={onSubmit}
                  submitDisabled={submitted || mutation.isLoading}
                />
                <FinishedModal
                  visible={finishedModalVisible}
                  onConfirm={() => {
                    setFinishedModalVisible();
                    setRequestAccessModalVisible(true);
                  }}
                  msg={msg}
                  onClose={() => setFinishedModalVisible()}
                  feedback={data}
                />
                <RequestAccessModal
                  params={{ formId, username, token }}
                  visible={requestAccessModalVisible}
                  onClose={() => setRequestAccessModalVisible()}
                />
              </>
            );
          }}
        />
      )}
    </Box>
  );
};

export function ExternalFeedbackPage() {
  return (
    <MsgProvider messages={messages}>
      <ExternalFeedbackPageInner />
    </MsgProvider>
  );
}
