import Button from "@mui/material/Button";
import * as React from "react";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { useAuth } from "./AuthProvider";
import { WelcomeScreenTemplate } from "./WelcomeScreenTemplate";
import { messages } from "./messages";
import { useParams } from "react-router";
import { Typography } from "@mui/material";
import { P } from "../../components/Typography";

export const SetPasswordPage = () => {
  const msg = useMsg({ dict: messages });
  const { token, email } = useParams();
  const { resetPasswordMutation } = useAuth();
  const form = useForm({
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const handleSubmit = ({ password, passwordConfirm }, e) => {
    console.log("[Login submit]", { password, passwordConfirm, token });
    if (password !== passwordConfirm) {
      form.setError("passwordConfirm", { message: "Must match" });
      return;
    }

    return resetPasswordMutation.mutate({ password, token });
    // .catch((e) => { form.setError("password", { message: "Error" }); });
  };

  const disabled = resetPasswordMutation.isLoading;
  const errorMsg = resetPasswordMutation.error
    ? msg("auth.login.validation.invalid-credentials")
    : "";

  console.log("[SetPasswordPage.rndr]", {
    disabled,
    errorMsg,
    form,
    resetPasswordMutation,
    token,
    email,
  });

  return (
    <WelcomeScreenTemplate
      perex={
        <>
          <Typography variant="body1" mt={1} mb={3} textAlign="center">
            {msg("auth.invitation.perex")}
          </Typography>
          <P sx={{ color: "black", mt: 0, mb: 3 }}>{email}</P>
        </>
      }
      containerSx={{ mt: 14 }}
    >
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
          <Msg id="auth.login.login" />
        </Button>
      </RHForm>
    </WelcomeScreenTemplate>
  );
};
