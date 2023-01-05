import { Box, Card, CardContent } from "@mui/material";
import { H1, P } from "../../components/Typography";
import { Controls } from "./Controls";
import { FocusedList } from "./FocusedList";

export const SessionStepCard = ({
  step: { perex, heading, focusedList } = {},
  stepper,
  handleNext,
  handleBack,
  children = <Controls handleNext={handleNext} handleBack={handleBack} />,
  sx = { mb: 3 },
}) => {
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardContent sx={{ flexDirection: "column" }}>
        <Box>
          {stepper && (
            <P sx={{ mb: 1 }}>
              Step {stepper.currentIndex + 1}/{stepper.totalCount}
            </P>
          )}
          <H1 gutterBottom>{heading}</H1>
          {perex && <P>{perex}</P>}
        </Box>
        {focusedList && <FocusedList items={focusedList} />}
        {children}
      </CardContent>
    </Card>
  );
};
