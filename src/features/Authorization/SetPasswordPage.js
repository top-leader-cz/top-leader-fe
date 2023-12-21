import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { P } from "../../components/Typography";
import { useAuth } from "./AuthProvider";
import { WelcomeScreenTemplate } from "./WelcomeScreenTemplate";
import { messages } from "./messages";
import { routes } from "../../routes";
import { Icon } from "../../components/Icon";

export const SetPasswordPage = ({ isExistingUser }) => {
  const msg = useMsg({ dict: messages });
  const { token: __badToken, email } = useParams();
  const [, fullTokenTodo] = window.location.href.split(`${email}/`);
  const navigate = useNavigate();
  const { resetPasswordMutation } = useAuth();
  const form = useForm({
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const handleSubmit = async ({ password, passwordConfirm }, e) => {
    console.log("[Login submit]", {
      password,
      passwordConfirm,
      __badToken,
      fullTokenTodo,
    });
    if (password !== passwordConfirm) {
      form.setError("passwordConfirm", { message: "Must match" });
      return;
    }

    await resetPasswordMutation.mutateAsync({ password, token: fullTokenTodo });
    // .catch((e) => { form.setError("password", { message: "Error" }); });
    navigate(isExistingUser ? routes.passwordChanged : routes.signIn);
  };

  const disabled = resetPasswordMutation.isLoading;
  const errorMsg = resetPasswordMutation.error?.message || "";

  console.log("[SetPasswordPage.rndr]", {
    disabled,
    errorMsg,
    form,
    resetPasswordMutation,
    __badToken,
    fullTokenTodo,
    email,
  });
  const props = isExistingUser
    ? {
        title: msg("auth.reset-password.title"),
        perex: (
          <>
            <Typography variant="body1" mt={1} mb={3} textAlign="center">
              {msg("auth.reset-password.perex")}
            </Typography>
          </>
        ),
      }
    : {
        title: undefined, // default
        perex: (
          <>
            <Typography variant="body1" mt={1} mb={3} textAlign="center">
              {msg("auth.set-password.perex")}
            </Typography>
            <P sx={{ mt: 0, mb: 3, fontWeight: 600 }}>{email}</P>
          </>
        ),
      };

  return (
    <WelcomeScreenTemplate {...props}>
      <RHForm form={form} onSubmit={handleSubmit}>
        <RHFTextField
          margin="normal"
          required
          rules={{ required: "Required" }}
          fullWidth
          name="password"
          label={<Msg id="auth.login.password.label" />}
          type="password"
          id="password"
          autoComplete="password"
          error={!!errorMsg}
          helperText={errorMsg}
        />
        <RHFTextField
          margin="normal"
          required
          rules={{
            required: "Required",
            // validate: (...args) => console.log({ args }) || true,
            // validate: {
            //   positive: (v) => parseInt(v) > 0,
            //   lessThanTen: (v) => parseInt(v) < 10,
            //   matches: (v, values) => console.log({ v, values }) || !!(values.password === v),
            //   checkUrl: async () => await fetch(),
            // },
          }}
          fullWidth
          name="passwordConfirm"
          label={<Msg id="auth.login.password-confirm.label" />}
          type="password"
          id="passwordConfirm"
          autoComplete="password"
        />
        <Button
          type="submit"
          disabled={disabled}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 3 }}
        >
          {isExistingUser ? (
            <Msg id="auth.reset-password.submit" />
          ) : (
            <Msg id="auth.set-password.submit" />
          )}
        </Button>
        {isExistingUser && (
          <Button
            type="button"
            disabled={disabled}
            fullWidth
            variant="text"
            sx={{ mb: 3 }}
            startIcon={<Icon name="ArrowBack" />}
            href={routes.signIn}
          >
            <Msg id="auth.forgot-pass.back" />
          </Button>
        )}
      </RHForm>
    </WelcomeScreenTemplate>
  );
};
