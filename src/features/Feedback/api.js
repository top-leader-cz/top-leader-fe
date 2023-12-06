import { descend, evolve, map, pick, prop, sort } from "ramda";
import { useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  useAuth,
  useMyMutation,
  useMyQuery,
} from "../Authorization/AuthProvider";
import { EXTERNAL_FEEDBACK_FIELDS } from "./constants";

export const useFeedbackOptionsQuery = (rest = {}) => {
  const query = useMyQuery({
    retry: 1,
    refetchOnWindowFocus: false,
    queryKey: ["feedback", "options"],
    fetchDef: { url: `/api/public/latest/feedback/options` },
    ...rest,
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
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/public/latest/feedback/${formId}/${username}/${token}`,
      from: evolve({
        [EXTERNAL_FEEDBACK_FIELDS.answers]: map(pick(["question", "answer"])),
      }),
    },
    ...rest,
  });
  return mutation;
};

export const useRequestAccessMutation = ({
  params: { formId, username, token },
  ...rest
} = {}) => {
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/public/latest/feedback/request-access/${formId}/${username}/${token}`,
    },
    ...rest,
  });
  return mutation;
};

export const usePostFeedbackFormMutation = (rest = {}) => {
  const mutation = useMyMutation({
    fetchDef: { method: "POST", url: "/api/latest/feedback" },
    ...rest,
  });
  return mutation;
};

export const usePutFeedbackFormMutation = ({
  params: { id },
  ...rest
} = {}) => {
  const username = useAuth().user.data.username;
  const mutation = useMyMutation({
    debug: true,
    fetchDef: { method: "PUT", url: `/api/latest/feedback/${id}` },
    invalidate: [
      { queryKey: ["feedback", { username }] },
      { exact: false, queryKey: ["feedback"] },
    ],
    ...rest,
  });
  return mutation;
};

export const useSaveFeedbackFormMutation = ({ id, ...rest } = {}) => {
  const idRef = useRef(id);

  if (idRef.current) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePutFeedbackFormMutation({
      params: { id: idRef.current },
      ...rest,
    });
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePostFeedbackFormMutation(rest);
};

export const useFeedbackQuery = ({ params: { id }, ...rest } = {}) => {
  const query = useMyQuery({
    queryKey: ["feedback", id],
    fetchDef: { url: `/api/latest/feedback/${id}` },
    ...rest,
  });
  return query;
};

export const useDeleteFeedbackFormMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "DELETE",
      getUrl: ({ id }) => `/api/latest/feedback/${id}`,
    },
    invalidate: [{ exact: false, queryKey: ["feedback"] }],
    ...rest,
  });
};

export const useFeedbackFormsQuery = ({ ...rest } = {}) => {
  const username = useAuth().user.data.username;
  const query = useMyQuery({
    /* [ {
    "id": 0,
    "title": "string",
    "createdAt": "2023-11-11T20:18:53.134Z",
    "recipients": [
      {
        "id": 0,
        "username": "string",
        "submitted": true } ] } ] */
    queryKey: ["feedback", { username }],
    fetchDef: {
      url: `/api/latest/feedback/user/${username}`,
      to: sort(descend(prop("createdAt"))),
    },
    ...rest,
  });
  return query;
};

export const useFeedbackResultsQuery = ({ params: { id }, ...rest } = {}) => {
  const query = useMyQuery({
    queryKey: ["feedback", "results"],
    fetchDef: { url: `/api/latest/feedback/${id}` }, // TODO: currently same as useFeedbackQuery
    ...rest,
  });
  return query;
};
