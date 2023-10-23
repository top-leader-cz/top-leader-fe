import { Card, CardHeader, Divider } from "@mui/material";
import { TLLoadableTable } from "./TLLoadableTable";

export const TLTableWithHeader = ({
  title,
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
