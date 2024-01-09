import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { Icon } from "../../components/Icon";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import {
  TLCell,
  TLChipsCell,
  UserCell,
} from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { gray500 } from "../../theme";
import { Authority } from "../Authorization/AuthProvider";
import { formatName, getCoachPhotoUrl } from "../Coaches/CoachCard";
import { SlotChip } from "../Team/Team.page";
import { MemberAdminModal } from "./Admin/MemberAdminModal";
import {
  useAdminDeleteUserMutation,
  useConfirmRequestedCreditMutation,
  useUsersQuery,
} from "./Admin/api";
import { messages } from "./messages";
import { useUserStatusDict } from "./useUserStatusDict";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { generalMessages } from "../../components/messages";
import { LoadingButton } from "@mui/lab";

function AdminSettingsInner() {
  const [user, setUser] = useState();
  const [deleteUsername, setDeleteUsername] = useState();
  const msg = useMsg();
  const generalMsg = useMsg({ dict: generalMessages });
  const { userStatusOptions } = useUserStatusDict();

  const usersQuery = useUsersQuery();
  const confirmCreditMutation = useConfirmRequestedCreditMutation({});
  const deleteMutation = useAdminDeleteUserMutation({
    onSuccess: () => setDeleteUsername(),
  });

  ConfirmModal.useModal(
    useMemo(() => {
      return {
        open: !!deleteUsername,
        iconName: "DeleteOutlined",
        title: `${generalMsg("general.delete")} ${deleteUsername}?`,
        desc: "",
        error: deleteMutation.error,
        onClose: () => setDeleteUsername(),
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
            children: generalMsg("general.delete"),
            disabled: deleteMutation.isLoading,
            loading: deleteMutation.isLoading,
            onClick: () => deleteMutation.mutate({ username: deleteUsername }),
          },
        ],
      };
    }, [deleteMutation, deleteUsername, generalMsg])
  );

  const columns = [
    {
      label: msg("settings.admin.table.col.name"),
      key: "name",
      render: (row) => (
        <TLCell
          avatar
          // avatar={row.authorities?.includes(Authority.COACH)}
          avatarSrc={
            row.authorities?.includes(Authority.COACH)
              ? getCoachPhotoUrl(row.username)
              : undefined
          }
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
      render: ({ coachFirstName, coachLastName, coach }) => (
        <UserCell
          email={coach}
          firstName={coachFirstName}
          lastName={coachLastName}
          avatarSrc={getCoachPhotoUrl(coach)}
        />
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
    // {
    //   label: msg("settings.admin.table.col.scheduledCredit"),
    //   key: "scheduledCredit",
    //   render: (row) => <TLCell align="right">{row.scheduledCredit}</TLCell>,
    // },
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
      label: msg("settings.admin.table.col.sumRequestedCredit"),
      key: "sumRequestedCredit",
      render: (row) => (
        <TLCell variant="emphasized" name={row.sumRequestedCredit} />
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
          <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
            <Tooltip
              title={msg("settings.admin.table.edit.tooltip")}
              placement="top"
            >
              <IconButton sx={{ color: gray500 }} onClick={() => setUser(row)}>
                <Icon name="BorderColorOutlined" />
              </IconButton>
            </Tooltip>
            <Tooltip title={generalMsg("general.delete")} placement="top">
              <IconButton
                sx={{ color: "error.main" }}
                onClick={() => {
                  setDeleteUsername(row.username);
                }}
              >
                <Icon name="DeleteOutlined" />
              </IconButton>
            </Tooltip>
          </Box>
        </TLCell>
      ),
    },
  ];

  console.log("[AdminSettings.page]", {
    usersQuery,
    deleteUsername,
    deleteMutation,
  });

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
            startIcon={<Icon name="Add" />}
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
