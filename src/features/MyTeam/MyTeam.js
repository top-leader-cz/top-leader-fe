import { Box } from "@mui/material";
import { prop } from "ramda";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import {
  StyledTableCell,
  StyledTableRow,
  TLCell,
  UserCell,
} from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { H2, P } from "../../components/Typography";
import { gray50 } from "../../theme";
import { useAuth } from "../Authorization";
import { useMyQuery } from "../Authorization/AuthProvider";
import { formatName } from "../Coaches/CoachCard";
import { SlotChip } from "../Team/Team.page";
import { messages } from "../Team/messages";
import { myTeamMessages } from "./messages";

export const useManagerTeamQuery = (rest = {}) =>
  useMyQuery({
    queryKey: ["my-team"],
    fetchDef: { url: "/api/latest/my-team", to: prop("content") },
    ...rest,
  });

/*
  String firstName,
  String lastName,
  String username,

  String coach,
  String coachFirstName,
  String coachLastName,

  Integer credit,
  Integer requestedCredit,
  Integer scheduledCredit,
  Integer paidCredit,

  String longTermGoal,
  List<String> areaOfDevelopment,
  List<String> strengths,
*/

const ExpandedPseudoCell = ({ text, emphasized = false }) => {
  return (
    <Box
      sx={{
        color: emphasized ? "#101828" : "#344054",
        fontWeight: emphasized ? 500 : 400,
        fontSize: 14,
        "&:not(:last-child)": { mb: 1 },
      }}
    >
      {text || <>&nbsp;</>}
    </Box>
  );
};

export const expandedRowRenderAoDLTG = ({ row, columns }) => {
  const data = [
    [
      <Msg id="team.members.table.col.areaOfDevelopment" />,
      row.areaOfDevelopment?.join?.(", "),
    ],
    [<Msg id="team.members.table.col.longTermGoal" />, row.longTermGoal],
    [
      <Msg id="team.members.table.col.strengths" />,
      row.strengths?.join?.(", "),
    ],
  ];

  // if (!data.some(([, text]) => text)) return null;

  return (
    <StyledTableRow
      sx={{ bgcolor: gray50 }}
      //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell colSpan={columns.length} variant="default">
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ mr: 3 }}>
            {data.map(([text]) => (
              <ExpandedPseudoCell text={text} />
            ))}
          </Box>
          <Box>
            {data.map(([, text]) => (
              <ExpandedPseudoCell text={text} emphasized />
            ))}
          </Box>
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};

function MyTeamInner() {
  const teamMsg = useMsg({ dict: messages });
  const msg = useMsg({ dict: myTeamMessages });
  const { isHR, isAdmin } = useAuth();

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
    //   label: teamMsg("team.members.table.col.longTermGoal"),
    //   key: "longTermGoal",
    //   render: (row) => <TLCell align="right">{row.longTermGoal}</TLCell>,
    // },
    // {
    //   label: teamMsg("team.members.table.col.areaOfDevelopment"),
    //   key: "areaOfDevelopment",
    //   render: (row) => (
    //     <TLCell align="right">
    //       <ShowMore maxChars={25} text={row.areaOfDevelopment?.join(", ")} />
    //     </TLCell>
    //   ),
    // },
    // {
    //   label: teamMsg("team.members.table.col.strengths"),
    //   key: "strengths",
    //   render: (row) => (
    //     <TLCell align="right">
    //       <ShowMore maxChars={25} text={row.strengths?.join(", ")} />
    //     </TLCell>
    //   ),
    // },
  ];

  console.log("[MyTeam.page]", { usersQuery, isHR, isAdmin });

  return (
    <Layout header={{ heading: msg("my-team.heading") }}>
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
          columns,
          expandedRowRender: expandedRowRenderAoDLTG,
          query: usersQuery,
          exportCsv: { filename: "my-team.csv" },
        }}
      />
      <Box sx={{ pb: 3 }} />
    </Layout>
  );
}

const withTeamMessages = (Component) => (props) => {
  return (
    <MsgProvider messages={messages}>
      <Component {...props} />
    </MsgProvider>
  );
};

export const MyTeamPage = withTeamMessages(MyTeamInner);
