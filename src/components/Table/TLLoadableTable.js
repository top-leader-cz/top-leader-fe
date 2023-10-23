import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { Fragment } from "react";
import { QueryRenderer } from "../../features/QM/QueryRenderer";
import { P } from "../Typography";

export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ theme, variant = "emphasized" }) => ({
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
  [`&.${tableCellClasses.body}`]:
    variant === "lighter"
      ? {}
      : variant === "emphasized"
      ? {
          fontSize: 16,
          fontWeight: 600,
        }
      : {},
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
  },
  backgroundColor: "white",
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

// TODO: extract to components
export const TLLoadableTable = ({
  query,
  columns = [],
  key = "username",
  expandedRowRender,
  bodyBefore = null,
  headerBefore = null,
}) => {
  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        {headerBefore && <TableHead>{headerBefore}</TableHead>}
        {columns && (
          <TableHead>
            <TableRow>
              {columns.map(({ label, key }) => (
                <TLCell key={key}>{label}</TLCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {bodyBefore}
          {query && (
            <QueryRenderer
              {...query}
              success={({ data }) =>
                data.map((row) => {
                  const expandedEl = expandedRowRender?.({ row, columns });

                  if (!expandedEl)
                    return (
                      <StyledTableRow
                        key={row[key]}
                        //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {columns.map((column) => column.render(row))}
                      </StyledTableRow>
                    );

                  return (
                    <Fragment key={row[key]}>
                      <StyledTableRow
                      //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {columns.map((column) => column.render(row))}
                      </StyledTableRow>

                      {expandedEl}
                    </Fragment>
                  );
                })
              }
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
