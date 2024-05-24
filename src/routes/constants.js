import { generatePath } from "react-router-dom";

const getResetPassPath = (prefix) => `${prefix}/:email?/:token?/*`;

// "/segment1/:param/:optional?/*" // * - splat = whatever https://reactrouter.com/en/main/route/route
export const routes = {
  signIn: "/sign-in",
  setPassword: getResetPassPath("/set-password"),
  setPassword_TODO_1_JAKUB_K: getResetPassPath("/api/public/set-password"),
  resetPassword: getResetPassPath("/reset-password"),
  resetPassword_TODO_1_JAKUB_K: getResetPassPath("/api/public/reset-password"),
  forgotPassword: "/forgot-password/:email?",
  checkEmail: "/check-email/:email",
  passwordChanged: "/password-changed",
  dashboard: "/dashboard",
  assessment: "/assessment",
  strengths: "/strengths",
  setValues: "/set-values",
  myValues: "/my-values",
  sessions: "/sessions",
  newSession: "/new-session",
  editSession: "/session/:id",
  startSession: "/start-session",
  coaches: "/coaches",
  settings: "/settings",
  syncSuccess: "/sync-success",
  syncError: "/sync-error",
  help: "/help",
  getFeedback: "/get-feedback",
  createFeedbackForm: "/get-feedback/create",
  editFeedbackForm: "/get-feedback/edit/:id",
  feedbackResults: "/get-feedback/results/:id",
  externalFeedbackPage: "/feedback/:formId?/:username?/:token?",
  team: "/team",
  clients: "/clients",
  messages: "/messages",
  muiDefaultApp: "/mui-default-app",
  craDefaultApp: "/cra",
  dev: "/dev",
};

export const parametrizedRoutes = {
  editSession: ({ id }) => generatePath(routes.editSession, { id }),
  feedbackResults: ({ id }) => generatePath(routes.feedbackResults, { id }),
  editFeedbackForm: ({ id }) => generatePath(routes.editFeedbackForm, { id }),
  checkEmail: ({ email } = {}) => generatePath(routes.checkEmail, { email }),
  forgotPassword: ({ email } = {}) =>
    generatePath(routes.forgotPassword, { email }),
  settings: ({ tab } = {}) => `${routes.settings}?tab=${tab}`,
};
