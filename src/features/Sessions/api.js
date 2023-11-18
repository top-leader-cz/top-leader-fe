import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { UTC_DATE_FORMAT } from "../I18n/utils/date";
import { format } from "date-fns";
import { useContext } from "react";
import { I18nContext } from "../I18n/I18nProvider";

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
  const { i18n } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ actionSteps = [], ...data }) => {
      console.log("%cMUTATION", "color:lime", { actionSteps, ...data });

      const promise = authFetch({
        method: "POST",
        url: "/api/latest/user-sessions",
        data: {
          ...data,
          actionSteps: actionSteps.map(({ label, date }) => {
            try {
              const formattedDate = i18n.formatLocalMaybe(
                date,
                UTC_DATE_FORMAT
              );
              console.log("mapStep", { date, formattedDate });
              return {
                label,
                date: formattedDate,
              };
            } catch (e) {
              console.error("mutation err", { e });
              throw e;
            }
          }),
        },
      });
      // .then((arg) => {
      //   debugger;
      //   return arg;
      // });
      console.log("mutation", { promise });
      return promise;
    },
    onSuccess: (data) => {
      console.log("mutation onSuccess", { data });
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      onSuccess?.(data);
      return data;
    },
    ...rest,
  });
  return mutation;
};

export const useUserReflectionMutation = ({ onSuccess, ...rest } = {}) => {
  const { i18n } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    /* { "reflection": "string", "newActionSteps": [ { "label": "string", "date": "2023-08-29" } ], "checked": [ 0 ] } */
    mutationFn: async ({
      actionSteps = [],
      previousActionSteps = [],
      ...data
    }) => {
      console.log("%cMUTATION", "color:lime", { actionSteps, ...data });
      return await authFetch({
        method: "POST",
        url: "/api/latest/user-sessions-reflection",
        data: {
          ...data,
          newActionSteps: actionSteps.map(({ label, date }) => {
            const formattedDate = i18n.formatLocalMaybe(date, UTC_DATE_FORMAT);
            console.log("mapStep", { date, formattedDate });
            return {
              label,
              date: formattedDate,
            };
          }),
          checked: previousActionSteps
            .filter(({ checked }) => checked)
            .map(({ id }) => id),
        },
      });
    },
    onSuccess: (data) => {
      console.log("[useUserReflectionMutation onSuccess]", data);
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      onSuccess?.(data);
      // return data;
    },
    ...rest,
  });
  return mutation;
};
