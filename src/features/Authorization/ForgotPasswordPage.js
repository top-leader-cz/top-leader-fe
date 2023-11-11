import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Icon } from "../../components/Icon";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { useAuth } from "./AuthProvider";
import { WelcomeScreenTemplate } from "./WelcomeScreenTemplate";
import { messages } from "./messages";
import { routes } from "../../routes";

const useForgotPasswordMutation = (params = {}) => {
  const { authFetch } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ username, locale = "cs" }) =>
      authFetch({
        method: "POST",
        url: "/api/public/reset-password-link",
        data: { username, locale },
      }),
    ...params,
  });

  return mutation;
};

export const ForgotPasswordPage = () => {
  const msg = useMsg({ dict: messages });
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm({
    defaultValues: { username: "" },
  });
  const handleSubmit = ({ username }, e) => {
    console.log("[submit]", { username });
    // if (password !== passwordConfirm) {
    //   form.setError("passwordConfirm", { message: "Must match" });
    //   return;
    // }

    return forgotPasswordMutation.mutate({ username });
    // .catch((e) => { form.setError("password", { message: "Error" }); });
  };

  const disabled = forgotPasswordMutation.isLoading;
  const errorMsg = forgotPasswordMutation.error ? "Oops!" : "";

  console.log("[ForgotPasswordPage.rndr]", {
    disabled,
    errorMsg,
    form,
    forgotPasswordMutation,
  });

  return (
    <WelcomeScreenTemplate
      title={msg("auth.forgot-pass.title")}
      perex={
        <>
          <Typography variant="body1" mt={1} mb={3} textAlign="center">
            {msg("auth.forgot-pass.perex")}
          </Typography>
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
          name="username"
          label={<Msg id="auth.forgot-pass.username.label" />}
          id="username"
          autoComplete="email"
          error={!!errorMsg}
          helperText={errorMsg}
          // size="small"
        />
        <Button
          type="submit"
          disabled={disabled}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 0 }}
        >
          <Msg id="auth.forgot-pass.submit" />
        </Button>
        <Button
          type="button"
          disabled={disabled}
          fullWidth
          variant="text"
          sx={{ mt: 3, mb: 3 }}
          startIcon={<Icon name="ArrowBack" />}
          href={routes.signIn}
        >
          <Msg id="auth.forgot-pass.back" />
        </Button>
      </RHForm>
    </WelcomeScreenTemplate>
  );
};
