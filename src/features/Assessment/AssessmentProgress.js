import { Box } from "@mui/material";
import React from "react";
import { P } from "../../components/Typography";

const ProgressItem = ({ value, active }) => {
  const Component = active ? "b" : "span";

  return (
    <>
      <Component sx={{ right: 12 }}>{value}</Component>&nbsp;
    </>
  );
};

export const AssessmentProgress = ({ currentIndex, totalCount, sx = {} }) => {
  const currentQuestion = currentIndex + 1;

  return (
    <Box sx={sx}>
      <P sx={{ justifyContent: "center", display: "flex", cursor: "default" }}>
        {currentQuestion !== 1 && <ProgressItem value={1} />}
        <ProgressItem value={currentQuestion} active />
        {currentQuestion !== totalCount && <ProgressItem value={totalCount} />}
      </P>
    </Box>
  );
};
