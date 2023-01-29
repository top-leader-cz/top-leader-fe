import { Box, Button } from "@mui/material";
import { P } from "./Typography";

export const Score = ({
  value,
  onChange,
  left = <P>Not me at all</P>,
  right = <P>Totally me</P>,
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
