import {
  allPass,
  always,
  applySpec,
  concat,
  converge,
  defaultTo,
  ifElse,
  mergeAll,
  pick,
  pipe,
  prop,
  take,
  unapply,
} from "ramda";
import {
  useAuth,
  useMyMutation,
  useMyQuery,
} from "../Authorization/AuthProvider";

export const useHrUsersQuery = (params = {}) => {
  return useMyQuery({
    queryKey: ["hr-users"],
    fetchDef: {
      url: `/api/latest/hr-users`,
      // to: pick([ "coach", "username", "credit", "paidCredit", "requestedCredit", "scheduledCredit", "state" ]),
    },
    ...params,
  });
};

export const useHrUserQuery = ({ username, enabled, initialData }) => {
  return useMyQuery({
    queryKey: ["hr-users", username],
    fetchDef: {
      url: `/api/latest/hr-users/${username}`,
    },
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
    initialData,
  });
};

export const useManagersQuery = () => {
  return useMyQuery({
    queryKey: ["hr-users", "managers"],
    fetchDef: {
      url: "/api/latest/hr-users/managers",
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const creditFrom = (credit) => {
  const num = Number(credit);
  const nan = isNaN(num);
  console.log("[creditFrom]", { credit, num, nan });
  if (credit === null || nan) return null;
  return num;
};

export const toApiLocale = pipe(prop("locale"), defaultTo("en"), take(2));

export const useHRUserMutation = ({ isEdit, ...rest } = {}) => {
  const { isHR, isAdmin } = useAuth();

  return useMyMutation({
    fetchDef: {
      ...(isEdit
        ? {
            method: "PUT",
            getUrl: pipe(prop("username"), concat(`/api/latest/hr-users/`)),
          }
        : { method: "POST", url: `/api/latest/hr-users` }),
      from: converge(unapply(mergeAll), [
        pick(isEdit ? [] : ["username"]),
        pick(["firstName", "lastName", "authorities", "timeZone"]),
        applySpec({
          locale: toApiLocale, // just create?
          status: ifElse(
            always(isEdit),
            pipe(prop("status"), defaultTo("AUTHORIZED")),
            ifElse(prop("trialUser"), always("AUTHORIZED"), always("PENDING"))
          ),
        }),
        ifElse(
          always(isHR || isAdmin),
          pick(["isManager", "manager", "position", "aspiredCompetency"]),
          always({})
        ),
      ]),
    },
    invalidate: [
      { queryKey: ["hr-users"] },
      { queryKey: ["admin"], exact: false },
    ],
    ...rest,
  });
};

export const useCreditRequestMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "POST",
      getUrl: pipe(
        prop("username"),
        (username) => `/api/latest/hr-users/${username}/credit-request`
      ),
      from: pick(["credit"]),
    },
    invalidate: [{ queryKey: ["hr-users"] }],
    ...rest,
  });
};
