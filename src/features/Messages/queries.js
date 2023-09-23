import { useMutation } from "react-query";
import { useAuth } from "../Authorization";

export const useSendMessageMutation = ({ onSuccess } = {}) => {
  const { authFetch } = useAuth();
  const sendMutation = useMutation({
    mutationFn: async ({ userTo, messageData }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/messages`,
        data: { userTo, messageData },
      }).then((data) => {
        console.log("[useSendMessageMutation.then]");
        onSuccess(data);
      }),
    onSuccess: (data) => {
      console.log("[useSendMessageMutation.onSuccess] TODO: NOT CALLED");
      //   debugger; // TODO: not called
      onSuccess(data);
    },
  });
  return sendMutation;
};
