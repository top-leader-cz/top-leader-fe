import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { LinkBehavior } from "../../components/LinkBehavior";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { SlotChip, TLCell, TLTableWithHeader } from "../Team/Team.page";
import { useClientsQuery, useDeclineMutation } from "./api";
import { clientsMessages } from "./messages";

function ClientsPageInner() {
  const [addMemberVisible, setAddMemberVisible] = useState();
  const [declineMemberVisible, setDeclineMemberVisible] = useState();
  const msg = useMsg({ dict: clientsMessages });

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
    <MsgProvider messages={clientsMessages}>
      <ClientsPageInner />
    </MsgProvider>
  );
}
