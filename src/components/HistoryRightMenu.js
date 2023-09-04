import { Button } from "@mui/material";
import { useContext } from "react";
import { I18nContext } from "../App";
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
  const { i18n } = useContext(I18nContext);
  // console.log({ i18n });

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
          {i18n.formatLocal(
            i18n.parseUTC(entry.date),
            "Pp"
            // i18n.uiFormats.inputDateFormat
          )}
          <br />
          <P>{entry.status}</P>
        </Button>
      ))}
    </ScrollableRightMenu>
  );
};
