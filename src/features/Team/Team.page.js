import { Add } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";
import { CreditTopUpModal } from "./CreditTopUpModal";
import { messages } from "./messages";
import { AddMemberModal } from "./AddMemberModal";

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
  {
    name: "Verna Bergstrom",
    email: "verna.bergstorm@gmail.com",
    coach: "Frank Bogisich",
    creditPaid: 1200,
    creditRemaining: 800,
  },
  {
    name: "Marjorie Ortiz",
    email: "marjorie.ortiz@gmail.com",
    coach: "Gerardo Feil",
    creditPaid: 1200,
    creditRemaining: 1000,
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: "1px solid #EAECF0",
  paddingTop: "12px",
  paddingBottom: "12px",
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    color: "#667085",
    fontSize: 14,
    fontWeight: 500,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    fontWeight: 600,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    // border: 0,
  },
}));

export const TLCell = ({
  children,
  name,
  sub,
  avatar = !!name,
  align,
  ...props
}) => {
  return (
    <StyledTableCell {...props}>
      <Box display="flex" flexDirection="row" flexWrap="nowrap">
        {name && (
          <Box display="flex" alignItems={"center"}>
            {avatar && (
              <Avatar
                variant="circular"
                src={`https://i.pravatar.cc/44?u=${"" + Math.random()}`}
                sx={{ width: 44, height: 44, bgcolor: "transparent", mr: 2 }}
              />
            )}
            {!sub ? (
              name
            ) : (
              <Box display={"flex"} flexDirection={"column"}>
                <Box>{name}</Box>
                <P>{sub}</P>
              </Box>
            )}
          </Box>
        )}
        {children && <Box>{children}</Box>}
      </Box>
    </StyledTableCell>
  );
};

const useHrUsersQuery = () => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["hr-users"],
    queryFn: () => authFetch({ url: `/api/latest/hr-users` }),
    select: (data) => {
      return data.map((user) => {
        //  {
        //   username: "string",
        //   coach: "string",
        //   credit: 0,
        //   requestedCredit: 0,
        //   state: "AUTHORIZED",
        // };
        return {
          name: user.username, // TODO
          username: user.username,
          coach: user.coach,
          creditPaid: user.requestedCredit,
          creditRemaining: user.credit,
        };
      });
    },
  });
};

export const TLLoadableTable = ({ query, columns = [], key = "username" }) => {
  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map(({ label, key }) => (
              <TLCell key={key}>{label}</TLCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <QueryRenderer
            {...query}
            success={({ data }) =>
              data.map((row) => (
                <StyledTableRow
                  key={row[key]}
                  //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column) => column.render(row))}
                </StyledTableRow>
              ))
            }
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const TLTableWithHeader = ({
  title,
  subheader,
  action,
  columns,
  query,
}) => {
  return (
    <Card>
      <CardHeader
        disableTypography
        title={title}
        subheader={subheader}
        action={action}
      />
      <Divider />
      <TLLoadableTable columns={columns} query={query} />
    </Card>
  );
};

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

  console.log("[Team->Credits.page]", { hrUsersQuery });

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
