import { pipeP } from "composable-fetch";
import { useQuery } from "react-query";
import { useAuth } from "../Authorization";
import { useMyMutation } from "../Authorization/AuthProvider";

export const useAnswersQuery = ({ onSuccess, ...params } = {}) => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["assessment"],
    queryFn: () =>
      authFetch({ url: `/api/latest/user-assessments` }).then((assessment) => {
        /* json: {"questionAnswered":1,"answers":[{"questionId":1,"answer":7}]} */
        // if (assessment.questionAnswered > 0) {
        const scores = Object.fromEntries(
          assessment.answers?.map(({ answer, questionId }) => [
            questionId,
            answer,
          ]) ?? []
        );
        return scores;
      }),
    onSuccess: (scores) => {
      console.log("[answersQuery.success]", { scores });
      onSuccess?.(scores);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...params,
  });
};
export const useDeleteAnswersMutation = (mutationParams = {}) => {
  const { authFetch } = useAuth();
  return useMyMutation({
    mutationFn: async () =>
      authFetch({
        method: "DELETE",
        url: `/api/latest/user-assessments`,
      }),
    ...mutationParams,
  });
};
export const useAnswerMutation = (mutationParams = {}) => {
  const { authFetch } = useAuth();
  return useMyMutation({
    mutationFn: async ({ questionId, answer }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-assessments/${questionId}`,
        data: { answer },
      }),
    ...mutationParams,
  });
};
export const useAnswersMutation = (mutationParams = {}) => {
  const { authFetch } = useAuth();
  return useMyMutation({
    mutationFn: async (scores) => {
      console.log("answersMutation", { scores });
      // const diff = // TODO: fetch current state, diff, modify
      const posts = Object.entries(scores).map(
        ([questionId, answer]) =>
          () =>
            authFetch({
              method: "POST",
              url: `/api/latest/user-assessments/${questionId}`,
              data: { answer },
            })
      );
      return pipeP(...posts)();
    },
    ...mutationParams,
  });
};
