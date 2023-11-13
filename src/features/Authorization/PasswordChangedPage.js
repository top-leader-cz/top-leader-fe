import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { P } from "../../components/Typography";
import { routes } from "../../routes/constants";
import { WelcomeScreenTemplate } from "./WelcomeScreenTemplate";
import { messages } from "./messages";

export const PasswordChangedPage = () => {
  const msg = useMsg({ dict: messages });

  console.log("[PasswordChangedPage.rndr]", {});

  return (
    <WelcomeScreenTemplate
      title={msg("auth.password-changed.title")}
      perex={
        <P mt={1} textAlign="center">
          {msg("auth.password-changed.perex")}
        </P>
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
        <Button
          type="button"
          variant="contained"
          fullWidth
          sx={{ mx: 3, my: 3 }}
          href={routes.signIn}
        >
          <Msg id="auth.password-changed.login" />
        </Button>
      </Box>
    </WelcomeScreenTemplate>
  );
};
