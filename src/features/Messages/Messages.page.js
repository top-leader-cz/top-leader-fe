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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { RHFTextField } from "../../components/Forms";
import { Header } from "../../components/Header";
import { Layout, useRightMenu } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2 } from "../../components/Typography";
import { useAuth } from "../Authorization";
import {
  CREATE_OFFSET,
  CoachInfo,
  TimeSlots,
  createSlot,
} from "../Coaches/Coaches.page";
import { messages } from "./messages";

const Name = ({
  firstName,
  lastName,
  fullName = `${firstName} ${lastName}`,
}) => {
  return <H2>{fullName}</H2>;
};

// https://mui.com/material-ui/react-list/
const ContactList = ({ data = [], selectedKey = "1", onSelect }) => {
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
      {data.map(({ key, name, desc, avatarSrc, time, messageCount }, index) => (
        <ListItem
          key={key}
          alignItems="flex-start"
          sx={{
            bgcolor: key === selectedKey ? "#F9F8FF" : "transparent",
            cursor: "pointer",
          }}
          //   secondaryAction={
          //     <IconButton edge="end" aria-label="comments">
          //       <CommentIcon />
          //     </IconButton>
          //   }
          disablePadding
          // onClick={() => onSelect(key)}
        >
          <ListItemButton role={undefined} onClick={() => onSelect(key)} dense>
            <ListItemAvatar>
              <Avatar
                alt={name}
                src={avatarSrc || "/static/images/avatar/2.jpg"}
                sx={{ width: 44, height: 44 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={<Name fullName={name} />}
              secondary={<span style={{ whiteSpace: "nowrap" }}>{desc}</span>}
              sx={{ width: "100%", overflow: "hidden" }}
            />
            <ListItemText
              primary={time}
              secondary={
                !!messageCount && (
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
                    {messageCount}
                  </Box>
                )
              }
              sx={{ textAlign: "center" }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

let id = 0;
const MOCK_MESSAGES = [
  {
    id: id++,
    fromMe: true,
    text: "Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non.",
  },
  {
    id: id++,
    fromMe: false,
    text: "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.",
  },
  {
    id: id++,
    fromMe: true,
    text: "Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non.",
  },
  {
    id: id++,
    fromMe: false,
    text: "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.",
  },
  {
    id: id++,
    fromMe: true,
    text: "Voluptas alias tempore",
  },
  {
    id: id++,
    fromMe: true,
    text: "eos quidem omnis reprehenderit non.",
  },
  {
    id: id++,
    fromMe: false,
    text: "Et et officia laborum magnam",
  },
  {
    id: id++,
    fromMe: false,
    text: "Rerum ea nulla odit quis et.",
  },
  {
    id: id++,
    fromMe: true,
    text: "Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non.",
  },
  {
    id: id++,
    fromMe: false,
    text: "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.",
  },
  {
    id: id++,
    fromMe: true,
    text: "Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non. Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non.Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non.",
  },
  {
    id: id++,
    fromMe: false,
    text: "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et. Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.",
  },
  {
    id: id++,
    fromMe: true,
    text: "Voluptas alias tempore ullam veritatis eos quidem omnis reprehenderit non.",
  },
  {
    id: id++,
    fromMe: false,
    text: "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.",
  },
];

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
        ...addresseeSx,
      }}
    >
      {text}
    </Box>
  );
};

export const useSendMessageMutation = () => {
  const { authFetch } = useAuth();
  const sendMutation = useMutation({
    mutationFn: ({ userTo, messageData }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/messages`,
        data: { userTo, messageData },
      }),
  });
  return sendMutation;
};

const Conversation = ({
  // coach,
  name,
  avatarSrc,
  onSendMessage = () => {},
  messages = [],
  restHeight: restHeightProp = 0,
}) => {
  const msg = useMsg();
  // const name = `${coach.firstName} ${coach.lastName}`;
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {},
  });
  const headerHeight = 92;
  const footerHeight = 113;
  const restHeight = restHeightProp + headerHeight + footerHeight;

  const addressee = "addressee"; // TODO

  const { authFetch } = useAuth();
  const messagesQuery = useQuery({
    queryKey: ["messages", addressee],
    queryFn: () =>
      authFetch({
        url: `/api/latest/messages/${addressee}`,
        query: { page: 0, size: 1000 },
        // sort: ["string"], // TODO: sort enum
      }),
  });
  const sendMutation = useSendMessageMutation();

  console.log("[Conversation.rndr]", {
    addressee,
    messagesQuery,
    sendMutation,
  });

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
          alt={name}
          src={avatarSrc}
          sx={{ width: 44, height: 44, mr: 1.5 }}
        />
        <Name fullName={name} />
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
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            scrollIntoView={index + 1 === messages.length}
          />
        ))}
      </Box>
      <Box
        sx={{
          p: 3,
          pb: 4,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #EAECF0",
          height: footerHeight,
        }}
      >
        <FormProvider {...methods}>
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
          <Button variant="contained" onClick={(e) => onSendMessage({})}>
            {msg("messages.conversation.send")}
          </Button>
        </FormProvider>
      </Box>
    </Box>
  );
};

const longTxt =
  "Et et officia laborum magnam sint perspiciatis alias. Ab similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.";
const shortTxt = "Lorem ipsum dolor sit";
const CONTACTS = [
  {
    key: "0",
    name: "Ju Hele",
    desc: shortTxt,
    avatarSrc: `https://i.pravatar.cc/200?u=${"" + Math.random()}`,
    time: "11:42",
    messageCount: 2,
  },
  {
    key: "1",
    name: "Dan Brekke",
    desc: shortTxt,
    avatarSrc: `https://i.pravatar.cc/200?u=${"" + Math.random()}`,
    time: "11:42",
    messageCount: 2,
  },
  {
    key: "2",
    name: "Jenna Pagac",
    desc: longTxt,
    avatarSrc: `https://i.pravatar.cc/200?u=${"" + Math.random()}`,
    time: "11:42",
    messageCount: 0,
  },
];

const TODAY = new Date();
const MOCK_SLOT = CREATE_OFFSET(TODAY, (start) => createSlot({ start }));
const SELECTED = null || {
  // TODO: where to get? API /coaches + name (search)?
  // name: "Ju Hele",
  role: "",
  experience: "7",
  languages: ["cs"],
  rate: "666",
  bio: longTxt + shortTxt,
  fields: ["life"],
};

function MessagesPageInner() {
  const [selectedKey, setSelectedKey] = useState("1"); // TODO
  const msg = useMsg();
  const onSelect = useCallback((key) => {
    console.log("onSelect", { key });
    setSelectedKey(key);
  }, []);

  const { authFetch } = useAuth();
  /* [ {
    "username": "string",
    "unreadMessageCount": 0,
    "lastMessage": "string"
  } ] */
  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: () => authFetch({ url: `/api/latest/messages` }),
  });

  const selected = CONTACTS.find(({ key }) => key === selectedKey);

  console.log("[MessagesPageInner.rndr]", { messagesQuery });

  useRightMenu(
    useMemo(
      () =>
        SELECTED && (
          <ScrollableRightMenu
            // heading={msg("")}
            buttonProps={{
              children: msg("messages.aside.pick-coach"),
              type: "submit",
              //   disabled: saveDisabled,
              onClick: (e) => {
                console.log("Pick click");
                // form.handleSubmit(saveMutation.mutateAsync, onError)(e);
              },
            }}
            sx={{ whiteSpace: "normal" }}
          >
            <Box width="100%" align="left" mt={3}>
              <Box
                component="img"
                borderRadius={1}
                width={225}
                alignSelf={"center"}
                src={selected.avatarSrc}
              />
            </Box>
            <CoachInfo
              coach={{
                name: selected.name,
                role: SELECTED.role,
                experience: SELECTED.experience,
                languages: SELECTED.languages,
                rate: SELECTED.rate,
                bio: SELECTED.bio,
                fields: SELECTED.fields,
              }}
              maxBioChars={2000}
              sx={{ my: 3 }}
            />
            <TimeSlots
              freeSlots={[
                MOCK_SLOT(0, 9),
                MOCK_SLOT(0, 10),
                MOCK_SLOT(0, 11),
                MOCK_SLOT(2, 10),
                MOCK_SLOT(3, 9),
                MOCK_SLOT(4, 11),
              ]}
              sx={{ flexShrink: 0 }}
            />
          </ScrollableRightMenu>
        ),
      [msg, selected.avatarSrc, selected.name]
    )
  );

  return (
    <Layout>
      <Header text={msg("messages.heading")} />
      <Box
        display={"flex"}
        alignItems={"stretch"}
        height={"calc(100% - 103px)"}
      >
        <ContactList
          data={CONTACTS}
          selectedKey={selectedKey}
          onSelect={onSelect}
        />
        <Conversation
          name={selected.name}
          avatarSrc={selected.avatarSrc}
          onSendMessage={({ value }) => {
            console.log("onSendMessage", { value });
          }}
          messages={(() => {
            const mm = {
              0: MOCK_MESSAGES.slice(0, 2),
              1: MOCK_MESSAGES,
              2: MOCK_MESSAGES.slice(1, -1),
              // TODO: weird, array not copied, MOCK_MESSAGES mutated?!? slice/reverse changes original MOCK_MESSAGES
              // 2: [].concat([...MOCK_MESSAGES], [...MOCK_MESSAGES]).slice(1, -1),
              // 2: [...MOCK_MESSAGES, ...MOCK_MESSAGES].slice(1, -1),
            };

            console.log(selected.key, { MOCK_MESSAGES, mm });
            return mm[selected?.key] ?? MOCK_MESSAGES;
          })()}
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
