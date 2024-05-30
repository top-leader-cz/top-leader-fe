import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { map, omit, pipe, prop, reject } from "ramda";
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
import { useCreditRequestMutation, useHrUsersQuery } from "./api";
import { messages } from "./messages";
import { ShowMore, formatName } from "../Coaches/CoachCard";
import { expandedRowRenderAoDLTG } from "../MyTeam/MyTeam";

const getKey = (button) =>
  button.key || JSON.stringify(omit(["children"], button));

export const ActionsCell = ({ buttons = [], ...props }) => {
  const renderButton = ({ Component = Button, ...button }) => (
    <Component key={getKey(button)} {...button} />
  );
  const render = (button) =>
    button.tooltip ? (
      <ErrorBoundary key={getKey(button)}>
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
        {pipe(reject(prop("hidden")), map(render))(buttons)}
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
  const { isHR, isAdmin, isCoach } = useAuth();

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
    //   label: msg("team.members.table.col.longTermGoal"),
    //   key: "longTermGoal",
    //   render: (row) => <TLCell align="right">{row.longTermGoal}</TLCell>,
    // },
    // {
    //   label: msg("team.members.table.col.areaOfDevelopment"),
    //   key: "areaOfDevelopment",
    //   render: (row) => (
    //     <TLCell align="right">
    //       <ShowMore maxChars={25} text={row.areaOfDevelopment?.join(", ")} />
    //     </TLCell>
    //   ),
    // },
    // {
    //   label: msg("team.members.table.col.strengths"),
    //   key: "strengths",
    //   render: (row) => (
    //     <TLCell align="right">
    //       <ShowMore maxChars={25} text={row.strengths?.join(", ")} />
    //     </TLCell>
    //   ),
    // },
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
              key: 1,
              variant: "outlined",
              onClick: () => setTopUpSelected(row),
              children: msg("team.credit.topup"),
            },
            {
              key: 2,
              tooltip: msg("settings.admin.table.edit.tooltip"),
              Component: IconButton,
              onClick: () => setMember(row),
              children: <Icon name="BorderColorOutlined" />,
              hidden: isCoach,
              sx: { color: gray500 },
            },
          ]}
        />
      ),
    },
  ];
  const mutation = useCreditRequestMutation({
    onSuccess: () => {
      setTopUpSelected(null);
    },
  });

  console.log("[Team->Credits.page]", { hrUsersQuery, isHR, isAdmin });
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
    <Layout header={{ heading: msg("team.heading") }}>
      <TLTableWithHeader
        {...manageUsersProps}
        {...{ expandedRowRender: expandedRowRenderAoDLTG }}
        columns={columns}
        query={hrUsersQuery}
      />
      <CreditTopUpModal
        open={!!topUpSelected}
        onClose={() => setTopUpSelected(null)}
        mutation={mutation}
        extraParams={{ username: topUpSelected?.username }}
      />
      <AddMemberModal
        open={!!member}
        username={member?.username}
        onClose={() => setMember()}
      />
      <Box sx={{ pb: 3 }} />
    </Layout>
  );
}

export const withTeamMessages = (Component) => (props) => {
  return (
    <MsgProvider messages={messages}>
      <Component {...props} />
    </MsgProvider>
  );
};

export const TeamPage = withTeamMessages(TeamPageInner);
