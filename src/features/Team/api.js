import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";

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

export const useCreateUserMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user`,
        data: (() => {
          console.log("[useCreateUserMutation]", { values });
          // debugger;
          return {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            authorities: values.authorities,
            locale: values.locale?.substring?.(0, 2) ?? "en",
            timeZone: values.timeZone,
            status: values.trialUser ? "AUTHORIZED" : "PENDING",
          };
        })(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hr-users"] });
      onSuccess?.(data);
    },
    ...rest,
  });
};

export const useCreditRequestMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch, fetchUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, credit }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/hr-users/${username}/credit-request`,
        data: {
          credit,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hr-users"] });
      onSuccess?.(data);
    },
    ...rest,
  });
};
