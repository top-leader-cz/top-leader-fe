import { always } from "ramda";
import { AuthContext } from "../src/features/Authorization/AuthProvider";

// TODO: https://storybook.js.org/docs/writing-stories/loaders

export const mockAuthFetch =
  ({ mockData, delay = 500 }) =>
  (fetchDef) =>
    new Promise((res) =>
      setTimeout(() => {
        const mock = mockData[`${fetchDef.method || "GET"}${fetchDef.url}`];
        if (!mock) debugger;
        return res(mock || {});
      }, delay)
    );

const noop = () => {};

export const AuthMock = ({ children, authCtx = {}, mockData = {} }) => {
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: true,
        loginMutation: {},
        resetPasswordMutation: {},
        user: { data: {} },
        signout: noop,
        authFetch: mockAuthFetch({ mockData }),
        fetchUser: noop,
        hasAuthority: always(true),
        isUser: true,
        isCoach: true,
        isHR: true,
        isAdmin: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
