import { LoadingButton } from "@mui/lab";
import { Box, Button, Tooltip } from "@mui/material";
import { useCallback, useContext, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { LinkBehavior } from "../../components/LinkBehavior";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import {
  DateCell,
  StyledTableCell,
  StyledTableRow,
  TLCell,
  UserCell,
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
import { AddClientModal } from "./AddClientModal";
import {
  useClientsQuery,
  useDeclineMutation,
  useDeclineSessionMutation,
  useUpcomingCoachSessionsQuery,
} from "./api";
import { clientsMessages } from "./messages";
import { generalMessages } from "../../components/messages";

export const gray500 = "#667085";
export const gray900 = "#101828";

const ScheduledSession = ({ data, canCancel, type }) => {
  const {
    time,
    username,
    firstName,
    lastName,
    name = formatName({ firstName, lastName }),
  } = data;
  const { i18n } = useContext(I18nContext);
  const parsed = i18n.parseUTCLocal(time);
  const msg = useMsg({ dict: clientsMessages });
  const generalMsg = useMsg({ dict: generalMessages });

  const _declineSessionMutation = useDeclineSessionMutation({ type });
  const cancelMutationMaybe = canCancel ? _declineSessionMutation : undefined;
  const { show } = ConfirmModal.useModal(
    useMemo(() => {
      return {
        iconName: "RocketLaunch",
        title: msg("clients.upcoming.decline-session.confirm.title", {
          date: i18n.formatLocal(parsed, "Pp"),
          name,
          username,
        }),
        desc: "",
        // error: cancelMutationMaybe.error,
        getButtons: ({ onClose }) => [
          {
            variant: "outlined",
            type: "button",
            children: generalMsg("general.cancel"),
            onClick: () => onClose(),
          },
          {
            component: LoadingButton,
            variant: "contained",
            color: "error",
            type: "button",
            children: generalMsg("general.decline"),
            disabled: cancelMutationMaybe.isLoading,
            loading: cancelMutationMaybe.isLoading,
            onClick: () => cancelMutationMaybe.mutate(data),
          },
        ],
      };
    }, [
      cancelMutationMaybe,
      data,
      generalMsg,
      i18n,
      msg,
      name,
      parsed,
      username,
    ])
  );

  const renderCancelButton = () => {
    if (!cancelMutationMaybe) return null;
    return (
      <LoadingButton
        // size="small"
        sx={{ ml: 2, bgcolor: "white" }}
        variant="outlined"
        color="error"
        onClick={() => show()}
        loading={cancelMutationMaybe.isLoading}
      >
        {msg("clients.upcoming.decline-session")}
      </LoadingButton>
    );
  };
  const cancelButton = cancelMutationMaybe?.error ? (
    <Tooltip
      title={cancelMutationMaybe.error?.message}
      placement="top"
      // sx={{ color: "red" }}
    >
      {renderCancelButton()}
    </Tooltip>
  ) : (
    renderCancelButton()
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          flexGrow: 2,
        }}
      >
        {cancelButton}
      </Box>
    </Box>
  );
};

export const ScheduledSessionsTableRow = ({
  data,
  columns,
  colSpan = columns.length,
  name,
  canCancel = true,
  type, // "coach" || "user"
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
        {data.map((session) => (
          <ScheduledSession
            key={session.time + session.username}
            data={session}
            canCancel={canCancel}
            type={type}
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

  const query = useClientsQuery();
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
      render: (row) => <UserCell email={row.username} name={formatName(row)} />,
    },
    {
      label: msg("clients.table.col.lastSession"),
      key: "lastSession",
      render: (row) => <DateCell utcStr={row.lastSession} />,
    },
    {
      label: msg("clients.table.col.nextSession"),
      key: "nextSession",
      render: (row) => <DateCell utcStr={row.nextSession} />,
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
          canCancel
          type="coach"
        />
      );
    },
    [upcomingSessionsQuery.data]
  );
  ConfirmModal.useModal(
    useMemo(
      () => ({
        open: !!declineMemberVisible,
        onClose: () => setDeclineMemberVisible(),
        iconName: "RocketLaunch",
        title: msg("clients.decline.title", {
          name: declineMemberVisible?.name || declineMemberVisible?.username,
        }),
        desc: "",
        error: declineMutation.error,
        sx: { width: "800px" },
        buttons: [
          {
            variant: "outlined",
            type: "button",
            children: msg("clients.decline.no"),
            onClick: () => setDeclineMemberVisible(),
          },
          {
            component: LoadingButton,
            variant: "contained",
            color: "error",
            type: "button",
            children: msg("clients.decline.yes"),
            disabled: declineMutation.isLoading,
            loading: declineMutation.isLoading,
            onClick: () => declineMutation.mutate(declineMemberVisible),
          },
        ],
      }),
      [declineMemberVisible, declineMutation, msg]
    )
  );

  console.log("[Clients.page]", { query, declineMemberVisible });

  return (
    <Layout>
      <Header text={msg("clients.heading")} />
      <TLTableWithHeader
        headerBefore={
          <QueryRenderer
            {...upcomingSessionsQuery}
            success={({ data }) => (
              <ScheduledSessionsTableRow
                data={data}
                columns={columns}
                type="coach"
              />
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
            startIcon={<Icon name="Add" />}
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
