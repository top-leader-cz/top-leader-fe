import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { getFirstDayOfTheWeek } from "../I18n/utils/date";
import {
  always,
  converge,
  identity,
  map,
  mergeRight,
  objOf,
  pipe,
  prop,
} from "ramda";

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

export const useUserUpcomingSessionsQuery = () => {
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
  });
};

export const usePickCoach = ({ coach }) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const pickCoachMutation = useMutation({
    mutationFn: async (username) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-info/coach`,
        data: {
          coach:
            typeof username === "string" || username === null
              ? username
              : coach.username,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
    },
  });

  return {
    mutation: pickCoachMutation,
    onPick: coach ? pickCoachMutation.mutate : undefined,
    pickPending: pickCoachMutation.isLoading,
  };
};
