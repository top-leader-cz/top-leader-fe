import { useMutation, useQueryClient } from "react-query";
import {
  useAuth,
  useMyMutation,
  useMyQuery,
} from "../../Authorization/AuthProvider";
import { applySpec, map, pick, prop } from "ramda";

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

export const useCompaniesQuery = ({ to, ...rest } = {}) => {
  return useMyQuery({
    queryKey: ["companies"],
    fetchDef: { url: `/api/latest/companies`, to },
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
export const useAdminCreateUserMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/admin/users`,
      from: pick([
        "firstName",
        "lastName",
        "username",
        "companyId",
        "isTrial",
        "authorities",
        "timeZone",
        "locale",
      ]),
    },
    invalidate: [{ queryKey: ["admin"], exact: false }],
    ...rest,
  });
};

const creditFrom = (credit) => {
  const num = Number(credit);
  const nan = isNaN(num);
  console.log("[creditFrom]", { credit, num, nan });
  if (credit === null || nan) return null;
  return num;
};

export const useAdminEditUserMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMyMutation({
    mutationFn: async (values) =>
      authFetch({
        method: "POST",
        url: `/api/latest/admin/users/${values.username}`,
        data: (() => {
          console.log("[useAdminEditUserMutation]", { values });
          return {
            firstName: values.firstName,
            lastName: values.lastName,
            // username: values.username, // new only
            companyId: values.companyId,
            isTrial: values.isTrial,
            authorities: values.authorities,
            timeZone: values.timeZone,

            locale: values.locale,

            // TODO: mui error for conditional autocomplete
            status:
              values.status || values.isAuthorized ? "AUTHORIZED" : "PENDING",
            coach: values.coach,
            credit: creditFrom(values.credit),
          };
        })(),
      }),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        // queryKey: ["admin"], // Not working for some reason
        queryKey: ["admin", "users"],
        exact: false,
      });
      onSuccess?.(data);
    },
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
