import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Header } from "../../components/Header";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2 } from "../../components/Typography";
import { routes } from "../../routes";
import { EmptyTemplate } from "../Feedback/EmptyTemplate";
import { QueryRenderer } from "../QM/QueryRenderer";
import { ConversationMessage } from "./ConversationMessage";
import { MessagesRightMenu } from "./MessagesRightMenu";
import {
  useConversationMessagesQuery,
  useConversationsQuery,
  useSendMessageMutation,
} from "./api";
import { messages } from "./messages";
import { useAuth } from "../Authorization";
import { useClientsQuery } from "../Clients/api";
import { prop } from "ramda";
import { I18nContext } from "../I18n/I18nProvider";
import { getYear, isToday, isValid } from "date-fns";
import { formatName } from "../Coaches/CoachCard";

const useCoachClients = () => {
  const { isCoach } = useAuth();
  const query = useClientsQuery({ enabled: isCoach });

  if (!isCoach || !query.data) return [];

  return query.data;
};

// temp until api will be ready
const useAddCoachClients = () => {
  const coachClients = useCoachClients();

  return useCallback(
    ({ conversations = [] }) => {
      const uncontactedClientsConversations = coachClients
        .filter(
          ({ username }) => !conversations.some((c) => c.username === username)
        )
        .map(({ username, firstName, lastName }) => ({
          username,
          firstName,
          lastName,
          lastMessage: "",
          time: "",
          unreadMessageCount: 0,
        }));

      return [...conversations, ...uncontactedClientsConversations];
    },
    [coachClients]
  );
};

const stringToColor = (string) => {
  /* eslint-disable no-bitwise */
  if (!string) return "#000000";
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
  /* eslint-enable no-bitwise */
};

const UserAvatar = ({
  username: usernameProp,
  fullName: fullNameProp,
  sx = {},
  ...props
}) => {
  const username = usernameProp || "";
  const fullName = fullNameProp || "";

  return (
    <Avatar
      alt={username}
      src={`/api/latest/coaches/${username}/photo`}
      sx={{
        width: 44,
        height: 44,
        bgcolor: stringToColor(fullName || username),
        ...sx,
      }}
      {...props}
    >
      {(fullName || username).split(" ").map(prop(0))}
    </Avatar>
  );
};

