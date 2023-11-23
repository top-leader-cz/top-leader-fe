import { useMutation, useQuery } from "react-query";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { evolve, map, pick } from "ramda";
import { EXTERNAL_FEEDBACK_FIELDS } from "./constants";

export const useFeedbackOptionsQuery = (params = {}) => {
  const query = useMyQuery({
    retry: 1,
    refetchOnWindowFocus: false,
    queryKey: ["feedback", "options"],
    fetchDef: { url: `/api/public/latest/feedback/options`, isPublicApi: true },
    ...params,
  });
  return query;
};

export const useExternalFeedbackQuery = ({
  params: { formId, username, token },
  ...rest
} = {}) => {
  const { authFetch } = useAuth();
  const externalFeedbackQuery = useQuery({
    retry: 1,
    refetchOnWindowFocus: false,
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
    ...rest,
  });

  return externalFeedbackQuery;
};

export const useExternalFeedbackMutation = ({
  params: { formId, username, token },
  ...rest
} = {}) => {
  const { authFetch } = useAuth();
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
            [EXTERNAL_FEEDBACK_FIELDS.answers]: map(
              pick(["question", "answer"])
            ),
          })(data);
        })(),
      }),
    ...rest,
  });
  return mutation;
};

export const useRequestAccessMutation = ({
  params: { formId, username, token },
  ...rest
} = {}) => {
  const { authFetch } = useAuth();
  const mutation = useMutation({
    mutationFn: async (data) =>
      console.log("mutating", { data }) ||
      authFetch({
        isPublicApi: true,
        method: "POST",
        url: `/api/public/latest/feedback/request-access/${formId}/${username}/${token}`,
        data,
      }),
    ...rest,
  });
  return mutation;
};
