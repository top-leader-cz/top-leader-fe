import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { Header } from "../../components/Header";
import { Layout, LayoutCtx } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { TLCell } from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
// import { AddMemberModal } from "./AddMemberModal";
// import { CreditTopUpModal } from "./CreditTopUpModal";
import { messages } from "./messages";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { SlotChip } from "../Team/Team.page";
import { prop } from "ramda";
import { formatName } from "../Coaches/CoachCard";

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

function AdminSettingsInner() {
  //   const [topUpSelected, setTopUpSelected] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const msg = useMsg();

  const usersQuery = useUsersQuery();

  const columns = [
    {
      label: msg("settings.admin.table.col.name"),
      key: "name",
      render: (row) => (
        <TLCell
          avatar
          component="th"
          scope="row"
          name={formatName(row)}
          sub={row.username}
        />
      ),
    },
    {
      label: msg("settings.admin.table.col.companyName"),
      key: "companyName",
      render: (row) => <TLCell variant="emphasized" name={row.companyName} />,
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
      render: (row) => (
        <TLCell
          avatar
          component="th"
          scope="row"
          name={formatName({
            firstName: row.coachFirstName,
            lastName: row.coachLastName,
          })}
          sub={row.coach}
        />
      ),
    },
    {
      label: msg("settings.admin.table.col.remainingCredits"),
      key: "remainingCredits",
      render: (row) => <TLCell variant="emphasized" name={row.credit} />,
    },
    {
      label: msg("settings.admin.table.col.requestedCredits"),
      key: "requestedCredits",
      render: (row) => (
        <TLCell variant="emphasized" name={row.requestedCredit} />
      ),
    },
    {
      label: msg("settings.admin.table.col.status"),
      key: "status",
      render: (row) => (
        <TLCell
          variant="emphasized"
          name={`${row.isTrial ? "trial user - " : ""}${row.status}`}
        />
      ),
    },
    // {
    //   label: msg("settings.admin.table.col.action"),
    //   key: "action",
    //   render: (row) => (
    //     <TLCell>
    //       <Button variant="outlined" onClick={() => setTopUpSelected(row)}>
    //         {msg("team.credit.topup")}
    //       </Button>
    //     </TLCell>
    //   ),
    // },
  ];

  const { downMd } = useContext(LayoutCtx);
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
              setAddMemberVisible(true);
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
      <AddMemberModal
        open={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
      /> */}
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