// https://mui.com/material-ui/react-list/
const ContactList = ({ conversations = [], selectedUsername, onSelect }) => {
  const { i18n } = useContext(I18nContext);
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: { sm: 150, md: 300 },
        bgcolor: "background.paper",
        borderRadius: "6px 0px 0px 6px",
        borderRight: "1px solid #EAECF0",
        // borderRadius: 0.6,
        // height: "100%",
      }}
    >
      {conversations.map(
        ({
          username,
          firstName,
          lastName,
          fullName = formatName({ firstName, lastName }),
          lastMessage,
          time,
          unreadMessageCount,
        }) => (
          <ListItem
            key={username}
            disablePadding
            alignItems="flex-start"
            sx={{
              bgcolor:
                username === selectedUsername ? "#F9F8FF" : "transparent",
              cursor: "pointer",
            }}
            // secondaryAction={ <IconButton edge="end" aria-label="comments"> <CommentIcon /> </IconButton> }
          >
            <ListItemButton
              role={undefined}
              onClick={() => onSelect(username)}
              dense
            >
              <ListItemAvatar>
                <UserAvatar username={username} fullName={fullName} />
              </ListItemAvatar>
              <ListItemText
                // disableTypography
                // primary={<H2>{username}</H2>}
                // secondary={<span style={{}}>{lastMessage}</span>}
                primaryTypographyProps={{
                  variant: "h2",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                secondaryTypographyProps={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                primary={fullName || username}
                secondary={lastMessage}
                title={username}
                sx={{ width: "100%" }}
              />
              <ListItemText
                primary={
                  isToday(time)
                    ? i18n.formatLocal(time, "p")
                    : isValid(time)
                    ? i18n.formatLocal(time, "P")
                    : // .replace(getYear(new Date()).toString(), "")
                      // ? i18n.formatRelativeLocal(time)
                      ""
                }
                secondary={
                  <Box
                    component={"span"}
                    borderRadius="6px"
                    py={"2px"}
                    px={"6px"}
                    bgcolor={"#F9F8FF"}
                    color={"primary.main"}
                    fontWeight={500}
                    fontSize={"14px"}
                    lineHeight={"21px"}
                    visibility={unreadMessageCount ? "visible" : "hidden"}
                  >
                    {unreadMessageCount}
                  </Box>
                }
                sx={{
                  textAlign: "center",
                  minWidth: "unset",
                  // display: "none", md: undefined },
                }}
              />
            </ListItemButton>
          </ListItem>
        )
      )}
    </List>
  );
};

// const onLoad = useCallback( (e) => { const { src } = e.target; const username = src.split("/").pop(); setLastImgIdLoaded(username); }, [setLastImgIdLoaded] );
export const useImgLoading = ({ imgId }) => {
  const [lastImgIdLoaded, setLastImgIdLoaded] = useState();
  const isLoaded = imgId === lastImgIdLoaded;
  const onLoad = () => {
    console.log("[useImgLoading.onLoad] ", imgId);
    if (imgId) setLastImgIdLoaded(imgId);
  };

  return {
    onLoad,
    isLoaded,
    fadeInOutSx: {
      opacity: isLoaded ? 1 : 0,
      transition: "opacity 0.1s ease-in-out",
    },
  };
};

const Conversation = ({ addressee, name, restHeight: restHeightProp = 0 }) => {
  const msg = useMsg();
  // const name = `${coach.firstName} ${coach.lastName}`;
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: { message: "" },
  });
  const headerHeight = 92;
  const footerHeight = 113;
  const restHeight = restHeightProp + headerHeight + footerHeight;
  const avatarImgBag = useImgLoading({ imgId: addressee });

  const messagesQuery = useConversationMessagesQuery({ addressee });
  const queryClient = useQueryClient();
  const sendMutation = useSendMessageMutation({
    onMutate: async (newMessage) => {
      const { userTo, messageData } = newMessage;
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["messages", addressee] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData([
        "messages",
        addressee,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["messages", addressee], (old) => [
        ...old,
        {
          id: Math.random(),
          fromMe: true,
          text: messageData,
          isOptimisticUpdate: true,
        },
      ]);

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(
        ["messages", addressee],
        context.previousMessages
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", addressee] });
    },
  });

  const handleSubmit = useCallback(
    async ({ message }) => {
      console.log("handleSubmit", { message });
      // await sendMutation.mutateAsync({
      sendMutation.mutateAsync({
        userTo: addressee,
        messageData: message,
      });
      methods.reset();
    },
    [addressee, methods, sendMutation]
  );

  useEffect(() => console.log("queryClient ref changed"), [queryClient]);
  const onLastMessageChange = useCallback(
    async ({ addressee, message }) => {
      // Set last message in conversations list:
      await queryClient.cancelQueries({
        queryKey: ["messages"],
        exact: true,
      });
      queryClient.setQueryData(["messages"], (old, ...rest) => {
        if (!old) console.error("TODO: investigate", { old, rest });
        const index = old.findIndex((c) => c.username === addressee);
        const updateCandidateMaybe = index >= 0 ? old[index] : undefined;
        if (
          !updateCandidateMaybe ||
          updateCandidateMaybe.lastMessage === message
        )
          return old;

        const copy = [...old];
        copy[index] = { ...copy[index], lastMessage: message };

        return copy;
      });
    },
    [queryClient]
  );
  const lastMessage =
    messagesQuery.data?.[messagesQuery.data?.length - 1]?.text;
  useEffect(() => {
    if (lastMessage) {
      const payload = { addressee, message: lastMessage };
      console.log("eff.onLastMessageChange", payload);
      onLastMessageChange?.(payload);
    }
  }, [addressee, lastMessage, onLastMessageChange]);

  console.log("[Conversation.rndr]", {
    addressee,
    messagesQuery,
    sendMutation,
  });

  if (!addressee) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
        width: "100%",
        mr: -4,
      }}
    >
      <Box
        sx={{
          p: 3,
          height: `${headerHeight}px`,
          borderBottom: "1px solid #EAECF0",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
        }}
      >
        <UserAvatar
          username={addressee}
          fullName={name}
          onLoad={avatarImgBag.onLoad}
          sx={{ mr: 1.5, ...avatarImgBag.fadeInOutSx }}
        />
        <H2 title={!name ? undefined : addressee}>{name || addressee}</H2>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "flex-end",
          p: 3,
          height: `calc(100% - ${restHeight}px)`,
          overflow: "scroll",
        }}
      >
        <QueryRenderer
          {...messagesQuery}
          loaderName="Block"
          success={({ data }) =>
            data.map((message, index) => (
              <ConversationMessage
                key={message.id}
                message={message}
                scrollIntoView={index + 1 === messagesQuery.data?.length}
              />
            ))
          }
        />
      </Box>
      <RHForm
        sx={{
          p: 3,
          pb: 4,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #EAECF0",
          height: footerHeight,
        }}
        form={methods}
        onSubmit={handleSubmit}
      >
        <Box sx={{ flex: "1 1 100%" }}>
          <RHFTextField
            name="message"
            rules={{ required: true }}
            label={""}
            placeholder={msg("messages.conversation.message.placeholder")}
            size="small"
            hiddenLabel
            multiline
            rows={2}
            sx={{ pr: 3 }}
            fullWidth
            autoFocus
            // {...register("message", { required: true })}
          />
        </Box>
        <Button variant="contained" type="submit">
          {msg("messages.conversation.send")}
        </Button>
      </RHForm>
    </Box>
  );
};

