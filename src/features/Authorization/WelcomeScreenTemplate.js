import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Icon } from "../../components/Icon";
import { Msg, MsgProvider } from "../../components/Msg";
import { P } from "../../components/Typography";
import { messages } from "./messages";

const EMAIL = "support@topleader.io";
const EMAIL_SUBJECT = "SignIn";

export const EmailTo = ({
  email = EMAIL,
  subject = "MessageFromTLPlatform",
  withIcon = true,
  sx = {},
}) => {
  return (
    <P
      component="a"
      href={`mailto:${email}?subject=${subject}`}
      target="_blank"
      sx={{
        color: "#475467",
        fontWeight: 500,
        textDecoration: "none",
        display: "inline-flex",
        ...sx,
      }}
    >
      {withIcon ? (
        <>
          <Icon name="MailOutline" sx={{ fontSize: "16px" }} />
          &nbsp;
        </>
      ) : (
        ""
      )}
      {email}
    </P>
  );
};

export const WelcomeScreenTemplate = ({
  title = <Msg id="auth.unauthorized.title" />,
  perex = (
    <Typography variant="body1" mt={1} mb={4} textAlign="center">
      <Msg id="auth.unauthorized.perex" />
    </Typography>
  ),
  children,
  containerSx = {},
}) => {
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
              my: { xs: "10%", md: "15%" },
              mx: { xs: "10%", md: "22%", lg: "25%" },
              // width: "33%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              ...containerSx,
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
            <Typography variant="h1" mt={3} sx={{ textAlign: "center" }}>
              {title}
            </Typography>
            {/* <Typography variant="subtitle2" mt={1} mb={5}>
              Please enter your details
            </Typography> */}
            {perex}

            {/* <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            > */}
            {children}
            {/* </Box> */}
          </Box>
          <Box sx={{ position: "absolute", right: "24px", bottom: "24px" }}>
            <EmailTo email={EMAIL} subject={EMAIL_SUBJECT} />
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
};
