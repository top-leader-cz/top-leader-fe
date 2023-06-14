import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { messages } from "./messages";
import { H1, H2, P } from "../../components/Typography";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { Icon } from "../../components/Icon";

export const CreditTopUpModal = ({ onClose, selected, open = !!selected }) => {
  const msg = useMsg();

  const methods = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {},
  });
  const onSubmit = (data, e) => console.log("[modal.onSubmit]", data, e);
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "500px" },
            bgcolor: "background.paper",
            borderRadius: "6px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            // border: "2px solid #000",
            // boxShadow: 24,
          }}
        >
          <FormProvider {...methods}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
                <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
                  <Icon name="Storage" sx={{ color: "#667085" }} />
                </Avatar>
              </Avatar>
              <IconButton onClick={onClose}>
                <Icon name="Close" sx={{ color: "#667085" }} />
              </IconButton>
            </Box>
            <H2 id="modal-modal-title">
              <Msg id="team.credit.topup-modal.title" />
              {/* <Msg id="coaches.contact.title" /> */}
            </H2>
            <P id="modal-modal-description">
              <Msg id="team.credit.topup-modal.desc" />
              {/* <Msg id="coaches.contact.perex" /> */}
            </P>
            {/* <OutlinedField label="Subject" /> */}
            <RHFTextField
              name="amount"
              rules={{ required: true, minLength: 3 }}
              label={"Amount of credits (1 credit = 1$)"}
              //   label={msg("coaches.contact.subject.label")}
              autoFocus
              size="small"
              fullWidth
            />

            <Divider flexItem sx={{ mt: 3 }} />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                <Msg id="coaches.contact.button.cancel" />
              </Button>
              <Button fullWidth variant="contained" type="submit">
                <Msg id="team.credit.topup-modal.submit" />
                {/* <Msg id="coaches.contact.button.send" /> */}
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};

const SlotChip = ({ children, sx }) => {
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

const Cell = ({ children, name, sub, avatar = !!name, align, ...props }) => {
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

function TeamPageInner() {
  const [selected, setSelected] = useState(false);
  const msg = useMsg();

  return (
    <Layout>
      <Header text={msg("team.heading")} />
      <Card>
        <CardHeader
          disableTypography
          title={
            <Box sx={{ display: "inline-flex", alignItems: "baseline" }}>
              <H2>
                <Msg id="team.members.title" />
              </H2>
              <SlotChip sx={{ display: "inline-flex", p: 0.75, ml: 4 }}>
                <Msg
                  id="team.members.title.count.badge"
                  values={{ count: rows.length }}
                />
              </SlotChip>
            </Box>
          }
          subheader={
            <P mt={1.5}>
              <Msg id="team.members.sub" />
            </P>
          }
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              aria-label="add member"
            >
              <Msg id="team.members.add" />
            </Button>
          }
        />

        <Divider />

        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <Cell>
                  <Msg id="team.members.table.col.name" />
                </Cell>
                <Cell>
                  <Msg id="team.members.table.col.coach" />
                </Cell>
                <Cell>
                  <Msg id="team.members.table.col.paid" />
                </Cell>
                <Cell>
                  <Msg id="team.members.table.col.remaining" />
                </Cell>
                <Cell>
                  <Msg id="team.members.table.col.action" />
                </Cell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow
                  key={row.email}
                  //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <Cell
                    component="th"
                    scope="row"
                    name={row.name}
                    sub={row.email}
                  />
                  <Cell name={row.coach} />
                  <Cell align="right">{row.creditPaid}</Cell>
                  <Cell align="right">{row.creditRemaining}</Cell>
                  <Cell>
                    <Button variant="outlined" onClick={() => setSelected(row)}>
                      <Msg id="team.credit.topup" />
                    </Button>
                  </Cell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <CardContent
          sx={{
            display: "flex",
            // gap: 3, p: 3
          }}
        >
          <Box display="flex" flexDirection="column" maxWidth={"50%"}>
            <H1 gutterBottom>
              Team members{" "}
              <SlotChip sx={{ display: "inline-flex" }}>6 members</SlotChip>
            </H1>
            <P gutterBottom>Manage your team members here</P>
          </Box>
        </CardContent> */}
      </Card>
      <CreditTopUpModal selected={selected} onClose={() => setSelected(null)} />
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
