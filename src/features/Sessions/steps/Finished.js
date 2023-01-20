import { EmojiEvents } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent } from "@mui/material";
import { addDays, parse } from "date-fns/fp";
import { useForm } from "react-hook-form";
import { DatePicker, TimePicker } from "../../../components/Forms";
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
          Congratulations, you’ve completed your session!
        </H1>
        <P>Would you like to book the next one?</P>
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
          <DatePicker {...{ control, name: "date", size: "small" }} />
          <P>at</P>
          <TimePicker {...{ control, name: "time", size: "small" }} />
        </Box>
        <ControlsContainer sx={{ mt: 10 }}>
          <Button href={routes.sessions} variant="outlined">
            Skip for now
          </Button>
          <Button href={routes.sessions} variant="contained">
            Schedule the session
          </Button>
        </ControlsContainer>
      </CardContent>
    </Card>
  );
};
