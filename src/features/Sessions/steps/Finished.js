import { Avatar, Box, Button, Card, CardContent } from "@mui/material";
import { addDays, parse } from "date-fns/fp";
import { applySpec } from "ramda";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  DatePickerField,
  TimePicker,
  anchorTime,
} from "../../../components/Forms";
import { RHForm } from "../../../components/Forms/Form";
import {
  invalidDate,
  invalidTime,
  todayOrFuture,
} from "../../../components/Forms/validations";
import { Icon } from "../../../components/Icon";
import { Msg } from "../../../components/Msg";
import { H1, P } from "../../../components/Typography";
import { routes } from "../../../routes";
import { useAuth } from "../../Authorization";
import { useMyMutation } from "../../Authorization/AuthProvider";
import { API_DATETIME_LOCAL_FORMAT } from "../../Availability/api";
import { CoachCard } from "../../Coaches/CoachCard";
import { ScheduledSessionsCard } from "../../Coaches/ScheduledSessions";
import {
  useUserUpcomingSessionsQuery,
  useYourCoachQuery,
} from "../../Coaches/api";
import { I18nContext } from "../../I18n/I18nProvider";
import { QueryRenderer } from "../../QM/QueryRenderer";
import { ControlsContainer } from "./Controls";

export const useSchedulePrivateSessionMutation = (params = {}) => {
  const { i18n } = useContext(I18nContext);

  return useMyMutation({
    fetchDef: {
      url: `/api/latest/user-info/private-session`,
      method: "POST",
      from: applySpec({
        time: ({ date, time }) => {
          const dateTime = anchorTime(date, time);
          // debugger;
          const formatted = i18n.formatLocal(
            dateTime,
            API_DATETIME_LOCAL_FORMAT
          );
          console.log("[useSchedulePrivateSessionMutation]", {
            date,
            time,
            dateTime,
            formatted,
          });
          return formatted;
        },
      }),
    },
    snackbar: { success: true, error: true },
    ...params,
  });
};

const SchedulePrivateForm = () => {
  const navigate = useNavigate();
  const mutation = useSchedulePrivateSessionMutation({
    onSuccess: () => navigate(routes.sessions),
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

  // console.log("[PrivateFinished.rndr]", { disabled, formState });

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
        {!currentCoach ? null : ( // TODO? https://topleader.atlassian.net/browse/TOP-116
          <>
            <ScheduleCoached />
            <P sx={{ my: 5 }}>
              <Msg id="sessions.steps.finished.schedule-private" />
            </P>
          </>
        )}
        <SchedulePrivateForm />
      </CardContent>
    </Card>
  );
};
