import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";

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
          name: `${user?.firstName} ${user?.lastName}`,
          username: user.username,
          lastSession: user.lastSession,
          nextSession: user.nextSession,
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
    select: (data) => {
      return data.map((user) => {
        /* [ {
        "username": "slavik.dan12@gmail.com",
        "firstName": "",
        "lastName": "",
        "time": "2023-10-02T09:00:00"
        } ] */
        return user;
      });
    },
    ...params,
  });
};

export const useDeclineSessionMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (upcomingSession) => {
      const id = upcomingSession?.id || upcomingSession?.sessionId;

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
