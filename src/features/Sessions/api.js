import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { UTC_DATE_FORMAT } from "../I18n/utils/date";
import { format } from "date-fns";

export const useUserSessionQuery = ({ ...rest } = {}) => {
  const { authFetch } = useAuth();
  const query = useQuery({
    queryKey: ["user-sessions"],
    queryFn: () => authFetch({ url: `/api/latest/user-sessions` }),
    // be careful, following params affect form reinit
    cacheTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // {"areaOfDevelopment":[],"longTermGoal":null,"motivation":null,"actionSteps":[]}
    // onSuccess: (data) => {
    //   console.log("[onSuccess]", { data });
    //   setData(data);
    // },
    ...rest,
  });
  return query;
};

export const useUserSessionMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ actionSteps = [], ...data }) => {
      console.log("%cMUTATION", "color:lime", { actionSteps, ...data });
      return authFetch({
        method: "POST",
        url: "/api/latest/user-sessions",
        data: {
          ...data,
          actionSteps: actionSteps.map(({ label, date }) => {
            const formattedDate = format(date, UTC_DATE_FORMAT);
            console.log("mapStep", { date, formattedDate });
            return {
              label,
              date: formattedDate,
            };
          }),
        },
      });
      // .then((arg) => {
      //   debugger;
      //   return arg;
      // });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user-sessions"], ["user-info"]);
      onSuccess?.(data);
      return data;
    },
    ...rest,
  });
  return mutation;
};

export const useUserReflectionMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    /* { "reflection": "string", "newActionSteps": [ { "label": "string", "date": "2023-08-29" } ], "checked": [ 0 ] } */
    mutationFn: ({ actionSteps = [], ...data }) => {
      console.log("%cMUTATION", "color:lime", { actionSteps, ...data });
      return authFetch({
        method: "POST",
        url: "/api/latest/user-sessions-reflection",
        data: {
          ...data,
          newActionSteps: actionSteps.map(({ label, date }) => {
            const formattedDate = format(date, UTC_DATE_FORMAT);
            console.log("mapStep", { date, formattedDate });
            return {
              label,
              date: formattedDate,
            };
          }),
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user-sessions"], ["user-info"]);
      onSuccess?.(data);
      return data;
    },
    ...rest,
  });
  return mutation;
};
