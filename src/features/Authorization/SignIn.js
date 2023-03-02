import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Msg, MsgProvider } from "../../components/Msg";
// import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./";
import { messages } from "./messages";

export function SignInPage() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const auth = useAuth();
  console.log("Login ");

  // const from = location.state?.from?.pathname || routes.dashboard;

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login submit");

    const formData = new FormData(event.currentTarget);

    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("Login submit", { user });

    auth.signin(user, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      // navigate(from, { replace: true });
    });
  };

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

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={<Msg id="auth.login.email.label" />}
                name="email"
                autoComplete="email"
                autoFocus
                defaultValue={"test@topleader.io"}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={<Msg id="auth.login.password.label" />}
                type="password"
                id="password"
                autoComplete="current-password"
                defaultValue={"Test123"}
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
            </Box>
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
