import {
  always,
  applySpec,
  concat,
  converge,
  ifElse,
  map,
  mergeAll,
  pick,
  pipe,
  prop,
  unapply,
} from "ramda";
import { useQueryClient } from "react-query";
import {
  useAuth,
  useMyMutation,
  useMyQuery,
} from "../../Authorization/AuthProvider";
import { creditFrom, toApiLocale } from "../../Team/api";

export const useUsersQuery = () => {
  return useMyQuery({
    queryKey: ["admin", "users"],
    fetchDef: {
      url: `/api/latest/admin/users`,
      query: {
        size: 10000,
        sort: "username,asc",
      },
      to: prop("content"),
    },
  });
};

export const useCompaniesQuery = (rest = {}) => {
  return useMyQuery({
    queryKey: ["companies"],
    fetchDef: { url: `/api/latest/companies` },
    ...rest,
  });
};
useCompaniesQuery.toOpts = map(
  applySpec({ value: prop("id"), label: prop("name") })
);

export const useCompanyMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/companies`,
      from: pick(["name"]),
    },
    invalidate: [{ queryKey: ["companies"] }],
    ...rest,
  });
};

export const useAdminDeleteUserMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "DELETE",
      getUrl: ({ username }) => `/api/latest/admin/users/${username}`,
    },
    invalidate: [{ queryKey: ["admin", "users"] }],
    ...rest,
  });
};

export const useConfirmRequestedCreditMutation = ({
  onSuccess,
  ...params
} = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMyMutation({
    mutationFn: async ({ username }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/admin/users/${username}/confirm-requested-credits`,
        data: {},
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin"], exact: false });
      onSuccess?.(data);
    },
    ...params,
  });
};

export const useAdminUserMutation = ({ isEdit, ...rest } = {}) => {
  return useMyMutation({
    debug: true,
    fetchDef: {
      method: "POST",
      getUrl: isEdit
        ? pipe(prop("username"), concat(`/api/latest/admin/users/`))
        : always(`/api/latest/admin/users`),
      from: converge(unapply(mergeAll), [
        pick([
          "username",
          "firstName",
          "lastName",
          "authorities",
          "timeZone",
          "companyId",
          "status",
        ]),
        applySpec({
          locale: toApiLocale,
          isTrial: ({ status }) => (status === "PENDING" ? false : true),
        }),
        ifElse(
          always(isEdit),
          applySpec({
            coach: prop("coach"),
            credit: pipe(prop("credit"), creditFrom),
            // freeCoach, // TODO?
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
