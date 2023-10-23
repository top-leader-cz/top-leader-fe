import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { TLCell } from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { AddMemberModal } from "./AddMemberModal";
import { CreditTopUpModal } from "./CreditTopUpModal";
import { useHrUsersQuery } from "./api";
import { messages } from "./messages";

export const SlotChip = ({ children, sx }) => {
  return (
    <Box
      borderRadius="6px"
      bgcolor={"#F9F8FF"}
      color={"primary.main"}
      fontWeight={500}
      sx={sx}
    >
      {children}
    </Box>
  );
};

const rows = [
  {
    name: "Marty Schinner",
    email: "marty.schinner@gmail.com",
    coach: "Frank Bogish",
    creditPaid: 1200,
    creditRemaining: 800,
  },
  {
    name: "Ella Romaguera",
    email: "ella.romaguera@gmail.com",
    coach: "Gerardo Feil",
    creditPaid: 1200,
    creditRemaining: 1000,
  },
];

function TeamPageInner() {
  const [topUpSelected, setTopUpSelected] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const msg = useMsg();

  const hrUsersQuery = useHrUsersQuery();

  const columns = [
    {
      label: msg("team.members.table.col.name"),
      key: "name",
      render: (row) => (
        <TLCell component="th" scope="row" name={row.name} sub={row.username} />
      ),
    },
    {
      label: msg("team.members.table.col.coach"),
      key: "coach",
      render: (row) => <TLCell name={row.coach} />,
    },
    {
      label: msg("team.members.table.col.paid"),
      key: "paid",
      render: (row) => <TLCell align="right">{row.creditPaid}</TLCell>,
    },
    {
      label: msg("team.members.table.col.remaining"),
      key: "remaining",
      render: (row) => <TLCell align="right">{row.creditRemaining}</TLCell>,
    },
    {
      label: msg("team.members.table.col.action"),
      key: "action",
      render: (row) => (
        <TLCell>
          <Button variant="outlined" onClick={() => setTopUpSelected(row)}>
            {msg("team.credit.topup")}
          </Button>
        </TLCell>
      ),
    },
  ];

  // console.log("[Team->Credits.page]", { hrUsersQuery });

  return (
    <Layout>
      <Header text={msg("team.heading")} />
      <TLTableWithHeader
        title={
          <Box sx={{ display: "inline-flex", alignItems: "baseline" }}>
            <H2>
              <Msg id="team.members.title" />
            </H2>
            <SlotChip sx={{ display: "inline-flex", p: 0.75, ml: 4 }}>
              <Msg
                id="team.members.title.count.badge"
                values={{ count: hrUsersQuery.data?.length }}
              />
            </SlotChip>
          </Box>
        }
        subheader={
          <P mt={1.5}>
            <Msg id="team.members.sub" />
          </P>
        }
        columns={columns}
        query={hrUsersQuery}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            aria-label="add member"
            onClick={() => {
              setAddMemberVisible(true);
            }}
          >
            <Msg id="team.members.add" />
          </Button>
        }
      />
      <CreditTopUpModal
        selected={topUpSelected}
        onClose={() => setTopUpSelected(null)}
      />
      <AddMemberModal
        open={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
      />
    </Layout>
  );
}

export function TeamPage() {
  return (
    <MsgProvider messages={messages}>
      <TeamPageInner />
    </MsgProvider>
  );
}
