import {
  applySpec,
  concat,
  converge,
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
