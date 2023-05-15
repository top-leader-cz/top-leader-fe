import { Box, Button } from "@mui/material";
import { defineMessages } from "react-intl";
import { Msg, MsgProvider } from "./Msg";
import { P } from "./Typography";

const messages = defineMessages({
  "score.min": {
    id: "score.min",
    defaultMessage: "Not me at all",
  },
  "score.max": {
    id: "score.max",
    defaultMessage: "Totally me",
  },
});

const ScoreInner = ({
  value,
  onChange,
  left = (
    <P>
      <Msg id="score.min" />
    </P>
  ),
  right = (
    <P>
      <Msg id="score.max" />
    </P>
  ),
  sx = {},
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      {...sx}
    >
      {left}
      <Box sx={{ mx: 2, display: "flex", flexFlow: "row nowrap" }}>
        {Array(10)
          .fill()
          .map((_, i) => (
            <Button
              key={i}
              variant={value === i + 1 ? "contained" : "outlined"}
              sx={{ minWidth: 32, mx: 1 }}
              onClick={() => onChange({ value: i + 1 })}
            >
              {i + 1}
            </Button>
          ))}
      </Box>
      {right}
    </Box>
  );
};

export const Score = (props) => (
  <MsgProvider messages={messages}>
    <ScoreInner {...props} />
  </MsgProvider>
);
