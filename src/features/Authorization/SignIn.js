import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { useAuth } from "./";
import { messages } from "./messages";
import { H2, P } from "../../components/Typography";
import { Icon } from "../../components/Icon";

const EMAIL = "support@topleader.io";
const EMAIL_SUBJECT = "SignIn";

export function SignInPage() {
  const { signin, loginMutation } = useAuth();
  const msg = useMsg({ dict: messages });
  const form = useForm({
    defaultValues: { email: "slavik.dan12@gmail.com", password: "pass" },
  });
  const handleSubmit = ({ email, password }, e) => {
    console.log("[Login submit]", { username: email, password });
    return signin({ username: email, password });
    // .catch((e) => { form.setError("email", { message: "" }); form.setError("password", { message }); });
  };

  const disabled = loginMutation.isLoading;
  const errorMsg = loginMutation.error
    ? msg("auth.login.validation.invalid-credentials")
    : "";

  console.log("[SignIn.rndr]", { disabled, errorMsg, form, loginMutation });

  return (
    <MsgProvider messages={messages}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
          sx={{ position: "relative" }}
        >
          <Box
            sx={{
              my: 8,
              mx: "25%",
              // width: "33%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                // bgcolor: "secondary.main",
              }}
              variant="rounded"
              src={"/logo-min.png"}
            >
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography variant="h1" mt={3}>
              <Msg id="auth.unauthorized.title" />
            </Typography>
            {/* <Typography variant="subtitle2" mt={1} mb={5}>
              Please enter your details
            </Typography> */}
            <Typography variant="body1" mt={1} mb={4}>
              <Msg id="auth.unauthorized.perex" />
            </Typography>

            {/* <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            > */}
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
              <Divider />
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
              </Button>
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
            {/* </Box> */}
          </Box>
          <Box sx={{ position: "absolute", right: "24px", bottom: "24px" }}>
            <P
              component="a"
              href={`mailto:${EMAIL}?subject=${EMAIL_SUBJECT}`}
              target="_blank"
              sx={{
                color: "#475467",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
              }}
            >
              <Icon name="MailOutline" sx={{ fontSize: "16px" }} />
              &nbsp;{EMAIL}
            </P>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            // backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundImage: "url(/image1.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </MsgProvider>
  );
}
