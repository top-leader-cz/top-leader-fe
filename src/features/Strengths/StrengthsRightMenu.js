import { Box, Button, Paper } from "@mui/material";
import React, { useContext } from "react";
import { Msg } from "../../components/Msg";
import { H2, P } from "../../components/Typography";
import { primary25 } from "../../theme";
import { I18nContext } from "../I18n/I18nProvider";

export const StrengthsRightMenu = ({
  items,
  selectedTimestamp,
  onSelect,
  onRemove,
  onRetake,
}) => {
  const { i18n } = useContext(I18nContext);
  return (
    <Paper
      square
      sx={{
        px: 3,
        py: 4,
        height: "100vh",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexFlow: "column nowrap" }}>
        <H2>
          <Msg id="strengths.aside.title" />
        </H2>
        <P mt={5}>
          <Msg id="strengths.aside.perex" />
        </P>
        {items.map((entry) => (
          <Button
            key={entry.timestamp}
            onClick={(e) =>
              onRemove && e.metaKey && e.shiftKey
                ? onRemove(entry)
                : onSelect(entry)
            }
            sx={{
              mt: 3,
              p: 2,
              flexFlow: "column nowrap",
              alignItems: "flex-start",
              bgcolor: primary25,
            }}
            color={
              entry.timestamp === selectedTimestamp ? "primary" : "secondary"
            }
          >
            {i18n.formatLocal(i18n.parseUTCLocal(entry.date), "Pp")}
            <br />
            <P>{entry.status}</P>
          </Button>
        ))}
      </Box>
      <Button fullWidth variant="contained" onClick={onRetake}>
        <Msg id="strengths.aside.retake-button" />
      </Button>
    </Paper>
  );
};
