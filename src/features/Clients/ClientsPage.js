import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { defineMessages } from "react-intl";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { SlotChip, TLCell, TLTableWithHeader } from "../Team/Team.page";
import { useAuth } from "../Authorization";
import { LinkBehavior } from "../../components/LinkBehavior";
import { routes } from "../../routes";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { LoadingButton } from "@mui/lab";

const messages = defineMessages({
  "clients.heading": {
    id: "clients.heading",
    defaultMessage: "Clients",
  },
  "clients.title": {
    id: "clients.title",
    defaultMessage: "Clients",
  },
  "clients.title.count.badge": {
    id: "clients.title.count.badge",
    defaultMessage: "{count} Clients",
  },
  "clients.sub": {
    id: "clients.sub",
    defaultMessage: "Here you can see the list of your current clients",
  },
  "clients.add": {
    id: "clients.add",
    defaultMessage: "Add member",
  },
  "clients.table.col.name": {
    id: "clients.table.col.name",
    defaultMessage: "Name",
  },
  "clients.table.col.lastSession": {
    id: "clients.table.col.lastSession",
    defaultMessage: "Last session",
  },
  "clients.table.col.nextSession": {
    id: "clients.table.col.nextSession",
    defaultMessage: "Next session",
  },
  "clients.table.col.action": {
    id: "clients.table.col.action",
    defaultMessage: "Action",
  },
  "clients.table.action.contact": {
    id: "clients.table.action.contact",
    defaultMessage: "Contact client",
  },
  "clients.table.action.decline": {
    id: "clients.table.action.decline",
    defaultMessage: "Decline client",
  },
  "clients.decline.title": {
    id: "clients.decline.title",
    defaultMessage: "Are you sure you want to decline {name}?",
  },
  "clients.decline.yes": {
    id: "clients.decline.yes",
    defaultMessage: "Yes, decline",
  },
  "clients.decline.no": {
    id: "clients.decline.no",
    defaultMessage: "No, cancel",
  },
});

const useClientsQuery = ({ ...queryParams } = {}) => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["coach-clients"],
    queryFn: () => authFetch({ url: `/api/latest/coach-clients` }),
    select: (data) => {
      return data.map((user) => {
        //  {
        // "username": "slavik.dan12@gmail.com",
        // "firstName": "",
        // "lastName": "",
        // "lastSession": "2023-09-26T14:00:00",
        // "nextSession": "2023-10-02T09:00:00"
        // };
        return {
          name: `${user?.firstName} ${user?.lastName}`,
          username: user.username,
          lastSession: user.lastSession,
          nextSession: user.nextSession,
        };
      });
    },
    ...queryParams,
  });
};

export const useDeclineMutation = (mutationParams = {}) => {
  const { authFetch, fetchUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username }) =>
      authFetch({
        method: "DELETE",
        url: `/api/latest/coach-clients/${username}`,
      }),
    ...mutationParams,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["coach-clients"]); // TODO: test
      mutationParams?.onSuccess?.(data);
    },
  });
};

function ClientsPageInner() {
  const [addMemberVisible, setAddMemberVisible] = useState();
  const [declineMemberVisible, setDeclineMemberVisible] = useState();
  const msg = useMsg({ dict: messages });

  const query = useClientsQuery({});
  const declineMutation = useDeclineMutation({
    onSuccess: () => {
      setDeclineMemberVisible();
    },
  });

  const columns = [
    {
      label: msg("clients.table.col.name"),
      key: "name",
      render: (row) => (
        <TLCell component="th" scope="row" name={row.name} sub={row.username} />
      ),
    },
    {
      label: msg("clients.table.col.lastSession"),
      key: "lastSession",
      render: (row) => <TLCell>{row.lastSession}</TLCell>,
    },
    {
      label: msg("clients.table.col.nextSession"),
      key: "nextSession",
      render: (row) => <TLCell>{row.nextSession}</TLCell>,
    },
    {
      label: msg("clients.table.col.action"),
      key: "action",
      render: (row) => (
        <TLCell>
          <Button
            sx={{ bgcolor: "white" }}
            variant="outlined"
            component={LinkBehavior}
            href={routes.messages}
            state={{ messagesFrom: row.username }}
          >
            {msg("clients.table.action.contact")}
          </Button>
          <Button
            sx={{ ml: 2, bgcolor: "white" }}
            variant="outlined"
            component={LinkBehavior}
            color="error"
            onClick={() => {
              setDeclineMemberVisible(row);
            }}
          >
            {msg("clients.table.action.decline")}
          </Button>
        </TLCell>
      ),
    },
  ];

  console.log("[Clients.page]", { query });

  return (
    <Layout>
      <Header text={msg("clients.heading")} />
      <TLTableWithHeader
        title={
          <Box sx={{ display: "inline-flex", alignItems: "baseline" }}>
            <H2>
              <Msg id="clients.title" />
            </H2>
            <SlotChip sx={{ display: "inline-flex", p: 0.75, ml: 4 }}>
              <Msg
                id="clients.title.count.badge"
                values={{ count: query.data?.length }}
              />
            </SlotChip>
          </Box>
        }
        subheader={
          <P mt={1.5}>
            <Msg id="clients.sub" />
          </P>
        }
        columns={columns}
        query={query}
        action={
          <Button
            disabled // TODO
            variant="contained"
            startIcon={<Add />}
            aria-label="add member"
            onClick={() => {
              setAddMemberVisible(true);
            }}
          >
            <Msg id="clients.add" />
          </Button>
        }
      />
      {/* <AddMemberModal // TODO
        open={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
      /> */}
      <ConfirmModal
        open={!!declineMemberVisible}
        onClose={() => setDeclineMemberVisible()}
        iconName="RocketLaunch"
        title={msg("clients.decline.title", {
          name: declineMemberVisible?.name,
        })}
        desc={""}
        buttons={[
          {
            variant: "outlined",
            type: "button",
            children: msg("clients.decline.no"),
            onClick: () => setDeclineMemberVisible(),
          },
          {
            component: LoadingButton,
            variant: "contained",
            type: "button",
            children: msg("clients.decline.yes"),
            disabled: declineMutation.isLoading,
            loading: declineMutation.isLoading,
            onClick: () => declineMutation.mutate(declineMemberVisible),
          },
        ]}
        sx={{ width: "800px" }}
      />
    </Layout>
  );
}

export function ClientsPage() {
  return (
    <MsgProvider messages={messages}>
      <ClientsPageInner />
    </MsgProvider>
  );
}
