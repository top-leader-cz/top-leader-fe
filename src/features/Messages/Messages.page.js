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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Header } from "../../components/Header";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2 } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";
import {
  useConversationsQuery,
  useConversationMessagesQuery,
  useSendMessageMutation,
} from "./api";
import { messages } from "./messages";
import { ConversationMessage } from "./ConversationMessage";
import { MessagesRightMenu } from "./MessagesRightMenu";
import { EmptyTemplate } from "../Feedback/EmptyTemplate";
import { routes } from "../../routes";
import { add } from "date-fns";

// https://mui.com/material-ui/react-list/
const ContactList = ({ conversations = [], selectedUsername, onSelect }) => {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 300,
        bgcolor: "background.paper",
        borderRadius: "6px 0px 0px 6px",
        borderRight: "1px solid #EAECF0",
        // borderRadius: 0.6,
        // height: "100%",
      }}
    >
      {conversations.map(
        ({ username, lastMessage, avatarSrc, time, unreadMessageCount }) => (
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
                <Avatar
                  alt={username}
                  src={`/api/latest/coaches/${username}/photo`}
                  sx={{ width: 44, height: 44 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<H2>{username}</H2>}
                secondary={
                  <span style={{ whiteSpace: "nowrap" }}>{lastMessage}</span>
                }
                sx={{ width: "100%", overflow: "hidden" }}
              />
              <ListItemText
                primary={time}
                secondary={
                  !!unreadMessageCount && (
                    <Box
                      component={"span"}
                      borderRadius="6px"
                      py={"2px"}
                      px={"6px"}
                      bgcolor={"#F9F8FF"}
                      color={"primary.main"}
                      fontWeight={500}
                      fontSize={"14px"}
                      sx={{ lineHeight: "21px" }}
                    >
                      {unreadMessageCount}
                    </Box>
                  )
                }
                sx={{ textAlign: "center" }}
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

const Conversation = ({
  addressee,
  avatarSrc,
  restHeight: restHeightProp = 0,
}) => {
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
  const lastMessage = messagesQuery.data?.[messagesQuery.data.length - 1]?.text;
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
        <Avatar
          alt={addressee}
          src={`/api/latest/coaches/${addressee}/photo`}
          sx={{
            width: 44,
            height: 44,
            mr: 1.5,
            ...avatarImgBag.fadeInOutSx,
          }}
          onLoad={avatarImgBag.onLoad}
        />
        <H2>{addressee}</H2>
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
                scrollIntoView={index + 1 === messagesQuery.data.length}
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

function MessagesPageInner() {
  const msg = useMsg();
  // cannot destructure, state is null initially
  const { state } = useLocation();
  const routeStateUsername = state?.messagesFrom;

  const [_selectedUsername, setSelectedUsername] = useState();
  const conversationsQuery = useConversationsQuery();

  const selectedUsername = useMemo(() => {
    const conversations = conversationsQuery.data ?? [];
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
  }, [_selectedUsername, conversationsQuery.data, routeStateUsername]);

  const selectedConversation = useMemo(() => {
    const conversations = conversationsQuery.data ?? [];
    return conversations.find(({ username }) => username === selectedUsername);
  }, [conversationsQuery.data, selectedUsername]);

  const onSelect = useCallback(
    (key) => {
      console.log("onSelect", { key });
      setSelectedUsername(key);
    },
    [setSelectedUsername]
  );

  // console.log("[MessagesPageInner.rndr]", { setSelectedUsername, selectedUsername, selectedConversation, });

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
          if (!data?.length)
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
                display={"flex"}
                alignItems={"stretch"}
                height={"calc(100% - 103px)"}
              >
                <ContactList
                  conversations={data}
                  selectedUsername={selectedUsername}
                  onSelect={onSelect}
                />
                <Conversation
                  addressee={selectedConversation?.username}
                  avatarSrc={selectedConversation?.avatarSrc}
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
