import { Alert, Avatar, Box, Button, Card, CardContent } from "@mui/material";
import { addDays, parse } from "date-fns/fp";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  DatePickerField,
  TimePicker,
  anchorTime,
} from "../../../components/Forms";
import { RHForm } from "../../../components/Forms/Form";
import { Msg } from "../../../components/Msg";
import { H1, P } from "../../../components/Typography";
import { routes } from "../../../routes";
import { useAuth } from "../../Authorization";
import { API_DATETIME_LOCAL_FORMAT } from "../../Availability/api";
import { I18nContext } from "../../I18n/I18nProvider";
import { ControlsContainer } from "./Controls";
import {
  invalidDate,
  todayOrFuture,
  invalidTime,
} from "../../../components/Forms/validations";
import { Icon } from "../../../components/Icon";
import { QueryRenderer } from "../../QM/QueryRenderer";
import {
  useUserUpcomingSessionsQuery,
  useYourCoachQuery,
} from "../../Coaches/api";
import { CoachCard } from "../../Coaches/CoachCard";
import { ScheduledSessionsCard } from "../../Coaches/ScheduledSessions";

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

const SchedulePrivateForm = () => {
  const navigate = useNavigate();
  const mutation = useSchedulePrivateSessionMutation({
    onSuccess: (data) => {
      console.log("[PrivateFinished.mutation.onSuccess]", { data });
      navigate(routes.sessions);
    },
  });
  const form = useForm({
    mode: "all",
    defaultValues: {
      date: addDays(7, new Date()),
      time: parse(new Date(), "HH:mm", "14:00"),
    },
  });
  const { control, formState } = form;
  const disabled = mutation.isLoading || !formState.isValid;

  console.log("[PrivateFinished.rndr]", {
    disabled,
    formState,
  });

  return (
    <RHForm form={form} onSubmit={mutation.mutateAsync}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 3,
          my: 7.5,
        }}
      >
        <DatePickerField
          {...{
            control,
            name: "date",
            disablePast: true,
            rules: {
              required: true,
              validate: { invalidDate, todayOrFuture },
            },
          }}
        />
        <P>
          <Msg id="sessions.steps.finished.datetime.separator" />
        </P>
        <TimePicker
          {...{
            control,
            name: "time",
            rules: { required: true, validate: { invalidTime } },
          }}
        />
      </Box>
      {mutation.error && (
        <Alert severity="error"> {mutation.error?.message} </Alert>
      )}
      <ControlsContainer sx={{ mt: 3 }}>
        <Button href={routes.sessions} variant="outlined">
          <Msg id="sessions.steps.finished.button.skip" />
        </Button>
        <Button type="submit" variant="contained" disabled={disabled}>
          <Msg id="sessions.steps.finished.button.schedule" />
        </Button>
      </ControlsContainer>
    </RHForm>
  );
};

const ScheduleCoached = ({}) => {
  const yourCoachQuery = useYourCoachQuery();
  const userUpcomingSessionsQuery = useUserUpcomingSessionsQuery();

  return (
    <>
      <QueryRenderer
        {...yourCoachQuery}
        success={({ data: coach }) => (
          <CoachCard
            coach={coach}
            withContact
            sx={{ mt: 5, mb: 3, border: "none", boxShadow: "none" }}
          />
        )}
      />
      <QueryRenderer
        {...userUpcomingSessionsQuery}
        success={({ data }) => (
          <ScheduledSessionsCard
            data={data}
            // sx={{ border: "none", boxShadow: "none" }}
          />
        )}
      />
    </>
  );
};

export const Finished = () => {
  const { user } = useAuth();
  const currentCoach = user.data.coach;

  return (
    <Card sx={{ mb: 3 }}>
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
              <Icon
                name="EmojiEvents"
                sx={{ fontSize: 30, color: "#667085" }}
              />
            </Avatar>
          </Avatar>
        </Box>
        <H1 sx={{ mt: 2 }} gutterBottom>
          <Msg id="sessions.steps.finished.title" />
        </H1>
        <P>
          <Msg id="sessions.steps.finished.perex" />
        </P>
        {!currentCoach ? null : (
          <>
            <ScheduleCoached />
            <P sx={{ my: 5 }}>Or you can schedule your private session</P>
          </>
        )}
        <SchedulePrivateForm />
      </CardContent>
    </Card>
  );
};
