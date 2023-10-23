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
      authFetch({ url: `/api/latest/user-info/upcoming-sessions` })
        .then(
          map(
            converge(mergeRight, [
              identity,
              pipe(prop("coach"), objOf("username")),
            ])
          )
        )
        .catch(
          always([
            {
              username: "test1",
              firstName: "Daniel",
              lastName: "Brekke",
              time: "2023-10-02T09:00:00",
            },
            {
              username: "test2",
              firstName: "TODO",
              lastName: "API",
              time: "2023-11-02T10:00:00",
            },
          ])
        ),
  });
};

// TODO: scheduledSessionService.deleteUserSessions -> *session

export const usePickCoach = ({ coach }) => {
  const { authFetch, fetchUser } = useAuth();
  const queryClient = useQueryClient();
  const pickCoachMutation = useMutation({
    mutationFn: async (username) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-info/coach`,
        data: {
          coach:
            typeof username === "string" || username === null // TODO: {undefined / null / empty string} returns 400 - fix unpick coach
              ? username
              : coach.username,
        }, // throw without coach
      }),
    onSuccess: () => {
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
  });

  return {
    mutation: pickCoachMutation,
    onPick: coach ? pickCoachMutation.mutate : undefined,
    pickPending: pickCoachMutation.isLoading,
  };
};
