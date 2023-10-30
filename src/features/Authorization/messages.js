import { defineMessages } from "react-intl";

export const messages = defineMessages({
  "auth.unauthorized.title": {
    id: "auth.unauthorized.title",
    defaultMessage: "Welcome to TopLeader",
  },
  "auth.unauthorized.perex": {
    id: "auth.unauthorized.perex",
    defaultMessage: "Please enter your details",
  },
  "auth.login.email.label": {
    id: "auth.login.email.label",
    defaultMessage: "Email",
  },
  "auth.login.email.validation.required": {
    id: "auth.login.email.validation.required",
    defaultMessage: "Required",
  },
  "auth.login.email.validation.pattern": {
    id: "auth.login.email.validation.pattern",
    defaultMessage: "The email is not valid",
  },
  "auth.login.password.label": {
    id: "auth.login.password.label",
    defaultMessage: "Password",
  },
  "auth.login.password-confirm.label": {
    id: "auth.login.password-confirm.label",
    defaultMessage: "Confirm password",
  },
  "auth.login.validation.invalid-credentials": {
    id: "auth.login.validation.invalid-credentials",
    defaultMessage: "Invalid credentials",
  },
  "auth.login.forgot": {
    id: "auth.login.forgot",
    defaultMessage: "Forgot password",
  },
  "auth.login.login": {
    id: "auth.login.login",
    defaultMessage: "Log In",
  },
  "auth.login.google": {
    id: "auth.login.google",
    defaultMessage: "Sign in with Google",
  },
  "auth.login.microsoft": {
    id: "auth.login.microsoft",
    defaultMessage: "Sign in with Microsoft",
  },
  "auth.invitation.perex": {
    id: "auth.invitation.perex",
    defaultMessage:
      "You’ve been invited to join TopLeader. Please set a password to complete the registration",
  },
});
