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
import Assessment from "./components/Assessment";
import Dashboard from "./components/Dashboard";
import { NewSession, Sessions } from "./components/Sessions";
import MuiSignIn from "./components/SignIn";
import Strengths from "./components/Strengths";
import MyValues from "./components/Values/MyValues";
import SetValues from "./components/Values/SetValues";
import CraDefaultApp from "./examples/cra-app/App";
import MuiDefaultApp from "./examples/mui/ExampleApp";
import { AuthRedirect, ForbidAuth, RequireAuth } from "./features/auth";
import { routes } from "./features/navigation";
import ErrorPage from "./routes/ErrorPage";

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
            <MuiSignIn />
          </ForbidAuth>
        ),
      },
      {
        path: routes.dashboard,
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: routes.assessment,
        element: (
          <RequireAuth>
            <Assessment />
          </RequireAuth>
        ),
      },
      {
        path: routes.strengths,
        element: (
          <RequireAuth>
            <Strengths />
          </RequireAuth>
        ),
      },
      {
        path: routes.setValues,
        element: (
          <RequireAuth>
            <SetValues />
          </RequireAuth>
        ),
      },
      {
        path: routes.myValues,
        element: (
          <RequireAuth>
            <MyValues />
          </RequireAuth>
        ),
      },
      {
        path: routes.sessions,
        element: (
          <RequireAuth>
            <Sessions />
          </RequireAuth>
        ),
      },
      {
        path: routes.newSession,
        element: (
          <RequireAuth>
            <NewSession />
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
