import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { omit } from "ramda";
import { useState } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import {
  StyledTableCell,
  TLCell,
  UserCell,
} from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { gray500 } from "../../theme";
import { useAuth } from "../Authorization";
import { AddMemberModal } from "./AddMemberModal";
import { CreditTopUpModal } from "./CreditTopUpModal";
import { useHrUsersQuery } from "./api";
import { messages } from "./messages";
import { formatName } from "../Coaches/CoachCard";

export const ActionsCell = ({ buttons = [], ...props }) => {
  const renderButton = ({ Component = Button, ...button }) => (
    <Component
      key={button.key || JSON.stringify(omit(["children"], button))}
      {...button}
    />
  );
  const render = (button) =>
    button.tooltip ? (
      <ErrorBoundary>
        <Tooltip title={button.tooltip}>{renderButton(button)}</Tooltip>
      </ErrorBoundary>
    ) : (
      renderButton(button)
    );

  return (
    <StyledTableCell {...props}>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        justifyContent={"space-between"}
        gap={2}
      >
        {buttons.map(render)}
      </Box>
    </StyledTableCell>
  );
};

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

function TeamPageInner() {
  const [topUpSelected, setTopUpSelected] = useState(false);
  const [member, setMember] = useState();
  const msg = useMsg();
  const { isHR, isAdmin } = useAuth();

  const hrUsersQuery = useHrUsersQuery();

  const columns = [
    {
      label: msg("team.members.table.col.name"),
      key: "name",
      render: (row) => <UserCell email={row.username} name={formatName(row)} />,
    },
    {
      label: msg("team.members.table.col.coach"),
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
      label: msg("team.members.table.col.paid"),
      key: "paid",
      render: (row) => <TLCell align="right">{row.paidCredit}</TLCell>,
    },
    {
      label: msg("team.members.table.col.remaining"),
      key: "remaining",
      render: (row) => <TLCell align="right">{row.credit}</TLCell>,
    },
    {
      label: msg("team.members.table.col.requested"),
      key: "requested",
      render: (row) => <TLCell align="right">{row.requestedCredit}</TLCell>,
    },
    {
      label: msg("team.members.table.col.scheduled"),
      key: "scheduled",
      render: (row) => <TLCell align="right">{row.scheduledCredit}</TLCell>,
    },
    // {
    //   label: msg("team.members.table.col.all"),
    //   key: "all",
    //   render: (row) => <TLCell align="right">{row.sumRequestedCredit}</TLCell>,
    // },
    {
      label: msg("team.members.table.col.action"),
      key: "action",
      render: (row) => (
        <ActionsCell
          buttons={[
            {
              variant: "outlined",
              onClick: () => setTopUpSelected(row),
              children: msg("team.credit.topup"),
            },
            {
              tooltip: msg("settings.admin.table.edit.tooltip"),
              Component: IconButton,
              onClick: () => console.log("mmm", { row }) || setMember(row),
              children: <Icon name="BorderColorOutlined" />,
              sx: { color: gray500 },
            },
          ]}
        />
      ),
    },
  ];

  console.log("[Team->Credits.page]", { hrUsersQuery });
  const manageUsersProps =
    isHR || isAdmin
      ? {
          title: (
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
          ),
          subheader: (
            <P mt={1.5}>
              <Msg id="team.members.sub" />
            </P>
          ),
          action: (
            <Button
              variant="contained"
              startIcon={<Icon name="Add" />}
              aria-label="add member"
              onClick={() => {
                setMember({});
              }}
            >
              <Msg id="team.members.add" />
            </Button>
          ),
        }
      : {};

  return (
    <Layout>
      <Header text={msg("team.heading")} />
      <TLTableWithHeader
        {...manageUsersProps}
        columns={columns}
        query={hrUsersQuery}
      />
      <CreditTopUpModal
        selected={topUpSelected}
        onClose={() => setTopUpSelected(null)}
      />
      <AddMemberModal
        open={!!member}
        initialValues={member}
        onClose={() => setMember()}
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
