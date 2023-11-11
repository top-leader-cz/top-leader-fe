import { Navigate } from "react-router-dom";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { useSessionsQuery } from "./Sessions";
import { parametrizedRoutes } from "../../routes/constants";
import { QueryRenderer } from "../QM/QueryRenderer";

export function StartSessionPage() {
  const { user } = useAuth();
  const isFirstSession = !user.data.areaOfDevelopment?.length;
  const sessionsQuery = useSessionsQuery({ enabled: !isFirstSession });
  const newSessionRedirect = <Navigate to={routes.newSession} replace />;

  console.log("StartSessionPage", { sessionsQuery, isFirstSession, user });

  if (isFirstSession) return newSessionRedirect;
  else
    return (
      <QueryRenderer
        {...sessionsQuery}
        loaderName="Backdrop"
        success={({ data }) => {
          console.log("StartSessionPage query", {
            data,
            sessionsQuery,
            isFirstSession,
            user,
          });
          if (sessionsQuery.isLoading) return null;
          const lastSessionMaybe = data[0];
          if (!lastSessionMaybe) return newSessionRedirect;
          else
            return (
              <Navigate
                to={parametrizedRoutes.editSession({ id: lastSessionMaybe.id })}
                replace
              />
            );
        }}
      />
    );
}
