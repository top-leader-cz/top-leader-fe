import {
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

export const toApiLocale = pipe(prop("locale"), defaultTo("en"), take(2));

export const useCreateUserMutation = ({ onSuccess, ...rest } = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/user`,
      from: converge(unapply(mergeAll), [
        pick(["firstName", "lastName", "username", "authorities", "timeZone"]),
        applySpec({
          locale: toApiLocale,
          status: ifElse(
            prop("trialUser"),
            always("AUTHORIZED"),
            always("PENDING")
          ),
        }),
      ]),
    },
    invalidate: [{ queryKey: ["hr-users"] }],
    ...rest,
  });
};

export const useEditUserMutation = ({ onSuccess, ...rest } = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "PUT",
      getUrl: pipe(prop("username"), concat(`/api/latest/user/`)),
      from: converge(unapply(mergeAll), [
        pick(["firstName", "lastName", "username", "authorities", "timeZone"]),
        applySpec({
          locale: toApiLocale,
          status: ifElse(
            prop("trialUser"),
            always("AUTHORIZED"),
            always("PENDING")
          ),
        }),
      ]),
    },
    invalidate: [{ queryKey: ["hr-users"] }],
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
