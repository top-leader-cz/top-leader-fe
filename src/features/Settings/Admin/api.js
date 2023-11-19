import { useMutation, useQueryClient } from "react-query";
import { useAuth, useMyQuery } from "../../Authorization/AuthProvider";
import { prop } from "ramda";

export const useUsersQuery = () => {
  const { authFetch } = useAuth();
  return useMyQuery({
    queryKey: ["admin", "users"],
    queryFn: () =>
      authFetch({
        url: `/api/latest/admin/users`,
        query: {
          size: 10000,
          sort: "username,asc",
        },
      }).then(prop("content")),
  });
};

export const useAdminCreateUserMutation = ({ onSuccess, ...params } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) =>
      authFetch({
        method: "POST",
        url: `/api/latest/admin/users`,
        data: (() => {
          console.log("[useAdminCreateUserMutation]", { values });
          return {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            companyId: values.companyId,
            isTrial: values.isTrial,
            authorities: values.authorities,
            timeZone: values.timeZone,

            locale: values.locale,
          };
        })(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin"], exact: false });
      onSuccess?.(data);
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

export const useAdminEditUserMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
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

  return useMutation({
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
