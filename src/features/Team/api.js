import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";

export const useHrUsersQuery = (params = {}) => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["hr-users"],
    queryFn: () => authFetch({ url: `/api/latest/hr-users` }),
    select: (data) => {
      return data.map((user) => {
        //  {
        //   username: "string",
        //   coach: "string",
        //   credit: 0,
        //   requestedCredit: 0,
        //   state: "AUTHORIZED",
        // };
        return {
          name: user.username, // TODO
          username: user.username,
          coach: user.coach,
          creditPaid: user.requestedCredit,
          creditRemaining: user.credit,
        };
      });
    },
    ...params,
  });
};

export const useCreateUserMutation = ({ onSuccess, ...params } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user`,
        data: (() => {
          console.log("[useCreateUserMutation]", { values });
          return {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            authorities: values.authorities,
            locale: values.locale?.substring?.(0, 2) ?? "en",
            timeZone: values.timeZone,
            status: values.isAuthorized ? "AUTHORIZED" : "PENDING",
          };
        })(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hr-users"] });
      onSuccess?.(data);
    },
    ...params,
  });
};

export const useCreditRequestMutation = (params = {}) => {
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
      params?.onSuccess?.(data);
    },
    ...params,
  });
};
