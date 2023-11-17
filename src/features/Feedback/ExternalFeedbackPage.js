import { Alert, Box, Button, Card, CardContent } from "@mui/material";
import { evolve, map, pick, prop } from "ramda";
import { useCallback, useContext } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { RHFTextField, ScoreField, getLabel } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Header } from "../../components/Header";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { gray200 } from "../../theme";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { INPUT_TYPES } from "./GetFeedbackForm";
import { messages } from "./messages";
import { useFeedbackQuestionOptionsDict } from "./useFeedbackQuestionOptionsDict";

const FIELDS = {
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
        {/* <Divider sx={{ my: 3 }} />
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
              control={<CheckboxField name={getName(SUBFIELDS.required)} />}
              label="Required"
            />
          </FormGroup>
        </Box> */}
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
  const feedbackOptionsQuery = useMyQuery({
    retry: 1,
    queryKey: ["feedback", "options"],
    fetchDef: { url: `/api/latest/feedback/options` }, // TODO: 401
    queryFn: async () => DEFAULT_FEEDBACK_OPTIONS,
  });
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

  return (
    <QueryRenderer
      {...feedbackOptionsQuery}
      success={({ data: feedbackOptions }) => (
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
      )}
    />
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
  const { authFetch } = useAuth();
  const { formId, username, token } = useParams();
  // const enabled = !!formId && !!username && !!token;
  const enabled = true;
  const queryClient = useQueryClient();
  const externalFeedbackQuery = useQuery({
    retry: 1,
    refetchOnWindowFocus: false,
    enabled,
    queryKey: ["feedback", "external"],
    queryFn: async () => {
      try {
        const res = await authFetch({
          isPublicApi: true,
          url: `/api/public/latest/feedback/${formId}/${username}/${token}`,
        });
        // debugger;
        return res;
      } catch (e) {
        console.log("[ExternalFeedbackPageInner.catch]", { e });
        // debugger;
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        throw e;
      }
    },
  });
  const mutation = useMutation({
    mutationFn: async (data) =>
      console.log("mutating", { data }) ||
      authFetch({
        isPublicApi: true,
        method: "POST",
        url: `/api/public/latest/feedback/${formId}/${username}/${token}`,
        data: (() => {
          // debugger;
          return evolve({
            [FIELDS.answers]: map(pick(["question", "answer"])),
          })(data);
        })(),
      }),
    onSuccess: () => {
      // TODO: Request access
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
          {" "}
          {mutation.error?.message}{" "}
        </Alert>
      )}
      <Header text={msg("feedback.external.heading")} />
      {/* {enabled ? ( */}
      <QueryRenderer
        {...externalFeedbackQuery}
        loaderName="Block"
        success={({ data }) => {
          return <ExternalFeedbackForm data={data} onSubmit={onSubmit} />;
          return <pre>{JSON.stringify(data, null, 2)}</pre>;
        }}
        errored={({ error }) => {
          return (
            <>
              <Alert severity="error" sx={{ my: 3 }}>
                Fetch error, displaying mock. {error?.message}
              </Alert>
              <ExternalFeedbackForm data={MOCK} onSubmit={onSubmit} />;
            </>
          );
        }}
      />
      {/* ) : (
        <div>Oops! Incomplete url.</div>
      )} */}
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
