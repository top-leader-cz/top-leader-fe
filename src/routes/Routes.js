import { LinearProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  createBrowserRouter,
  Form,
  Outlet,
  redirect,
  useNavigation,
} from "react-router-dom";
import { AuthProvider, AuthRedirect } from "../features/Auth/Redirects";
import CraDefaultApp from "../examples/cra-app/App";
import MuiDefaultApp from "../examples/mui/ExampleApp";
import { AssessmentPage } from "../features/Assessment";
// import {
// AuthRedirect,
// ForbidAuth,
// RequireAuth,
// SignInPage,
// } from "../features/Auth";
import { DashboardPage } from "../features/Dashboard";
import { NewSessionPage, SessionsPage } from "../features/Sessions";
import { StrengthsPage } from "../features/Strengths";
import { MyValuesPage, SetValuesPage } from "../features/Values";
import { routes } from "./constants";
import ErrorPage from "./ErrorPage";
import { EditSessionPage } from "../features/Sessions/EditSession.page";

// const AuthRedirect = "div";
const RequireAuth = "div";
const ForbidAuth = "div";
const SignInPage = "div";

const GlobalSpinner = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

const Root = ({ children, ...props }) => {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === "loading" && <GlobalSpinner />}
      <Outlet />
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AuthRedirect /> },
      {
        path: routes.signIn,
        element: (
          <ForbidAuth>
            <SignInPage />
          </ForbidAuth>
        ),
      },
      {
        path: routes.dashboard,
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.assessment,
        element: (
          <RequireAuth>
            <AssessmentPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.strengths,
        element: (
          <RequireAuth>
            <StrengthsPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.setValues,
        element: (
          <RequireAuth>
            <SetValuesPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.myValues,
        element: (
          <RequireAuth>
            <MyValuesPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.sessions,
        element: (
          <RequireAuth>
            <SessionsPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.newSession,
        element: (
          <RequireAuth>
            <NewSessionPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.editSession,
        element: (
          <RequireAuth>
            <EditSessionPage />
          </RequireAuth>
        ),
      },
      {
        path: routes.muiDefaultApp,
        element: <MuiDefaultApp />,
      },
      {
        path: routes.craDefaultApp,
        element: <CraDefaultApp />,
      },
    ],
  },
]);

const delay = (ms = 750, value = {}) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function rootLoader({ params }) {
  const contacts = await delay(1500);
  return { contacts };
}

// async function editAction({ request, params }) {
//   const formData = await request.formData();
//   const updates = Object.fromEntries(formData);
//   await updateContact(params.contactId, updates);
//   return redirect(`/contacts/${params.contactId}`);
// }

const Root2 = () => {
  // const { contacts } = useLoaderData();

  return <Outlet />;
};

export const router1 = createBrowserRouter([
  {
    path: "/",
    element: <Root2 />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: async function rootAction() {
      await delay();
    },
    children: [
      {
        path: "contacts/:contactId",
        element: (
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              // eslint-disable-next-line no-restricted-globals
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        ),
      },
      {
        path: "contacts/:contactId/destroy",
        action: async function action({ params }) {
          throw new Error("oh dang!");
          await delay(params.contactId);
          return redirect("/");
        },
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
]);
