import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
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
  forExcel = false,
  exportCsv: {
    filename = "topleader-table.csv",
    getDataset = identity, // https://www.papaparse.com/docs#json-to-csv
  },
}) => {
  // TODO: not working for US formats, take from from locale (en-us vs en-gb)
  const decimalSeparatorIsComma = true;
  return {
    onClick: () =>
      downloadFile({
        // string: unparse({ fields, data }),
        string: unparse(getDataset(query.data), {
          encoding: "utf-8",
          delimiter: forExcel && decimalSeparatorIsComma ? ";" : ",",
        }),
        filename,
        type: "text/csv",
        getHref: forExcel ? GET_HREF.csvWithBOM : GET_HREF.blob,
      }),
    disabled: query.isFetching,
  };
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

  return (
    <Card sx={sx}>
      {headerVisible && (
        <CardHeader
          disableTypography
          title={title}
          subheader={subheader}
          action={
            <Stack direction="row" spacing={2}>
              {exportCsv && (
                <Button
                  variant="outlined"
                  aria-label="download CSV"
                  startIcon={<Icon name="Download" />}
                  {...downloadCsvProps({ query, exportCsv, forExcel: true })}
                >
                  {msg("general.export.csv")}
                </Button>
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
