import {
  applySpec,
  converge,
  defaultTo,
  descend,
  evolve,
  keys,
  map,
  mergeAll,
  pick,
  pipe,
  prop,
  sort,
  unapply,
} from "ramda";
import { useAuth } from "../Authorization";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { useContext } from "react";
import { I18nContext } from "../I18n/I18nProvider";

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

export const evolveSome = converge(pick, [keys, evolve]);

export const useConversationsQuery = (params = {}) => {
  const { i18n } = useContext(I18nContext);
  const conversationsQuery = useMyQuery({
    queryKey: ["messages"],
    fetchDef: {
      url: `/api/latest/messages`,
      to: pipe(
        sort(descend(prop("createdAt"))),
        map(
          converge(unapply(mergeAll), [
            pick(["username", "firstName", "lastName"]),
            evolveSome({
              unreadMessageCount: defaultTo(0),
              lastMessage: defaultTo(""),
            }),
            applySpec({
              time: pipe(prop("createdAt"), i18n.parseUTCLocal),
            }),
          ])
        )
      ),
    },
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
