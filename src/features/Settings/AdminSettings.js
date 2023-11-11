import { Add } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { prop } from "ramda";
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { TLCell, TLChipsCell } from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { formatName } from "../Coaches/CoachCard";
import { SlotChip } from "../Team/Team.page";
import { MemberAdminModal } from "./Admin/MemberAdminModal";
import { messages } from "./messages";
import { gray500 } from "../../theme";
import { useMutation, useQueryClient } from "react-query";
import { getLabel } from "../../components/Forms";
import { useUserStatusDict } from "./useUserStatusDict";

const MOCK = [
  {
    username: "coach1",
    firstName: "Mock",
    lastName: "User",
    authorities: ["COACH", "USER"],
    timeZone: "GMT",
    status: "PENDING",
    companyId: 2,
    companyName: "Company 2",
    coach: "coach1",
    coachFirstName: "Jane",
    coachLastName: "Smith",
    credit: 150,
    requestedCredit: 75,
    isTrial: true,
  },
];

const useUsersQuery = () => {
  const { authFetch } = useAuth();
  return useMyQuery({
    queryKey: ["admin", "users"],
    queryFn: () =>
      authFetch({
        url: `/api/latest/admin/users`,
        query: {
          size: 1,
          sort: "username,asc",
        },
      })
        .then(prop("content"))
        .catch(() => MOCK),
  });
};

export const useConfirmRequestedCreditMutation = ({
  onSuccess,
  ...params
} = {}) => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/admin/users/${username}/confirm-requested-credits`,
        data: {},
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin"], exact: false });
      onSuccess?.(data);
    },
    ...params,
  });
};

function AdminSettingsInner() {
  const [user, setUser] = useState();
  const msg = useMsg();
  const { userStatusOptions } = useUserStatusDict();

  const usersQuery = useUsersQuery();
  const confirmCreditMutation = useConfirmRequestedCreditMutation({});

  const columns = [
    {
      label: msg("settings.admin.table.col.name"),
      key: "name",
      render: (row) => (
        <TLCell
          avatar
          component="th"
          scope="row"
          name={formatName(row) || "-"}
          sub={row.username}
        />
      ),
    },
    {
      label: msg("settings.admin.table.col.companyName"),
      key: "companyName",
      render: (row) => (
        <TLCell variant="emphasized" name={row.companyName || "-"} />
      ),
    },
    {
      label: msg("settings.admin.table.col.role"),
      key: "role",
      render: (row) => (
        <TLCell variant="lighter" name={row.authorities.join(", ")} />
      ),
    },
    {
      label: msg("settings.admin.table.col.coach"),
      key: "coach",
      render: ({ coachFirstName, coachLastName, coach }) =>
        [coachFirstName, coachLastName, coach].some(Boolean) ? (
          <TLCell
            avatar
            component="th"
            scope="row"
            name={formatName({
              firstName: coachFirstName ?? "",
              lastName: coachLastName ?? "",
            })}
            sub={coach ?? ""}
          />
        ) : (
          <TLCell component="th" scope="row" name={"-"} />
        ),
    },
    {
      label: msg("settings.admin.table.col.hrs"),
      key: "hrs",
      render: (row) => (
        <TLCell variant="lighter" name={row.hrs?.join?.(", ") ?? "-"} />
      ),
    },
    {
      label: msg("settings.admin.table.col.requestedBy"),
      key: "requestedBy",
      render: (row) => (
        <TLCell variant="lighter" name={row.requestedBy ?? "-"} />
      ),
    },
    {
      label: msg("settings.admin.table.col.remainingCredits"),
      key: "remainingCredits",
      render: (row) => <TLCell variant="emphasized" name={row.credit} />,
    },
    {
      label: msg("settings.admin.table.col.paidCredit"),
      key: "paidCredit",
      render: (row) => <TLCell variant="emphasized" name={row.paidCredit} />,
    },
    {
      label: msg("settings.admin.table.col.requestedCredits"),
      key: "requestedCredits",
      render: (row) => (
        <TLCell
          variant="emphasized"
          name={row.requestedCredit}
          // after={
          //   row.requestedCredit ? (
          //     <Button
          //       disabled={confirmCreditMutation.isLoading}
          //       variant="outlined"
          //       onClick={() => confirmCreditMutation.mutate(row)}
          //     >
          //       {msg("settings.admin.table.confirm-credit-button.label")}
          //     </Button>
          //   ) : null
          // }
        >
          {row.requestedCredit ? (
            <Button
              sx={{ ml: 1 }}
              disabled={confirmCreditMutation.isLoading}
              variant="outlined"
              onClick={() => confirmCreditMutation.mutate(row)}
            >
              {msg("settings.admin.table.confirm-credit-button.label")}
            </Button>
          ) : null}
        </TLCell>
      ),
    },
    {
      label: msg("settings.admin.table.col.status"),
      key: "status",
      render: (row) => {
        const chips = [].concat(row.status || []).map(
          (status) =>
            userStatusOptions.find((option) => option.value === status) || {
              label: status,
            }
        );
        return <TLChipsCell chips={chips} />;
      },
    },
    {
      label: msg("settings.admin.table.col.action"),
      key: "action",
      render: (row) => (
        <TLCell>
          <Tooltip
            title={msg("settings.admin.table.edit.tooltip")}
            placement="top"
          >
            <IconButton sx={{ color: gray500 }} onClick={() => setUser(row)}>
              <Icon name="BorderColorOutlined" />
            </IconButton>
          </Tooltip>
        </TLCell>
      ),
    },
  ];

  console.log("[AdminSettings.page]", { usersQuery });

  return (
    <>
      <TLTableWithHeader
        sx={
          {
            // position: "fixed", // TODO
            // left: `${downMd ? 88 + 32 : 256 + 32}px`,
            // right: 32,
          }
        }
        title={
          <Box sx={{ display: "inline-flex", alignItems: "baseline" }}>
            <H2>
              <Msg id="settings.admin.title" />
            </H2>
            <SlotChip sx={{ display: "inline-flex", p: 0.75, ml: 4 }}>
              <Msg
                id="settings.admin.title.count.badge"
                values={{ count: usersQuery.data?.length }}
              />
            </SlotChip>
          </Box>
        }
        subheader={
          <P mt={1.5}>
            <Msg id="settings.admin.sub" />
          </P>
        }
        columns={columns}
        query={usersQuery}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            aria-label="add member"
            onClick={() => {
              setUser({});
            }}
          >
            <Msg id="settings.admin.add" />
          </Button>
        }
      />
      {/* <CreditTopUpModal
        selected={topUpSelected}
        onClose={() => setTopUpSelected(null)}
      />
    */}
      <MemberAdminModal
        open={!!user}
        initialValues={user}
        onClose={() => setUser(false)}
      />
    </>
  );
}

export function AdminSettings() {
  return (
    <MsgProvider messages={messages}>
      <AdminSettingsInner />
    </MsgProvider>
  );
}
