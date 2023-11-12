import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1, P } from "../../components/Typography";
import { routes } from "../../routes";
import { parametrizedRoutes } from "../../routes/constants";
import { gray500, primary500 } from "../../theme";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { EmptyTemplate } from "./EmptyTemplate";
import { messages } from "./messages";

const EmptyFeedbacks = () => {
  const msg = useMsg();
  return (
    <EmptyTemplate
      title={msg("feedback.list.empty.title")}
      description={msg("feedback.list.empty.description")}
      iconName="DescriptionOutlined"
      button={{
        variant: "contained",
        children: msg("feedback.list.empty.create-btn"),
        href: routes.createFeedbackForm,
      }}
    />
  );
};

const useDeleteFeedbackMutation = (params = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedback }) =>
      authFetch({
        method: "DELETE",
        url: `/api/latest/feedback/${feedback.id}`,
      }),
    ...params,
    onSuccess: () => {
      queryClient.invalidateQueries({ exact: false, queryKey: ["feedback"] });
    },
  });
};

const FeedbackListCard = ({ feedback }) => {
  const { id, title, createdAt, recipients } = feedback;
  const deleteFeedbackMutation = useDeleteFeedbackMutation();

  const msg = useMsg();
  const { i18n } = useContext(I18nContext);
  const parsed = i18n.parseUTCLocal(createdAt);
  const formattedDate = i18n.formatLocalMaybe(parsed, "P");

  const txtSx = { fontSize: 16, fontWeight: 500 };

  return (
    <Card sx={{ mb: 3 }}>
      <CardActionArea
        sx={{ height: "100%" }}
        href={parametrizedRoutes.feedbackResults({ id })}
      >
        <CardContent sx={{ p: 3, display: "flex", flexFlow: "column", gap: 3 }}>
          <H1 sx={{ mb: -2, color: primary500 }}>{title}</H1>
          <P sx={{ ...txtSx, color: gray500 }}>
            {msg("feedback.list.card.created-at", { createdAt: formattedDate })}
          </P>
          {/* <P sx={{...txtSx, color: "black"}}>{msg("feedback.list.card.responses-count", { responsesCount })}</P> */}
          <P sx={{ ...txtSx, color: "black" }}>
            {msg("feedback.list.card.shared-count", {
              sharedCount: recipients.length,
            })}
          </P>
          {/* <pre>{JSON.stringify(feedback, null, 2)}</pre> */}
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteFeedbackMutation.mutate({ feedback });
              }}
              disabled={deleteFeedbackMutation.isLoading}
            >
              <Icon name="DeleteOutlined" sx={{ color: primary500 }} />
            </IconButton>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

function GetFeedbackPageInner() {
  const msg = useMsg();
  const { authFetch, user } = useAuth();
  const username = user.data.username;
  const feedbacksQuery = useMyQuery({
    /*
    [
      {
        "id": 0,
        "title": "string",
        "createdAt": "2023-11-11T20:18:53.134Z",
        "recipients": [
          {
            "id": 0,
            "username": "string",
            "submitted": true
          }
        ]
      }
    ]
    */
    queryKey: ["feedback", { username }],
    fetchDef: {
      url: `/api/latest/feedback/user/${username}`,
    },
  });

  return (
    <Layout>
      <Header
        text={msg("feedback.list.heading")}
        actionButton={{
          variant: "contained",
          children: "Create new form",
          href: routes.createFeedbackForm,
        }}
      />
      <QueryRenderer
        {...feedbacksQuery}
        success={({ data }) => {
          if (!data?.length) return <EmptyFeedbacks />;
          else
            return data.map((feedback) => (
              <FeedbackListCard key={feedback.id} feedback={feedback} />
            ));
        }}
      />
    </Layout>
  );
}

export function GetFeedbackPage() {
  return (
    <MsgProvider messages={messages}>
      <GetFeedbackPageInner />
    </MsgProvider>
  );
}
