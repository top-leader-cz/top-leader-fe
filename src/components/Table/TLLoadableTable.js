import {
  Avatar,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { Fragment, useContext } from "react";
import { QueryRenderer } from "../../features/QM/QueryRenderer";
import { P } from "../Typography";
import { Icon } from "../Icon";
import { gray200 } from "../../theme";
import { formatName } from "../../features/Coaches/CoachCard";
import { I18nContext } from "../../features/I18n/I18nProvider";
import { ErrorBoundary } from "../ErrorBoundary";

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

export const TLChipsCell = ({ children, chips = [], ...props }) => {
  return (
    <StyledTableCell {...props}>
      <Stack direction="row" spacing={1}>
        {chips?.map?.(({ label, bgcolor }) => (
          <Chip
            key={label}
            label={label}
            sx={{ bgcolor, borderRadius: "6px" }}
          />
        ))}
      </Stack>
    </StyledTableCell>
  );
};

export const TLCell = ({
  children,
  name,
  sub,
  avatar,
  avatarSrc,
  align,
  after,
  debug,
  ...props
}) => {
  if (debug) debugger;

  return (
    <StyledTableCell {...props}>
      <Box display="flex" flexDirection="row" flexWrap="nowrap">
        {name && (
          <Box display="flex" alignItems={"center"}>
            {avatar && (
              <Avatar
                variant="circular"
                sx={{ width: 44, height: 44, bgcolor: "transparent", mr: 2 }}
                {...(avatarSrc
                  ? { src: avatarSrc }
                  : {
                      children: (
                        <Icon name={"Person"} sx={{ color: gray200 }} />
                      ),
                    })}
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
      {after}
    </StyledTableCell>
  );
};

const TableCellAvatar = ({ src }) => {
  return (
    <Avatar
      variant="circular"
      sx={{ width: 44, height: 44, bgcolor: "transparent", mr: 2 }}
      {...(src
        ? { src: src }
        : {
            children: <Icon name={"Person"} sx={{ color: gray200 }} />,
          })}
    />
  );
};

export const UserCell = ({
  firstName,
  lastName,
  name = formatName({ firstName, lastName }),
  email,
  avatarSrc,
  debug,
  component = "th",
  scope = "row",
  ...props
}) => {
  const hasData = Boolean(name || email || avatarSrc);
  if (debug) debugger;

  return (
    <StyledTableCell {...props}>
      <Box display="flex" flexDirection="row" flexWrap="nowrap">
        {!hasData ? null : (
          <Box display="flex" alignItems={"center"}>
            {avatarSrc && <TableCellAvatar src={avatarSrc} />}
            {!email ? (
              name
            ) : (
              <Box display={"flex"} flexDirection={"column"}>
                <Box>{name}</Box>
                <P>{email}</P>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </StyledTableCell>
  );
};

const parseAndFormat = ({ utcStr, i18n, defaultStr = "" }) => {
  try {
    // if (!utcStr) return "";
    // return utcStr;
    // const formattedDate = new Date(utcStr).toLocaleDateString();
    const parsed = i18n.parseUTCLocal(utcStr);
    const formattedDate = i18n.formatLocal(parsed, "Pp");
    console.log("[parseAndFormat]", { parsed, formattedDate });
    return formattedDate;
  } catch (e) {
    console.error("[parseAndFormat]", { e, utcStr, i18n, defaultStr });
    return defaultStr;
  }
};

export const DateCell = ({ utcStr, defaultStr = utcStr || "", ...props }) => {
  const { i18n } = useContext(I18nContext);
  const formattedDate = parseAndFormat({ utcStr, i18n, defaultStr });
  // const formattedDate = utcStr;
  console.log("DateCellInner", { utcStr, formattedDate, defaultStr });

  return (
    <StyledTableCell {...props} title={utcStr}>
      <Box display="flex" flexDirection="row" flexWrap="nowrap">
        {formattedDate}
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
                <TLCell key={key || label}>{label}</TLCell>
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
                  // console.log(">>>", { data, expandedEl, row, columns });

                  if (!expandedEl)
                    return (
                      <StyledTableRow
                        key={row[key]}
                        //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {columns.map((column) => (
                          <Fragment key={column.key || column.label}>
                            {column.render(row)}
                          </Fragment>
                        ))}
                      </StyledTableRow>
                    );

                  return (
                    <Fragment key={row[key]}>
                      <StyledTableRow
                      //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {columns.map((column) => (
                          <Fragment key={column.key || column.label}>
                            {column.render(row)}
                          </Fragment>
                        ))}
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
