import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { P } from "../../components/Typography";
import { parametrizedRoutes } from "../../routes/constants";
import { WelcomeScreenTemplate } from "./WelcomeScreenTemplate";
import { messages } from "./messages";

export const CheckEmailPage = () => {
  const msg = useMsg({ dict: messages });
  const { email } = useParams();

  console.log("[CheckEmailPage.rndr]", {
    email,
  });

  return (
    <WelcomeScreenTemplate
      title={msg("auth.check-email.title")}
      perex={
        <>
          <P mt={1} textAlign="center">
            {msg("auth.check-email.perex")}
          </P>
          <P sx={{ mt: 0, mb: 3, fontWeight: 600 }}>{email}</P>
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexFlow: "row wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 1,
        }}
      >
        <Typography variant="body1" textAlign="center">
          {msg("auth.check-email.resend.text")}
        </Typography>
        <Button
          type="button"
          variant="text"
          sx={{ mb: 3 }}
          href={parametrizedRoutes.forgotPassword({ email })}
        >
          <Msg id="auth.check-email.resend.action" />
        </Button>
      </Box>
    </WelcomeScreenTemplate>
  );
};
