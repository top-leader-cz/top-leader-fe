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
import { useQuery } from "react-query";
import { useAuth } from "../Authorization";
import { useMyMutation } from "../Authorization/AuthProvider";

export const useHrUsersQuery = (params = {}) => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["hr-users"],
    queryFn: () => authFetch({ url: `/api/latest/hr-users` }),
    select: (data) => {
      return data.map(
        ({
          coach,
          username,
          credit,
          paidCredit,
          requestedCredit,
          scheduledCredit,
          state,
        }) => {
          return {
            username,
            coach,
            credit,
            paidCredit,
            requestedCredit,
            scheduledCredit,
            state,
          };
        }
      );
    },
    ...params,
  });
};

const creditFrom = (credit) => {
  const num = Number(credit);
  const nan = isNaN(num);
  console.log("[creditFrom]", { credit, num, nan });
  if (credit === null || nan) return null;
  return num;
};

export const toApiLocale = pipe(prop("locale"), defaultTo("en"), take(2));

export const useUserMutation = ({ isEdit, isAdmin, ...rest } = {}) => {
  return useMyMutation({
    fetchDef: {
      ...(isEdit
        ? {
            method: "PUT",
            getUrl: pipe(prop("username"), concat(`/api/latest/user/`)),
          }
        : { method: "POST", url: `/api/latest/user` }),
      from: converge(unapply(mergeAll), [
        pick(["username", "firstName", "lastName", "authorities", "timeZone"]),
        applySpec({
          locale: toApiLocale, // just create?
          status: ifElse(
            always(isEdit),
            pipe(prop("status"), defaultTo("AUTHORIZED")),
            ifElse(prop("trialUser"), always("AUTHORIZED"), always("PENDING"))
          ),
        }),
        ifElse(
          allPass([always(isAdmin), always(isEdit)]),
          applySpec({
            // TODO: BE?
            coach: prop("coach"),
            credit: pipe(prop("credit"), creditFrom),
          }),
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

export const useCreditRequestMutation = ({ onSuccess, ...rest } = {}) => {
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
