import { useCallback, useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1 } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { CreateFeedbackForm } from "./CreateFeedbackForm";
import { FIELD_DEFAULT_VALUES, ShareFeedbackModal } from "./ShareFeedbackModal";
import {
  useFeedbackOptionsQuery,
  useFeedbackQuery,
  usePostFeedbackFormMutation,
  useSaveFeedbackFormMutation,
} from "./api";
import { messages } from "./messages";
import { FEEDBACK_FIELDS } from "./constants";

const from = ({ shareFormValues, formBuilderValues, username, language }) => {
  const validTo = shareFormValues.validTo;
  const payload = {
    // id: 0,
    title: formBuilderValues.title,
    description: formBuilderValues.description,
    username,
    validTo,
    // questions: [{ key: "string", type: "PARAGRAPH", required: true }],
    questions: formBuilderValues.fields.map(
      ({ title, inputType, required }) => ({
        key: title,
        type: inputType,
        required,
      })
    ),
    // recipients: [{ id: 0, username: "string", submitted: true }],
    // recipients: shareFormValues.emailList.map(({ email, role }) => email),
    recipients: shareFormValues.emailList.map(({ email, role }) => ({
      username: email,
    })),
    locale: language?.substring(0, 2) || "en", // TODO: just 4 supported languages - BE
  };
  return payload;
};

function CreateFeedbackPageInner({ data }) {
  const isEdit = !!data;
  const { i18n } = useContext(I18nContext);
  // if (data) debugger;
  const initialValues = data
    ? {
        ...data,
        [FEEDBACK_FIELDS.fields]: data.questions.map(
          ({ key, type, required }) => ({
            title: key,
            inputType: type,
            required,
          })
        ),
        validTo: i18n.parseUTCLocal(data.validTo),
        emailList: data.recipients.length
          ? data.recipients.map(({ username, id, submitted }) => ({
              email: username,
            }))
          : [FIELD_DEFAULT_VALUES],
      }
    : undefined;

  const msg = useMsg();
  const { language } = useContext(I18nContext);
  const { authFetch, user } = useAuth();
  const [formBuilderValues, setFormBuilderValues] = useState();
  const navigate = useNavigate();

  const feedbackOptionsQuery = useFeedbackOptionsQuery();
  const saveMutation = useSaveFeedbackFormMutation({
    onSuccess: () => {
      setFormBuilderValues();
      navigate(routes.getFeedback);
    },
  });

  console.log("CreateFeedbackPageInner.rndr", { isEdit, data, initialValues });

  const handleNext = useCallback((values) => {
    console.log("[CreateFeedbackPageInner.handleNext]", { values });
    return setFormBuilderValues(values);
  }, []);
  const handleSubmit = useCallback(
    (shareFormValues) => {
      const payload = from({
        shareFormValues,
        formBuilderValues,
        language,
        username: user.data.username,
      });
      //   debugger;
      saveMutation.mutate(payload);
    },
    [formBuilderValues, user.data.username, language, saveMutation]
  );
  const error = saveMutation.error;

  return (
    <Layout>
      <Header
        text={msg("feedback.create.heading")}
        back={{ href: routes.dashboard }}
      />
      <H1 mb={4}>{msg("feedback.heading")}</H1>
      <QueryRenderer // TODO: move to FormBuilderFields
        // loaderName="ContentBackdrop" // TODO
        {...feedbackOptionsQuery}
        success={({ data }) => {
          return (
            <CreateFeedbackForm
              initialValues={initialValues}
              feedbackOptions={data}
              onShareForm={handleNext}
            />
          );
        }}
      />
      {!!formBuilderValues && ( // TODO: Modal with form reinit
        <ShareFeedbackModal
          open={!!formBuilderValues}
          onSubmit={handleSubmit}
          onClose={() => setFormBuilderValues()}
          //   link="http://topleader.io/juRcHHx7r8QTPYP"
          link=""
          error={error}
          isLoading={saveMutation.isLoading}
          initialValues={initialValues}
        />
      )}
    </Layout>
  );
}

export function CreateFeedbackPage() {
  const { id } = useParams();
  const query = useFeedbackQuery({ params: { id }, enabled: !!id });

  // console.log({ id });

  if (!id)
    return (
      <MsgProvider messages={messages}>
        <CreateFeedbackPageInner />
      </MsgProvider>
    );

  return (
    <MsgProvider messages={messages}>
      <QueryRenderer
        query={query}
        success={({ data }) => <CreateFeedbackPageInner data={data} />}
      />
    </MsgProvider>
  );
}
