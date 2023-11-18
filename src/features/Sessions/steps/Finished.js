import { EmojiEvents } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Card, CardContent } from "@mui/material";
import { addDays, parse } from "date-fns/fp";
import { useForm } from "react-hook-form";
import {
  DatePickerField,
  TimePicker,
  anchorTime,
} from "../../../components/Forms";
import { Msg } from "../../../components/Msg";
import { H1, P } from "../../../components/Typography";
import { routes } from "../../../routes";
import { ControlsContainer } from "./Controls";
import { RHForm } from "../../../components/Forms/Form";
import { useMutation } from "react-query";
import { useAuth } from "../../Authorization";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { I18nContext } from "../../I18n/I18nProvider";
import { API_DATETIME_LOCAL_FORMAT } from "../../Availability/api";

export const useSchedulePrivateSessionMutation = (params = {}) => {
  const { authFetch } = useAuth();
  const { i18n } = useContext(I18nContext);

  return useMutation({
    mutationFn: async ({ date, time }) =>
      authFetch({
        url: `/api/latest/coaches/schedule`,
        method: "POST",
        data: (() => {
          const dateTime = anchorTime(date, time);
          // debugger;
          return {
            time: i18n.formatLocal(dateTime, API_DATETIME_LOCAL_FORMAT),
          };
        })(),
      }),
    ...params,
  });
};

export const Finished = () => {
  const navigate = useNavigate();
  const mutation = useSchedulePrivateSessionMutation({
    onSuccess: (data) => {
      console.log("[Finished.mutation.onSuccess]", { data });
      navigate(routes.sessions);
    },
  });
  const form = useForm({
    defaultValues: {
      date: addDays(7, new Date()),
      time: parse(new Date(), "HH:mm", "14:00"),
    },
  });
  const { control, formState } = form;
  const disabled = mutation.isLoading || !formState.isValid;

  console.log("[Finished.rndr]", {
    disabled,
    formState,
  });

  return (
    <RHForm form={form} onSubmit={mutation.mutateAsync}>
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
            <DatePickerField
              {...{ control, name: "date", rules: { required: "Required" } }}
            />
            <P>
              <Msg id="sessions.steps.finished.datetime.separator" />
            </P>
            <TimePicker
              {...{ control, name: "time", rules: { required: "Required" } }}
            />
          </Box>
          {mutation.error && (
            <Alert severity="error"> {mutation.error?.message} </Alert>
          )}
          <ControlsContainer sx={{ mt: 3 }}>
            <Button href={routes.sessions} variant="outlined">
              <Msg id="sessions.steps.finished.button.skip" />
            </Button>
            <Button type="submit" variant="contained">
              <Msg id="sessions.steps.finished.button.schedule" />
            </Button>
          </ControlsContainer>
        </CardContent>
      </Card>
    </RHForm>
  );
};
