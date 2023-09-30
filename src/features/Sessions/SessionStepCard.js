import { Box, Card, CardContent } from "@mui/material";
import { H1, P } from "../../components/Typography";
import { Controls } from "./steps/Controls";
import { FocusedList } from "./FocusedList";
import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";

const messages = defineMessages({
  "session.step-card.step": {
    id: "session.step-card.step",
    defaultMessage: "Step {current}/{total}",
  },
});

export const SessionStepCard = ({
  step: { perex, heading, focusedList } = {},
  stepper,
  handleNext,
  handleBack,
  children = <Controls handleNext={handleNext} handleBack={handleBack} />,
  sx = { mb: 3 },
}) => {
  const msg = useMsg({ dict: messages });
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardContent sx={{ flexDirection: "column" }}>
        <Box>
          {stepper && (
            <P sx={{ mb: 1, fontWeight: 600 }}>
              {msg("session.step-card.step", {
                current: stepper.currentIndex + 1,
                total: stepper.totalCount,
              })}
            </P>
          )}
          <H1 gutterBottom>{heading}</H1>
          {perex && <P emphasized>{perex}</P>}
        </Box>
        {focusedList && <FocusedList items={focusedList} />}
        {children}
      </CardContent>
    </Card>
  );
};
