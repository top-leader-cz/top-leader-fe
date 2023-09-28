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
import { curryN, when } from "ramda";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Header } from "../../components/Header";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2 } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { AvailabilityCalendar } from "../Availability/AvailabilityCalendar";
import {
  CoachInfo,
  useCoachAvailabilityQuery,
  usePickCoach,
} from "../Coaches/Coaches.page";
import { QueryRenderer } from "../QM/QueryRenderer";
import { messages } from "./messages";
import { useSendMessageMutation } from "./queries";

export const useCoachQuery = ({ username, onError, onSuccess }) => {
  const { authFetch } = useAuth();

  return useQuery({
    enabled: !!username,
    queryKey: ["coach", username],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => authFetch({ url: `/api/latest/coaches/${username}` }),
    onError,
    onSuccess,
  });
};

const errIs = curryN(2, (statusCode, e) => e?.response?.status === statusCode);

const RightMenu = ({ username, msg, rightOpen, setRightOpen }) => {
  const { user } = useAuth();
  const coachQuery = useCoachQuery({
    username,
    onError: when(errIs(404), () => setRightOpen(false)),
    onSuccess: (e) => setRightOpen(true),
  });
  const pickCoach = usePickCoach({ coach: coachQuery.data });
  const profilePhotoSrc = `/api/latest/coaches/${username}/photo`;
  const canPickCoach = user.data.coach !== username;

  console.log("[Messages.RightMenu.rndr]", { coachQuery });

  return (
    <ScrollableRightMenu
      buttonProps={
        canPickCoach &&
        pickCoach.onPick && {
          children: msg("messages.aside.pick-coach"),
          type: "button",
          variant: "outlined",
          disabled: pickCoach.pickPending,
          onClick: pickCoach.onPick,
        }
      }
      sx={{ whiteSpace: "normal" }}
    >
      <QueryRenderer
        {...coachQuery}
        loaderName="Block"
        errored={(e) => {
          // console.log("coachQuery.errored.rndr", { e })
          return null;
        }}
        success={({ data: coach }) => (
          <>
            <Box width="100%" align="left" mt={3}>
              {/* <object data="https://placehold.co/400x400?text=Incognito" type="image/png" > */}
              <Box
                component="img"
                borderRadius={1}
                width={225}
                alignSelf={"center"}
                src={profilePhotoSrc}
                alt={`${username}`}
              />
              {/* </object> */}
            </Box>
            <CoachInfo coach={coach} maxBioChars={2000} sx={{ my: 3 }} />
            <AvailabilityCalendar coach={coach} sx={{ flexShrink: 0 }} />
          </>
        )}
      />
    </ScrollableRightMenu>
  );
};

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

const Message = ({ message, scrollIntoView }) => {
  const ref = useRef();
  const messageRef = useRef(message);
  messageRef.current = message;
  useEffect(() => {
    if (scrollIntoView) {
      console.log("[Message.scrollIntoView] should scroll now", {
        ...messageRef.current,
        ref,
      });
      if (ref.current) setTimeout(() => ref.current.scrollIntoView(), 100);
      // TODO: rm timeout - side menu not initially rendered - without timeout this effect executes on "wider screen"
      else
        console.log(
          "[Message.scrollIntoView] ref missing, NOT scrolling into view",
          { ...messageRef.current }
        );
    }
  }, [scrollIntoView]);

  const { fromMe, text } = message;
  const addresseeSx = fromMe
    ? {
        alignSelf: "flex-end",
        color: "white",
        bgcolor: "primary.main",
        border: `1px solid #4720B7`,
        // border: `1px solid primary.main`,
        borderBottomRightRadius: 0,
      }
    : {
        alignSelf: "flex-start",
        color: "#475467",
        bgcolor: "#F9F8FF",
        border: `1px solid #907ACF`,
        borderBottomLeftRadius: 0,
      };

  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: "6px",
        width: "90%",
        maxWidth: "500px",
        mt: 3,
        "&:first-of-type": { mt: 0 },
        p: 2,
        opacity: message.isOptimisticUpdate ? 0.5 : 1,
        ...addresseeSx,
      }}
    >
      {text}
    </Box>
  );
};