const arr = [];

function MessagesPageInner() {
  const msg = useMsg();
  // cannot destructure, state is null initially
  const { state } = useLocation();
  const routeStateUsername = state?.messagesFrom;

  const [_selectedUsername, setSelectedUsername] = useState();
  const conversationsQuery = useConversationsQuery();

  const addClients = useAddCoachClients();
  const conversations = addClients({
    conversations: conversationsQuery.data ?? arr,
  });

  const selectedUsername = useMemo(() => {
    // When username is not among conversations usernames:
    const usernameCandidates = [
      _selectedUsername,
      routeStateUsername,
      conversations?.[0]?.username,
    ];
    const selectedUsername = usernameCandidates.find((candidate) =>
      conversations.some(({ username }) => username === candidate)
    );
    return selectedUsername;
  }, [_selectedUsername, conversations, routeStateUsername]);

  const selectedConversation = useMemo(() => {
    return conversations.find(({ username }) => username === selectedUsername);
  }, [conversations, selectedUsername]);

  const onSelect = useCallback(
    (key) => {
      console.log("onSelect", { key });
      setSelectedUsername(key);
    },
    [setSelectedUsername]
  );

  console.log("[MessagesPageInner.rndr]", {
    _selectedUsername,
    selectedUsername,
    conversations,
    selectedConversation,
    state,
    conversationsQuery,
  });

  useRightMenu(
    useCallback(
      ({ rightOpen, setRightOpen }) =>
        selectedUsername && (
          <MessagesRightMenu
            username={selectedUsername}
            msg={msg}
            rightOpen={rightOpen}
            setRightOpen={setRightOpen}
          />
        ),
      [msg, selectedUsername]
    )
  );

  return (
    <Layout>
      <Header text={msg("messages.heading")} />
      <QueryRenderer
        {...conversationsQuery}
        success={({ data = [] }) => {
          const conversations = addClients({ conversations: data });
          if (!conversations?.length)
            return (
              <EmptyTemplate
                title={msg("messages.empty.title")}
                description={msg("messages.empty.description")}
                iconName="ChatBubbleOutlineOutlined"
                button={{
                  variant: "contained",
                  children: msg("messages.empty.create-btn"),
                  href: routes.coaches,
                }}
              />
            );
          else
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  height: "calc(100% - 103px)",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <ContactList
                  conversations={conversations}
                  selectedUsername={selectedUsername}
                  onSelect={onSelect}
                />
                <Conversation
                  addressee={selectedConversation?.username}
                  name={formatName(selectedConversation)}
                />
              </Box>
            );
        }}
      />
    </Layout>
  );
}

export function MessagesPage() {
  return (
    <MsgProvider messages={messages}>
      <MessagesPageInner />
    </MsgProvider>
  );
}
