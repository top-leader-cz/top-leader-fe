import { always, concat, pipe, prop } from "ramda";
import { useContext, useRef } from "react";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";

export const useClientsQuery = (rest = {}) => {
  return useMyQuery({
    queryKey: ["coach-clients"],
    fetchDef: {
      url: `/api/latest/coach-clients`,
      // to: always([ { username: null, firstName: null, lastName: null, email: null }, ]), // TODO: BE, sometimes returns nulls
    },
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
const useDeclineUserSessionMutation = ({ ...rest } = {}) => {
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

export const useAddClientMutation = ({ ...rest } = {}) => {
  /* { "email": "string", "firstName": "string", "lastName": "string", "isTrial": true } */
  const { language } = useContext(I18nContext);
  return useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/coach-clients`,
      // from: mergeRight({ locale: language.substring(0, 2) }),
    },
    invalidate: { exact: false, queryKey: ["coach-clients"] },
    ...rest,
  });
};

export const useDeclineMutation = ({ ...rest } = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "DELETE",
      getUrl: pipe(prop("username"), concat(`/api/latest/coach-clients/`)),
    },
    invalidate: { exact: false, queryKey: ["coach-clients"] },
    ...rest,
  });
};
