import { Box, Card, CardHeader, Divider } from "@mui/material";
import { TLLoadableTable } from "./TLLoadableTable";
import { H2 } from "../Typography";
import { SlotChip } from "../../features/Team/Team.page";

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
  headerVisible = title || subheader || action,
  sx = {},
}) => {
  return (
    <Card sx={sx}>
      {headerVisible && (
        <CardHeader
          disableTypography
          title={title}
          subheader={subheader}
          action={action}
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
