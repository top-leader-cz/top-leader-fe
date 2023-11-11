import { generatePath } from "react-router-dom";

export const routes = {
  signIn: "/sign-in",
  setPassword: "/set-password/:email/:token/*",
  setPassword_TODO_1_JAKUB_K:
    "/api/public/set-password/:email/:token/:param1?/:param2?",
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
  getFeedback: "/get-feedback",
  team: "/team",
  clients: "/clients",
  messages: "/messages",
  muiDefaultApp: "/mui-default-app",
  craDefaultApp: "/cra",
  dev: "/dev",
};

export const parametrizedRoutes = {
  editSession: ({ id }) => generatePath(routes.editSession, { id }),
};
