import { Button } from "@mui/material";
import { PRIMARY_BG_LIGHT } from "./InfoBox";
import { ScrollableRightMenu } from "./ScrollableRightMenu";
import { P } from "./Typography";

export const HistoryRightMenu = ({
  heading,
  history,
  onRemove,
  buttonProps,
  perex = "History",
  key = "timestamp",
}) => {
  return (
    <ScrollableRightMenu heading={heading} buttonProps={buttonProps}>
      <P mt={1}>{perex}</P>
      {history.all.map((entry) => (
        <Button
          key={entry[key]}
          onClick={(e) =>
            onRemove && e.metaKey && e.shiftKey
              ? onRemove(entry)
              : history.setSelected(entry)
          }
          sx={{
            mt: 3,
            p: 2,
            flexFlow: "column nowrap",
            alignItems: "flex-start",
            bgcolor: PRIMARY_BG_LIGHT,
          }}
          color={history.isSelected(entry) ? "primary" : "secondary"}
          // variant={"contained"}
        >
          {entry.date}
          <br />
          <P>{entry.status}</P>
        </Button>
      ))}
    </ScrollableRightMenu>
  );
};
