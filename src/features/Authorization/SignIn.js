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
import { parametrizedRoutes } from "../../routes/constants";

export function SignInPage() {
  const { loginMutation } = useAuth();
  const msg = useMsg({ dict: messages });
  const form = useForm({
    defaultValues: { email: "", password: "" },
  });
  const handleSubmit = ({ email, password }, e) => {
    console.log("[Login submit]", { username: email, password });
    return loginMutation.mutate({
      username: email,
      password,
    });
    // .catch((e) => { form.setError("email", { message: "" }); form.setError("password", { message }); });
  };

  const disabled = loginMutation.isLoading;
  const errorMsg = loginMutation.error
    ? msg("auth.login.validation.invalid-credentials")
    : "";

  console.log("[SignIn.rndr]", { disabled, errorMsg, form, loginMutation });

  return (
    <WelcomeScreenTemplate>
      <RHForm form={form} onSubmit={handleSubmit}>
        <RHFTextField
          debug={{ msg: "email", color: "crimson" }}
          margin="normal"
          required
          rules={{
            required: {
              value: true,
              message: <Msg id="auth.login.email.validation.required" />,
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: <Msg id="auth.login.email.validation.pattern" />,
            },
          }}
          fullWidth
          id="email"
          label={<Msg id="auth.login.email.label" />}
          name="email"
          autoComplete="email"
          autoFocus
        />
        <RHFTextField
          margin="normal"
          required
          rules={{ required: "Required" }}
          fullWidth
          name="password"
          label={<Msg id="auth.login.password.label" />}
          type="password"
          id="password"
          autoComplete="current-password"
          error={!!errorMsg}
          helperText={errorMsg}
        />

        {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
        <Button
          fullWidth
          variant="text"
          href={parametrizedRoutes.forgotPassword()}
          sx={{
            width: "auto",
            float: "right",
            // justifyContent: "flex-end"
          }}
        >
          <Msg id="auth.login.forgot" />
        </Button>
        {/* <Link href="#" variant="body2">
                Forgot password
              </Link> */}
        <Button
          type="submit"
          disabled={disabled}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 3 }}
          // href={routes.dashboard}
        >
          <Msg id="auth.login.login" />
        </Button>
        {/* <Divider />
        <Button
          type="button"
          disabled={disabled}
          fullWidth
          variant="outlined"
          sx={{ mt: 3 }}
          startIcon={
            <Avatar
              sx={{ width: 20, height: 20 }}
              variant="square"
              src={"google-small.png"}
            />
          }
        >
          <Msg id="auth.login.google" />
        </Button>
        <Button
          type="button"
          disabled={disabled}
          fullWidth
          variant="outlined"
          sx={{ mt: 3, mb: 3 }}
          startIcon={
            <Avatar
              sx={{ width: 20, height: 20 }}
              variant="square"
              src={"microsoft-small.png"}
            />
          }
        >
          <Msg id="auth.login.microsoft" />
        </Button> */}
        {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </RHForm>
    </WelcomeScreenTemplate>
  );
}
