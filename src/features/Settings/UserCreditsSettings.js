import { useState } from "react";
import { useMsg } from "../../components/Msg/Msg";
import { TLCell, TLTableWithHeader } from "../../components/Table";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { ActionsCell } from "../Team/Team.page";
import { messages as teamMessages } from "../Team/messages";
import { CreditTopUpModal } from "../Team/CreditTopUpModal";
import { of, pick } from "ramda";
import { H2 } from "../../components/Typography";

const useUserCreditsQuery = (params = {}) => {
  return useMyQuery({
    queryKey: ["user-credits"],
    fetchDef: { url: "/api/latest/user-credits", to: of(Array) },
    ...params,
  });
};

export const useUserCreditsMutation = (rest = {}) => {
  return useMyMutation({
    fetchDef: {
      method: "POST",
      url: "/api/latest/user-credits",
      from: pick(["credit"]),
    },
    invalidate: [{ queryKey: ["hr-users"] }, { queryKey: ["user-credits"] }],
    ...rest,
  });
};

export const UserCreditsSettings = () => {
  const msg = useMsg();
  const teamMsg = useMsg({ dict: teamMessages });
  const [topUpSelected, setTopUpSelected] = useState(false);
  const userCreditsQuery = useUserCreditsQuery();
  const mutation = useUserCreditsMutation({
    onSuccess: () => {
      setTopUpSelected(null);
    },
  });

  const columns = [
    // {
    //   label: teamMsg("team.members.table.col.name"),
    //   key: "name",
    //   render: (row) => <UserCell email={row.username} name={formatName(row)} />,
    // },
    // {
    //   label: teamMsg("team.members.table.col.coach"),
    //   key: "coach",
    //   render: (row) => (
    //     <UserCell
    //       email={row.coach}
    //       name={formatName({
    //         firstName: row.coachFirstName,
    //         lastName: row.coachLastName,
    //       })}
    //     />
    //   ),
    // },
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
    //   label: teamMsg("team.members.table.col.all"),
    //   key: "all",
    //   render: (row) => <TLCell align="right">{row.sumRequestedCredit}</TLCell>,
    // },
    {
      label: teamMsg("team.members.table.col.action"),
      key: "action",
      render: (row) => (
        <ActionsCell
          buttons={[
            {
              key: 1,
              variant: "outlined",
              onClick: () => setTopUpSelected(true),
              children: teamMsg("team.credit.topup"),
            },
            // {
            //   key: 2,
            //   tooltip: teamMsg("settings.admin.table.edit.tooltip"),
            //   Component: IconButton,
            //   onClick: () => setMember(row),
            //   children: <Icon name="BorderColorOutlined" />,
            //   hidden: isCoach,
            //   sx: { color: gray500 },
            // },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TLTableWithHeader
        title={<H2>{msg("settings.tabs.credits.label")}</H2>}
        columns={columns}
        query={userCreditsQuery}
      />
      <CreditTopUpModal
        open={!!topUpSelected}
        mutation={mutation}
        onClose={() => setTopUpSelected(null)}
      />
    </>
  );
};
