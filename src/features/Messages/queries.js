import { useMutation } from "react-query";
import { useAuth } from "../Authorization";

export const useSendMessageMutation = ({ onSuccess, ...rest } = {}) => {
  const { authFetch } = useAuth();
  const sendMutation = useMutation({
    mutationFn: async ({ userTo, messageData }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/messages`,
        data: { userTo, messageData },
      }),
    onSuccess: (data) => {
      console.log("[useSendMessageMutation.onSuccess]", { data });
      onSuccess?.(data);
    },
    ...rest,
  });
  return sendMutation;
};
