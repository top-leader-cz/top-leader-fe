import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { formatName } from "../Coaches/CoachCard";

export const useClientsQuery = ({ ...queryParams } = {}) => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["coach-clients"],
    queryFn: () => authFetch({ url: `/api/latest/coach-clients` }),
    select: (data) => {
      return data.map((user) => {
        //  {
        // "username": "slavik.dan12@gmail.com",
        // "firstName": "",
        // "lastName": "",
        // "lastSession": "2023-09-26T14:00:00",
        // "nextSession": "2023-10-02T09:00:00"
        // };
        return {
          ...user,
          name: formatName(user),
        };
      });
    },
    ...queryParams,
  });
};

export const useUpcomingCoachSessionsQuery = (params = {}) => {
  const { authFetch } = useAuth();
  return useQuery({
    retry: false,
    queryKey: ["coach-info", "upcoming-sessions"],
    queryFn: () =>
      authFetch({ url: `/api/latest/coach-info/upcoming-sessions` }),
    ...params,
  });
};

export const useDeclineSessionMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (upcomingSession) => {
      const id = upcomingSession?.id || upcomingSession?.sessionId;

      if (!id)
        throw new Error(
          `No session id provided, "id" or "sessionId" accepted on upcoming session object`
        );

      return authFetch({
        method: "DELETE",
        url: `/api/latest/user-info/upcoming-sessions/${id}`,
      });
    },
    onSuccess: (data) => {
      // TODO: also for user?
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["coach-info", "upcoming-sessions"],
      });
      onSuccess?.(data);
    },
    ...rest,
  });
};

export const useAddClientMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  /* {
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "isTrial": true } */
  return useMutation({
    mutationFn: async (data) =>
      authFetch({
        method: "POST",
        url: `/api/latest/coach-clients`,
        data,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["coach-clients"],
      });
      onSuccess?.(data);
    },
    ...rest,
  });
};

export const useDeclineMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch, fetchUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username }) =>
      authFetch({
        method: "DELETE",
        url: `/api/latest/coach-clients/${username}`,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["coach-clients"],
      });
      onSuccess?.(data);
    },
    ...rest,
  });
};
