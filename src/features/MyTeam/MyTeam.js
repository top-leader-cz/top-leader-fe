import { Box, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { useMsg } from "../../components/Msg/Msg";
import { TLCell, UserCell } from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { gray500 } from "../../theme";
import { useAuth } from "../Authorization";
import { formatName } from "../Coaches/CoachCard";
import { ActionsCell, SlotChip } from "../Team/Team.page";
import { messages } from "../Team/messages";
import { useMyQuery } from "../Authorization/AuthProvider";
import { always } from "ramda";

export const useManagerTeamQuery = (rest = {}) =>
  useMyQuery({
    queryKey: ["managerTeam"],
    fetchDef: { url: ``, to: always([]) },
    ...rest,
  });

export function MyTeamPage() {
  //   const [topUpSelected, setTopUpSelected] = useState(false);
  const [member, setMember] = useState();
  const teamMsg = useMsg({ dict: messages });
  const { isHR, isAdmin, isCoach } = useAuth();

  const usersQuery = useManagerTeamQuery();

  const columns = [
    {
      label: teamMsg("team.members.table.col.name"),
      key: "name",
      render: (row) => <UserCell email={row.username} name={formatName(row)} />,
    },
    {
      label: teamMsg("team.members.table.col.coach"),
      key: "coach",
      render: (row) => (
        <UserCell
          email={row.coach}
          name={formatName({
            firstName: row.coachFirstName,
            lastName: row.coachLastName,
          })}
        />
      ),
    },
    {
      label: teamMsg("team.members.table.col.paid"),
      key: "paid",
      render: (row) => <TLCell align="right">{row.paidCredit}</TLCell>,
    },
    {
      label: teamMsg("team.members.table.col.remaining"),
      key: "remaining",
      render: (row) => <TLCell align="right">{row.credit}</TLCell>,
    },
    {
      label: teamMsg("team.members.table.col.requested"),
      key: "requested",
      render: (row) => <TLCell align="right">{row.requestedCredit}</TLCell>,
    },
    {
      label: teamMsg("team.members.table.col.scheduled"),
      key: "scheduled",
      render: (row) => <TLCell align="right">{row.scheduledCredit}</TLCell>,
    },

    // {
    //   label: teamMsg("team.members.table.col.action"),
    //   key: "action",
    //   render: (row) => (
    //     <ActionsCell
    //       buttons={[
    //         {
    //           key: 1,
    //           variant: "outlined",
    //           onClick: () => setTopUpSelected(row),
    //           children: teamMsg("team.credit.topup"),
    //         },
    //         {
    //           key: 2,
    //           tooltip: teamMsg("settings.admin.table.edit.tooltip"),
    //           Component: IconButton,
    //           onClick: () => setMember(row),
    //           children: <Icon name="BorderColorOutlined" />,
    //           hidden: isCoach,
    //           sx: { color: gray500 },
    //         },
    //       ]}
    //     />
    //   ),
    // },
  ];
  //   const mutation = useCreditRequestMutation({
  //     onSuccess: () => {
  //       setTopUpSelected(null);
  //     },
  //   });

  console.log("[MyTeam.page]", { usersQuery, isHR, isAdmin });

  return (
    <Layout header={{ heading: teamMsg("team.heading") }}>
      <TLTableWithHeader
        {...{
          title: (
            <Box sx={{ display: "inline-flex", alignItems: "baseline" }}>
              <H2>{teamMsg("team.members.title")}</H2>
              <SlotChip sx={{ display: "inline-flex", p: 0.75, ml: 4 }}>
                {teamMsg("team.members.title.count.badge", {
                  count: usersQuery.data?.length,
                })}
              </SlotChip>
            </Box>
          ),
          subheader: <P mt={1.5}>{teamMsg("team.members.sub")}</P>,
          action: (
            <Button
              variant="contained"
              startIcon={<Icon name="Add" />}
              aria-label="add member"
              onClick={() => {
                setMember({});
              }}
            >
              {teamMsg("team.members.add")}
            </Button>
          ),
          columns,
          query: usersQuery,
        }}
      />
      {/* <CreditTopUpModal
        open={!!topUpSelected}
        onClose={() => setTopUpSelected(null)}
        mutation={mutation}
        extraParams={{ username: topUpSelected?.username }}
      /> */}
      {/* <AddMemberModal
        open={!!member}
        username={member?.username}
        onClose={() => setMember()}
      /> */}
      <Box sx={{ pb: 3 }} />
    </Layout>
  );
}
