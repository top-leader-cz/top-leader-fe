import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { TLLoadableTable } from "./TLLoadableTable";
import { H2 } from "../Typography";
import { SlotChip } from "../../features/Team/Team.page";
import { Icon } from "../Icon";
import { unparse } from "papaparse";
import { identity } from "ramda";
import { useMsg } from "../Msg/Msg";
import { generalMessages } from "../messages";
import { useContext, useState } from "react";
import { I18nContext } from "../../features/I18n/I18nProvider";

// https://stackoverflow.com/questions/18249290/generate-csv-for-excel-via-javascript-with-unicode-characters

// https://stackoverflow.com/questions/42462764/javascript-export-csv-encoding-utf-8-issue

var universalBOM = "\uFEFF";
const GET_HREF = {
  blob: ({ string, type }) => {
    const blob = new Blob([string], { type });
    return window.URL.createObjectURL(blob);
  },
  csvWithBOM: ({ string, BOM = universalBOM }) => {
    // Excel forces you to spend some time to figure out how to open a CSV file with UTF-8 encoding or use their format
    const csvWithBOM = BOM + string;
    const blob = new Blob([csvWithBOM], {
      type: "text/csv;charset=utf-8;",
    });
    return window.URL.createObjectURL(blob);
  },
  csvWithBOM2: ({ string, BOM = universalBOM }) => {
    return "data:text/csv; charset=utf-8," + encodeURIComponent(BOM + string);
  },
};

export const downloadFile = ({
  string,
  filename,
  type,
  getHref = GET_HREF.blob,
}) => {
  const el = document.createElement("a");
  el.href = getHref({ string, type });
  el.download = filename;
  el.style.display = "none";
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

export const downloadCsvProps = ({
  query,
  delimiter = ",",
  filename = "topleader-table.csv",
  getDataset = identity, // https://www.papaparse.com/docs#json-to-csv
}) => {
  return {
    onClick: () =>
      downloadFile({
        // string: unparse({ fields, data }),
        string: unparse(getDataset(query.data), {
          encoding: "utf-8",
          delimiter,
        }),
        filename,
        type: "text/csv",
        getHref: GET_HREF.csvWithBOM,
      }),
    disabled: query.isFetching,
  };
};

const ButtonMenu = ({ button = { children: "Click me" }, items = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        {...button}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {items.map((item) => (
          <MenuItem
            {...item}
            onClick={() => {
              item.onClick?.();
              handleClose();
            }}
          />
        ))}
      </Menu>
    </div>
  );
};

export const TLTableWithHeader = ({
  titleDef,
  title = (
    <Box sx={{ display: "inline-flex", alignItems: "baseline" }}>
      <H2>{titleDef?.heading}</H2>
      <SlotChip sx={{ display: "inline-flex", p: 0.75, ml: 4 }}>
        {titleDef?.chip}
      </SlotChip>
    </Box>
  ),
  subheader,
  action,
  columns,
  query,
  expandedRowRender,
  bodyBefore,
  headerBefore,
  exportCsv,
  headerVisible = title || subheader || action || !!exportCsv,
  sx = {},
}) => {
  const msg = useMsg({ dict: generalMessages });
  // const { guessedCsvDelimiter } = useContext(I18nContext);

  return (
    <Card sx={sx}>
      {headerVisible && (
        <CardHeader
          disableTypography
          title={title}
          subheader={subheader}
          action={
            <Stack direction="row" spacing={2}>
              {!query.error && exportCsv && (
                <ButtonMenu
                  button={{
                    variant: "outlined",
                    "aria-label": "download CSV",
                    startIcon: <Icon name="Download" />,
                    children: msg("general.export.csv"),
                  }}
                  items={[
                    {
                      key: 1,
                      children: msg("general.delimiter", { delimiter: '","' }),
                      ...downloadCsvProps({
                        query,
                        delimiter: ",",
                        filename: exportCsv.filename,
                        getDataset: exportCsv.getDataset,
                        // forExcel: true,
                        // decimalSeparatorIsComma,
                      }),
                    },
                    {
                      key: 2,
                      children: msg("general.delimiter", { delimiter: '";"' }),
                      ...downloadCsvProps({
                        query,
                        delimiter: ";",
                        filename: exportCsv.filename,
                        getDataset: exportCsv.getDataset,
                        // forExcel: true,
                        // decimalSeparatorIsComma,
                      }),
                    },
                  ]}
                />
                // <Button
                //   variant="outlined"
                //   aria-label="download CSV"
                //   startIcon={<Icon name="Download" />}
                //   {...downloadCsvProps({
                //     query,
                //     delimiter: exportCsv.delimiter || guessedCsvDelimiter,
                //     filename: exportCsv.filename,
                //     getDataset: exportCsv.getDataset,
                //     // forExcel: true,
                //     // decimalSeparatorIsComma,
                //   })}
                // >
                //   {msg("general.export.csv")}
                // </Button>
              )}
              {action}
            </Stack>
          }
        />
      )}
      <Divider />
      <TLLoadableTable
        columns={columns}
        query={query}
        expandedRowRender={expandedRowRender}
        bodyBefore={bodyBefore}
        headerBefore={headerBefore}
      />
    </Card>
  );
};
