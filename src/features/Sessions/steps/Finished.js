import { EmojiEvents } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent } from "@mui/material";
import { addDays, parse } from "date-fns/fp";
import { useForm } from "react-hook-form";
import { DatePickerField, TimePicker } from "../../../components/Forms";
import { Msg } from "../../../components/Msg";
import { H1, P } from "../../../components/Typography";
import { routes } from "../../../routes";
import { ControlsContainer } from "./Controls";

export const Finished = () => {
  const { control } = useForm({
    defaultValues: {
      date: addDays(7, new Date()),
      time: parse(new Date(), "HH:mm", "14:00"),
    },
  });
  return (
    <Card sx={{}} elevation={0}>
      <CardContent
        sx={{
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Avatar
            variant="circular"
            sx={{ width: 100, height: 100, bgcolor: "#F9FAFB" }}
          >
            <Avatar
              variant="circular"
              sx={{ width: 60, height: 60, bgcolor: "#EAECF0" }}
            >
              <EmojiEvents sx={{ fontSize: 30, color: "#667085" }} />
            </Avatar>
          </Avatar>
        </Box>
        <H1 sx={{ mt: 2 }} gutterBottom>
          <Msg id="sessions.steps.finished.title" />
        </H1>
        <P>
          <Msg id="sessions.steps.finished.perex" />
        </P>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            my: 7.5,
          }}
        >
          <DatePickerField {...{ control, name: "date", size: "small" }} />
          <P>
            <Msg id="sessions.steps.finished.datetime.separator" />
          </P>
          <TimePicker {...{ control, name: "time", size: "small" }} />
        </Box>
        <ControlsContainer sx={{ mt: 10 }}>
          <Button href={routes.sessions} variant="outlined">
            <Msg id="sessions.steps.finished.button.skip" />
          </Button>
          <Button href={routes.sessions} variant="contained">
            <Msg id="sessions.steps.finished.button.schedule" />
          </Button>
        </ControlsContainer>
      </CardContent>
    </Card>
  );
};
