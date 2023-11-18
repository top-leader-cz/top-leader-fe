import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../Authorization/AuthProvider";

export const useAdminCreateUserMutation = ({ onSuccess, ...params } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) =>
      authFetch({
        method: "POST",
        url: `/api/latest/admin/users`,
        data: (() => {
          /*
          {
  "username": "string",
  "firstName": "string",
  "lastName": "string",

  "timeZone": "string",
  "companyId": 0,
  "isTrial": true,
  "authorities": [ "USER" ]
}
          */
          console.log("[useAdminCreateUserMutation]", { values });
          return {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,

            companyId: values.companyId,
            isTrial: values.isTrial,

            authorities: values.authorities,
            timeZone: values.timeZone,
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
export const useAdminEditUserMutation = ({ onSuccess, ...params } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) =>
      authFetch({
        method: "POST",
        url: `/api/latest/admin/users/${values.username}`,
        data: (() => {
          /*
          {
  "firstName": "string",
  "lastName": "string",

  "timeZone": "string",
  "companyId": 0,
  "isTrial": true,
  "authorities": [
    "USER"
  ],

  "status": "AUTHORIZED",
  "coach": "string",
  "credit": 0
}
          */
          console.log("[useAdminEditUserMutation]", { values });
          return {
            firstName: values.firstName,
            lastName: values.lastName,
            // username: values.username, // new only

            companyId: values.companyId,
            isTrial: values.isTrial,

            authorities: values.authorities,
            timeZone: values.timeZone,

            // TODO: mui error for conditional autocomplete
            status:
              values.status || values.isAuthorized ? "AUTHORIZED" : "PENDING",
            // coach: ""
            // credit: 0
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
