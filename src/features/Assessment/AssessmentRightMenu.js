import { Box, Button, Paper, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { Msg } from "../../components/Msg";
import { ProgressStats } from "../../components/ProgressStats";
import { H2 } from "../../components/Typography";

const PROGRESS_PROPS = {
  size: 220,
  thickness: 4,
};

function CircularProgressWithLabel({ value, sx = {} }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex", ...sx }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        {...PROGRESS_PROPS}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        // disableShrink
        sx={{
          position: "absolute",
          left: 0,
          // color: (theme) =>
          //   theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          // animationDuration: "550ms",
          // [`& .${circularProgressClasses.circle}`]: {
          //   strokeLinecap: "round",
          // },
        }}
        value={value}
        {...PROGRESS_PROPS}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column nowrap",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          <Msg id="assessment.menu.progress" />
        </Typography>
        <Typography variant="h1" component="div">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const AssessmentRightMenu = ({
  saveDisabled,
  totalCount,
  responsesCount,
  onSave,
}) => {
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
          <Msg id="assessment.menu.title" />
        </H2>
        <CircularProgressWithLabel
          value={(100 * responsesCount) / totalCount}
          sx={{ alignSelf: "center", my: 7.5 }}
        />
        <ProgressStats
          items={[
            {
              key: 0,
              label: <Msg id="assessment.menu.questions" />,
              value: totalCount,
            },
            {
              key: 1,
              label: <Msg id="assessment.menu.responses" />,
              value: responsesCount,
            },
          ]}
        />
      </Box>
      {onSave && (
        <Button
          fullWidth
          variant="contained"
          onClick={onSave}
          disabled={saveDisabled}
        >
          <Msg id="assessment.menu.save" />
        </Button>
      )}
    </Paper>
  );
};
