import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { getFirstDayOfTheWeek } from "../I18n/utils/date";
import {
  always,
  applySpec,
  converge,
  identity,
  map,
  mergeRight,
  objOf,
  pipe,
  prop,
} from "ramda";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";

const useCoachAvailabilityQuery = ({ username }) => {
  const { authFetch } = useAuth();

  return useQuery({
    enabled: !!username,
    queryKey: ["coaches", username, "availability"],
    queryFn: () => {
      const firstDayOfTheWeek = getFirstDayOfTheWeek();

      return authFetch({
        url: `/api/latest/coaches/${username}/availability`,
        query: {
          firstDayOfTheWeek,
        },
      });
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useUserUpcomingSessionsQuery = (params = {}) => {
  const { authFetch } = useAuth();
  /*
  [
    {
      "coach": "coach",
      "firstName": "Mitch",
      "lastName": "Cleverman",
      "time": "%s"
    },
    {
      "coach": "coach",
      "firstName": "Mitch",
      "lastName": "Cleverman",
      "time": "%s"
    }
  ]
  */

  return useQuery({
    queryKey: ["user-info", "upcoming-sessions"],
    queryFn: () =>
      authFetch({ url: `/api/latest/user-info/upcoming-sessions` }).then(
        map(
          converge(mergeRight, [
            identity,
            pipe(prop("coach"), objOf("username")),
          ])
        )
      ),
    ...params,
  });
};

export const usePickCoach = ({ coach }) => {
  const queryClient = useQueryClient();
  const pickCoachMutation = useMyMutation({
    debug: true,
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-info/coach`,
      from: (username) => ({
        coach:
          typeof username === "string" || username === null
            ? username
            : coach.username,
      }),
    },
    snackbar: { success: false, error: true },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user-info"] });
      queryClient.refetchQueries({ queryKey: ["coaches"] });
    },
  });

  return {
    mutation: pickCoachMutation,
    onPick: coach ? pickCoachMutation.mutate : undefined,
    pickPending: pickCoachMutation.isLoading,
  };
};

export const useYourCoachQuery = (rest = {}) => {
  const { authFetch } = useAuth();
  const { user } = useAuth();
  const username = user?.data?.coach;

  const yourCoachQuery = useMyQuery({
    queryKey: ["coaches", username],
    queryFn: () => authFetch({ url: `/api/latest/coaches/${username}` }),
    enabled: !!username,
    ...rest,
  });
  return yourCoachQuery;
};
