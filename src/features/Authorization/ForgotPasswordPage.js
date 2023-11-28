import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Icon } from "../../components/Icon";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { routes } from "../../routes";
import { parametrizedRoutes } from "../../routes/constants";
import { I18nContext } from "../I18n/I18nProvider";
import { useMyMutation } from "./AuthProvider";
import { WelcomeScreenTemplate } from "./WelcomeScreenTemplate";
import { messages } from "./messages";

export const useForgotPasswordMutation = (params = {}) => {
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: "/api/public/reset-password-link",
      // from: evolve({ username: trim, locale: identity }),
    },
    ...params,
  });

  return mutation;
};

export const ForgotPasswordPage = () => {
  const msg = useMsg({ dict: messages });
  const { email } = useParams();
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const { language } = useContext(I18nContext);
  const form = useForm({
    defaultValues: { username: email || "" },
  });
  const handleSubmit = async ({ username }, e) => {
    await forgotPasswordMutation.mutateAsync({
      username,
      locale: language.substring(0, 2),
    });
    // .catch((e) => { form.setError("password", { message: "Error" }); });
    navigate(parametrizedRoutes.checkEmail({ email: username }));
  };

  const disabled = forgotPasswordMutation.isLoading;
  const errorMsg = forgotPasswordMutation.error?.message;

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
