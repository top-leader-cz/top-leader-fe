import { Alert, Box, Button, Card, CardContent } from "@mui/material";
import { prop } from "ramda";
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
import { I18nContext } from "../I18n/I18nProvider";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { QueryRenderer } from "../QM/QueryRenderer";
import { INPUT_TYPES } from "./GetFeedbackForm";
import {
  useExternalFeedbackMutation,
  useExternalFeedbackQuery,
  useFeedbackOptionsQuery,
  useRequestAccessMutation,
} from "./api";
import { messages } from "./messages";
import { useFeedbackQuestionOptionsDict } from "./useFeedbackQuestionOptionsDict";

export const FIELDS = {
  answers: "answers",
};

const SUBFIELDS = {
  question: "question",
  answer: "answer",
  type: "type",
  required: "required",
};

const DEFAULT_SCALE_KEYS = [
  "scale.1",
  "scale.2",
  "scale.3",
  "scale.4",
  "scale.5",
  "scale.6",
  "scale.7",
  "scale.8",
  "scale.9",
  "scale.10",
];

export const FeedbackField = ({
  name,
  inputType,
  index,
  required,
  scaleKeys = DEFAULT_SCALE_KEYS,
}) => {
  if (inputType === INPUT_TYPES.TEXT)
    return (
      <RHFTextField
        name={name}
        placeholder={"Type your answer here"}
        rules={{ required }}
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
        options={scaleKeys.map((key, i) => ({
          label: i + 1,
          // label: key,
          value: key,
        }))}
      />
    );

  throw new Error("Missing inputType:" + inputType);
};

const FeedbackFieldCard = ({
  feedbackOptions: { options = [], scales = [] } = {},
  getName,
  index,
  sx,
}) => {
  const { feedbackQuestionOptions } = useFeedbackQuestionOptionsDict({
    apiKeys: options?.map(prop("key")) || [],
  });

  const form = useFormContext();

  const question = form.watch(getName(SUBFIELDS.question));
  // const answer = form.watch(getName(SUBFIELDS.answer));
  const type = form.watch(getName(SUBFIELDS.type));
  const required = form.watch(getName(SUBFIELDS.required));

  console.log("FeedbackFieldCard.rndr", {
    feedbackQuestionOptions,
  });

  return (
    <Card sx={sx}>
      <CardContent>
        <H2>
          {index + 1}.&nbsp;{getLabel(feedbackQuestionOptions, question)}
          {required && <>&nbsp;*</>}
        </H2>
        <FeedbackField
          index={index}
          name={getName(SUBFIELDS.answer)}
          required={required}
          inputType={type}
          options={scales.map((key, i) => ({
            label: i + 1,
            value: key,
          }))}
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

const DEFAULT_FEEDBACK_OPTIONS = {
  // options: [ { key: "question.general.work-in-respectful-manners", type: "PARAGRAPH", }, ],
  scales: [
    "scale.1",
    "scale.2",
    "scale.3",
    "scale.4",
    "scale.5",
    "scale.6",
    "scale.7",
    "scale.8",
    "scale.9",
    "scale.10",
  ],
};

const ExternalFeedbackForm = ({ data, onSubmit }) => {
  const msg = useMsg();
  const feedbackOptionsQuery = useFeedbackOptionsQuery({ retry: 1 });
  const form = useForm({
    defaultValues: {
      [FIELDS.answers]: data.questions.map((question) => ({
        [SUBFIELDS.question]: question.key,
        [SUBFIELDS.type]: question.type,
        [SUBFIELDS.required]: question.required,
        [SUBFIELDS.answer]: question.type === INPUT_TYPES.TEXT ? "" : null,
      })),
    },
  });
  const { fields } = useFieldArray({
    name: FIELDS.answers,
    control: form.control,
  });

  const renderForm = ({ data: feedbackOptions }) => (
    <RHForm form={form} onSubmit={onSubmit}>
      <FeedbackMeta data={data} />
      {fields.map(({ id }, i) => (
        <FeedbackFieldCard
          key={id}
          index={i}
          feedbackOptions={feedbackOptions}
          getName={(fieldName) => `${FIELDS.answers}.${i}.${fieldName}`}
          sx={{ mt: 3 }}
        />
      ))}
      <Box sx={{ textAlign: "right" }}>
        <Button type="submit" variant="contained" sx={{ mt: 4 }}>
          {msg("feedback.external.submit")}
        </Button>
      </Box>
    </RHForm>
  );

  return (
    <QueryRenderer
      {...feedbackOptionsQuery}
      loaderName="Block"
      success={({ data }) => renderForm({ data })}
      errored={({ error }) => {
        return (
          <>
            <Alert severity="error" sx={{ my: 3 }}>
              Options fetch error, using mock. {error?.message}
            </Alert>
            {renderForm({ data: DEFAULT_FEEDBACK_OPTIONS })}
          </>
        );
      }}
    />
  );
};

const FinishedModal = ({ visible, onConfirm, onClose, data, msg }) => (
  <ConfirmModal
    open={!!visible}
    onClose={onClose}
    iconName="RocketLaunch"
    title={msg("feedback.external.finished-modal.title", {
      user: data.username,
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

const MOCK = {
  id: 0,
  title: "Mock title string123",
  description: "Mock desc string123",
  username: "mockusername@string.cz",
  validTo: "2023-11-15T21:39:52.264Z",
  questions: [
    {
      key: "mock_string1",
      type: "PARAGRAPH",
      required: true,
    },
    {
      key: "mock_string123",
      type: "PARAGRAPH",
      required: false,
    },
    {
      key: "mock_scale1",
      type: "SCALE",
      required: true,
    },
    {
      key: "mock_scale123",
      type: "SCALE",
      required: false,
    },
  ],
  recipients: [
    {
      id: 0,
      username: "mock_string",
      submitted: true,
    },
  ],
};

const ExternalFeedbackPageInner = () => {
  const msg = useMsg();
  const { formId, username, token } = useParams();

  const [finishedModalVisible, setFinishedModalVisible] = useState();
  const [requestAccessModalVisible, setRequestAccessModalVisible] = useState();

  const enabled = !!formId && !!username && !!token;
  // const enabled = false;
  const externalFeedbackQuery = useExternalFeedbackQuery({
    params: { formId, username, token },
    enabled,
  });
  const mutation = useExternalFeedbackMutation({
    params: { formId, username, token },
    onSuccess: () => {
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
                <ExternalFeedbackForm data={data} onSubmit={onSubmit} />
                {
                  <FinishedModal
                    visible={finishedModalVisible}
                    onConfirm={() => {
                      setFinishedModalVisible();
                      setRequestAccessModalVisible(true);
                    }}
                    msg={msg}
                    onClose={() => setFinishedModalVisible()}
                    data={data}
                  />
                }
                <RequestAccessModal
                  data={data}
                  params={{ formId, username, token }}
                  visible={requestAccessModalVisible}
                  onClose={() => setRequestAccessModalVisible()}
                />
              </>
            );
          }}
          errored={({ error }) => {
            return (
              <>
                <Alert severity="error" sx={{ my: 3 }}>
                  Fetch error, displaying mock. {error?.message}
                </Alert>
                <ExternalFeedbackForm data={MOCK} onSubmit={onSubmit} />;
                {
                  <FinishedModal
                    visible={finishedModalVisible}
                    onConfirm={() => {
                      setFinishedModalVisible();
                      setRequestAccessModalVisible(true);
                    }}
                    msg={msg}
                    onClose={() => setFinishedModalVisible()}
                    data={MOCK}
                  />
                }
                <RequestAccessModal
                  data={MOCK}
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