const Conversation = ({
  addressee,
  avatarSrc,
  restHeight: restHeightProp = 0,
  onLastMessageChange,
}) => {
  const { user } = useAuth();
  const currentUsername = user.data.username;
  const msg = useMsg();
  // const name = `${coach.firstName} ${coach.lastName}`;
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: { message: "" },
  });
  const headerHeight = 92;
  const footerHeight = 113;
  const restHeight = restHeightProp + headerHeight + footerHeight;

  const { authFetch } = useAuth();
  const messagesQuery = useQuery({
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
  });
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
  const onSendMessage = ({ value }) => {
    console.log("onSendMessage", { value });
  };
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

  if (!addressee) return null; // TODO: empty box?
  if (!messagesQuery.data) return <QueryRenderer isLoading />;

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
          sx={{ width: 44, height: 44, mr: 1.5 }}
        />
        <H2>{addressee}</H2>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "flex-start",
          p: 3,
          height: `calc(100% - ${restHeight}px)`,
          overflow: "scroll",
        }}
      >
        {messagesQuery.data.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            scrollIntoView={index + 1 === messagesQuery.data.length}
          />
        ))}
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

const useConversations = () => {
  // cannot destructure, state is null initially
  const { state } = useLocation();
  const routeStateUsername = state?.messagesFrom;

  const [_selectedUsername, setSelectedUsername] = useState();
  const { authFetch } = useAuth();
  const conversationsQuery = useQuery({
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
  });
  const queryClient = useQueryClient();
  useEffect(() => console.log("queryClient ref changed"), [queryClient]);
  const onLastMessageChange = useCallback(
    async ({ addressee, message }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages"],
        exact: true,
      });
      queryClient.setQueryData(["messages"], (old) => {
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

  return useMemo(() => {
    if (!conversationsQuery.data) return;
    // const conversations = []; // TODO: test
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

    return {
      selectedUsername,
      setSelectedUsername,
      conversations,
      selectedConversation: conversations.find(
        ({ username }) => username === selectedUsername
      ),
      onLastMessageChange,
    };
  }, [
    _selectedUsername,
    conversationsQuery.data,
    onLastMessageChange,
    routeStateUsername,
  ]);
};

function MessagesPageInner() {
  const msg = useMsg();
  const {
    setSelectedUsername,
    conversations,
    selectedUsername,
    selectedConversation,
    onLastMessageChange,
  } = useConversations() ?? {};

  const onSelect = useCallback(
    (key) => {
      console.log("onSelect", { key });
      setSelectedUsername(key);
    },
    [setSelectedUsername]
  );

  console.log("[MessagesPageInner.rndr]", {
    setSelectedUsername,
    conversations,
    selectedUsername,
    selectedConversation,
  });

  useRightMenu(
    useCallback(
      ({ rightOpen, setRightOpen }) =>
        selectedUsername && (
          <RightMenu
            username={selectedUsername}
            msg={msg}
            rightOpen={rightOpen}
            setRightOpen={setRightOpen}
          />
        ),
      [msg, selectedUsername]
    )
  );

  const isLoading = !conversations;
  if (isLoading) return <QueryRenderer isLoading />;

  return (
    <Layout>
      <Header text={msg("messages.heading")} />
      <Box
        display={"flex"}
        alignItems={"stretch"}
        height={"calc(100% - 103px)"}
      >
        <ContactList
          conversations={conversations}
          selectedUsername={selectedUsername}
          onSelect={onSelect}
        />
        <Conversation
          addressee={selectedConversation?.username}
          avatarSrc={selectedConversation?.avatarSrc}
          onLastMessageChange={onLastMessageChange}
        />
      </Box>
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
