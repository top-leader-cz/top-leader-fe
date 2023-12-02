import { pick } from "ramda";
import { useAuth } from "../Authorization";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";

export const useCoachQuery = ({ username, onError, onSuccess }) => {
  return useMyQuery({
    enabled: !!username,
    queryKey: ["coach", username],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    fetchDef: { url: `/api/latest/coaches/${username}` },
    // queryFn: () => authFetch({ url: `/api/latest/coaches/${username}` }),
    onError,
    onSuccess,
  });
};
export const useConversationsQuery = (params = {}) => {
  const { authFetch } = useAuth();
  const conversationsQuery = useMyQuery({
    queryKey: ["messages"],
    queryFn: () =>
      authFetch({ url: `/api/latest/messages` }).then((data) => {
        const conversations = data.map(
          ({ username, unreadMessageCount, lastMessage }) => ({
            username,
            lastMessage,
            unreadMessageCount,
            avatarSrc: `https://i.pravatar.cc/200?u=${"" + Math.random()}`,
            time: "11:42",
          })
        );
        return conversations;
      }),
    ...params,
  });
  return conversationsQuery;
};

export const useConversationMessagesQuery = ({ addressee, ...rest } = {}) => {
  const { user } = useAuth();
  const currentUsername = user.data.username;
  const { authFetch } = useAuth();

  const messagesQuery = useMyQuery({
    enabled: !!addressee,
    refetchInterval: 5 * 1000, // TODO
    queryKey: ["messages", addressee],
    queryFn: () =>
      authFetch({
        url: `/api/latest/messages/${addressee}`,
        query: { page: 0, size: 1000, sort: "createdAt,asc" },
      }).then((data) => {
        const maybeMessages = data.content?.map(
          ({
            id,
            username: from,
            addressee: to,
            messageData,
            displayed,
            createdAt,
          }) => {
            return {
              id,
              fromMe: from === currentUsername,
              text: messageData,
              isOptimisticUpdate: false,
            };
          }
        );

        return maybeMessages ?? [];
      }),
    ...rest,
  });
  return messagesQuery;
};

export const useSendMessageMutation = ({ ...rest } = {}) => {
  const sendMutation = useMyMutation({
    debug: true,
    fetchDef: {
      method: "POST",
      url: `/api/latest/messages`,
      from: pick(["userTo", "messageData"]),
    },
    ...rest,
  });
  return sendMutation;
};
