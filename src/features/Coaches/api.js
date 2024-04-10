import { converge, identity, map, mergeRight, objOf, pipe, prop } from "ramda";
import { useAuth } from "../Authorization";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";

export const useUserUpcomingSessionsQuery = (rest = {}) => {
  /* [ { "coach": "coach", "firstName": "Mitch", "lastName": "Cleverman", "time": "%s" }, ] */
  return useMyQuery({
    queryKey: ["user-info", "upcoming-sessions"],
    fetchDef: {
      url: `/api/latest/user-info/upcoming-sessions`,
      to: map(
        converge(mergeRight, [identity, pipe(prop("coach"), objOf("username"))])
      ),
    },
    ...rest,
  });
};

export const usePickCoach = ({ coach, ...rest }) => {
  const pickCoachMutation = useMyMutation({
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
    // snackbar: { success: true, error: true },
    invalidate: [
      { queryKey: ["user-info"] },
      { queryKey: ["coaches"] },
      { queryKey: ["coach", coach?.username] },
    ],
    ...rest,
  });

  return {
    mutation: pickCoachMutation,
    onPick: coach ? pickCoachMutation.mutate : undefined,
    pickPending: pickCoachMutation.isLoading,
  };
};

export const useYourCoachQuery = (rest = {}) => {
  const username = useAuth().user?.data?.coach;
  const yourCoachQuery = useMyQuery({
    queryKey: ["coaches", username],
    fetchDef: { url: `/api/latest/coaches/${username}` },
    enabled: !!username,
    ...rest,
  });
  return yourCoachQuery;
};
