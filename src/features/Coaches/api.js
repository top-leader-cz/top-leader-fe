import { useMutation, useQuery } from "react-query";
import { useAuth } from "../Authorization";
import { getFirstDayOfTheWeek } from "../I18n/utils/date";

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

export const usePickCoach = ({ coach }) => {
  const { authFetch, fetchUser } = useAuth();
  // const queryClient = useQueryClient();
  const pickCoachMutation = useMutation({
    mutationFn: async () =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-info/coach`,
        data: { coach: coach.username }, // throw without coach
      }),
    onSuccess: () => {
      fetchUser();
      // queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
  });

  return {
    mutation: pickCoachMutation,
    onPick: coach ? pickCoachMutation.mutate : undefined,
    pickPending: pickCoachMutation.isLoading,
  };
};
