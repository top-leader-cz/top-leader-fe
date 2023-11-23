import { useCallback, useContext, useState } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1 } from "../../components/Typography";
import { routes } from "../../routes";
import { GetFeedbackForm } from "./GetFeedbackForm";
import { ShareFeedbackModal } from "./ShareFeedbackModal";
import { messages } from "./messages";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useMutation, useQueryClient } from "react-query";
import { I18nContext } from "../I18n/I18nProvider";
import { useNavigate } from "react-router-dom";
import { useFeedbackOptionsQuery } from "./api";

const from = ({ shareFormValues, formBuilderValues, username, language }) => {
  const validTo = shareFormValues.validTo || "2023-12-20T23:10:46.567Z"; // TODO
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

function CreateFeedbackPageInner() {
  const msg = useMsg();
  const { language } = useContext(I18nContext);
  const { authFetch, user } = useAuth();
  const [formBuilderValues, setFormBuilderValues] = useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const feedbackOptionsQuery = useFeedbackOptionsQuery();
  const postFeedbackFormMutation = useMutation({
    mutationFn: async (data) =>
      console.log("mutating", { data }) ||
      authFetch({
        method: "POST",
        url: "/api/latest/feedback",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ exact: false, queryKey: ["feedback"] });
      setFormBuilderValues();
      navigate(routes.getFeedback);
    },
  });

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
      postFeedbackFormMutation.mutate(payload);
    },
    [formBuilderValues, user.data.username, language, postFeedbackFormMutation]
  );
  const error = postFeedbackFormMutation.error;

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
            <GetFeedbackForm feedbackOptions={data} onShareForm={handleNext} />
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
          isLoading={postFeedbackFormMutation.isLoading}
        />
      )}
    </Layout>
  );
}

export function CreateFeedbackPage() {
  return (
    <MsgProvider messages={messages}>
      <CreateFeedbackPageInner />
    </MsgProvider>
  );
}
