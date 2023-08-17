import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Msg, MsgProvider } from "../../components/Msg";
// import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { RHForm } from "../../components/Forms/Form";
import { useAuth } from "./";
import { messages } from "./messages";
import { useMsg } from "../../components/Msg/Msg";

export function SignInPage() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const auth = useAuth();
  const msg = useMsg({ dict: messages });
  console.log("Login ");
  const form = useForm({
    defaultValues: { email: "slavik.dan12@gmail.com", password: "pass" },
  });

  // const from = location.state?.from?.pathname || routes.dashboard;

  const handleSubmit = (data, e) => {
    console.log("[Login submit]", data);
    return auth.signin(data);
    // .catch((e) => {
    //   console.log({ e });
    //   const message = msg("auth.login.validation.invalid-credentials");
    //   form.setError("email", { message: "" });
    //   form.setError("password", { message });
    // });
  };
  console.log("[SignInPage.rndr]", { auth });

  const disabled = auth.user.isLoading && auth.user.fetchStatus === "fetching";
  const errorMsg = auth.user.error
    ? msg("auth.login.validation.invalid-credentials")
    : "";

  return (
    <MsgProvider messages={messages}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              // mt: "200px",
              my: 8,
              // mx: 4,
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
