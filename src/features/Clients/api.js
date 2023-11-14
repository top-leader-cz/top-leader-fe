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
        /*
        [
    {
        "username": "slavik.dan12@gmail.com",
        "firstName": "",
        "lastName": "",
        "time": "2023-10-02T09:00:00"
    },
    {
        "username": "coach1@gmail.com",
        "firstName": "",
        "lastName": "",
        "time": "2023-10-02T10:00:00"
    }
]
        */
        //  [{
        // "username": "string",
        // "firstName": "string",
        // "lastName": "string",
        // "time": "2023-09-30T17:55:22.338Z"
        // }]
        return user;
      });
    },
    ...params,
  });
};

export const useDeclineMutation = (mutationParams = {}) => {
  const { authFetch, fetchUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username }) =>
      authFetch({
        method: "DELETE",
        url: `/api/latest/coach-clients/${username}`,
      }),
    ...mutationParams,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["coach-clients"],
      }); // TODO: test
      mutationParams?.onSuccess?.(data);
    },
  });
};
