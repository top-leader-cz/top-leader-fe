import { Button } from "@mui/material";
import { useContext } from "react";
import { I18nContext } from "../features/I18n/I18nProvider";
import { primary25 } from "../theme";
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
      {!history?.all?.length
        ? null
        : history.all.map((entry) => (
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
                bgcolor: primary25,
              }}
              color={history.isSelected(entry) ? "primary" : "secondary"}
              // variant={"contained"}
            >
              {i18n.formatLocal(
                i18n.parseUTCLocal(entry.date),
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
