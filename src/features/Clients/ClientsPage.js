import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { LinkBehavior } from "../../components/LinkBehavior";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import {
  StyledTableCell,
  StyledTableRow,
  TLCell,
} from "../../components/Table";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { gray50 } from "../../theme";
import { formatName } from "../Coaches/CoachCard";
import { I18nContext } from "../I18n/I18nProvider";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { QueryRenderer } from "../QM/QueryRenderer";
import { SlotChip } from "../Team/Team.page";
import {
  useClientsQuery,
  useDeclineMutation,
  useUpcomingCoachSessionsQuery,
} from "./api";
import { clientsMessages } from "./messages";
import { AddClientModal } from "./AddClientModal";

export const gray500 = "#667085";
export const gray900 = "#101828";

export const ScheduledSession = ({ time, name, username }) => {
  const { i18n } = useContext(I18nContext);
  const parsed = i18n.parseUTCLocal(time);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        py: 2,
        gap: 2,
        borderBottom: `1px solid #EAECF0`,
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <Box display="flex" gap={1}>
        <P sx={{ fontSize: 18, color: gray900, fontWeight: 600 }}>
          {i18n.formatLocal(parsed, "PP")}
        </P>
        <P sx={{ fontSize: 18, color: gray500, fontWeight: 400 }}>
          {i18n.formatLocal(parsed, "ccc")}
        </P>
      </Box>
      <Box display="flex" gap={1}>
        <P sx={{ fontSize: 18, color: gray900, fontWeight: 600 }}>
          {i18n.formatLocal(parsed, "pppp")}
        </P>
        <P sx={{ fontSize: 18, color: gray900, fontWeight: 400 }}>
          {name || username}
        </P>
      </Box>
    </Box>
  );
};

export const ScheduledSessionsTableRow = ({
  data,
  columns,
  colSpan = columns.length,
  name,
  sx = {},
}) => {
  const msg = useMsg({ dict: clientsMessages });

  if (!data?.length) return null;

  return (
    <StyledTableRow
      sx={{ bgcolor: gray50, ...sx }}
      //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell colSpan={colSpan} variant="default">
        <H2 sx={{ fontSize: "16px" }}>
          {name
            ? msg("clients.upcoming.with-name", { name })
            : msg("clients.upcoming.all-sessions")}
        </H2>
        {data.map(({ username, firstName, lastName, time }) => (
          <ScheduledSession
            key={time + username}
            name={formatName({ firstName, lastName })}
            username={username}
            time={time}
          />
        ))}
      </StyledTableCell>
    </StyledTableRow>
  );
};

function ClientsPageInner() {
  const [addMemberVisible, setAddMemberVisible] = useState();
  const [declineMemberVisible, setDeclineMemberVisible] = useState();
  const msg = useMsg({ dict: clientsMessages });

  const query = useClientsQuery({});
  const upcomingSessionsQuery = useUpcomingCoachSessionsQuery();
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
  const expandedRowRender = useCallback(
    ({ row, columns }) => {
      if (!upcomingSessionsQuery.data) return null;
      // const rowData = upcomingSessionsQuery.data;
      const rowData = upcomingSessionsQuery.data.filter(
        ({ username }) => username === row.username
      );
      return (
        <ScheduledSessionsTableRow
          data={rowData}
          columns={columns}
          name={row.username}
        />
      );
    },
    [upcomingSessionsQuery.data]
  );

  console.log("[Clients.page]", { query });

  return (
    <Layout>
      <Header text={msg("clients.heading")} />
      <TLTableWithHeader
        headerBefore={
          <QueryRenderer
            {...upcomingSessionsQuery}
            success={({ data }) => (
              <ScheduledSessionsTableRow data={data} columns={columns} />
            )}
          />
        }
        expandedRowRender={expandedRowRender}
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
      <AddClientModal
        open={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
      />
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
