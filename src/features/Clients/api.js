import { concat, pipe, prop } from "ramda";
import { useRef } from "react";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";

export const useClientsQuery = (rest = {}) => {
  return useMyQuery({
    queryKey: ["coach-clients"],
    fetchDef: { url: `/api/latest/coach-clients` },
    ...rest,
  });
};

export const useUpcomingCoachSessionsQuery = (params = {}) => {
  return useMyQuery({
    queryKey: ["coach-info", "upcoming-sessions"],
    fetchDef: { url: `/api/latest/coach-info/upcoming-sessions` },
    retry: false,
    ...params,
  });
};

const gSId = (upcomingSession) => {
  const id = upcomingSession?.id || upcomingSession?.sessionId;
  const msg = `No session id provided, "id" or "sessionId" accepted on upcoming session object`;
  if (!id) throw new Error(msg);
  else return `${id}`; // concat works just on strings
};

const useDeclineCoachSessionMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "DELETE",
      getUrl: pipe(gSId, concat(`/api/latest/coach-info/upcoming-sessions/`)),
    },
    invalidate: { exact: false, queryKey: ["coach-info", "upcoming-sessions"] },
    ...rest,
  });
};
const useDeclineUserSessionMutation = ({ onSuccess, ...rest } = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "DELETE",
      getUrl: pipe(gSId, concat(`/api/latest/user-info/upcoming-sessions/`)),
    },
    invalidate: { exact: false, queryKey: ["user-info", "upcoming-sessions"] },
    ...rest,
  });
};

export const useDeclineSessionMutation = ({ type, ...rest } = {}) => {
  if (!type) throw new Error(`No type provided, valid: "coach" or "user"`);
  const typeRef = useRef(type);
  const mutation = {
    user: useDeclineUserSessionMutation,
    coach: useDeclineCoachSessionMutation,
  }[typeRef.current](rest);
  return mutation;
};

export const useAddClientMutation = ({ onSuccess, ...rest } = {}) => {
  /* { "email": "string", "firstName": "string", "lastName": "string", "isTrial": true } */
  return useMyMutation({
    fetchDef: { method: "POST", url: `/api/latest/coach-clients` },
    invalidate: { exact: false, queryKey: ["coach-clients"] },
    ...rest,
  });
};

export const useDeclineMutation = ({ onSuccess, ...rest } = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "DELETE",
      getUrl: pipe(prop("username"), concat(`/api/latest/coach-clients/`)),
    },
    invalidate: { exact: false, queryKey: ["coach-clients"] },
    ...rest,
  });
};
