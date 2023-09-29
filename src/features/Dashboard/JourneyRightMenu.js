import { Avatar, Box, Button } from "@mui/material";
import { Icon } from "../../components/Icon";
import { Msg } from "../../components/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, H3, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useContext } from "react";
import { I18nContext } from "../I18n/I18nProvider";
import { format } from "date-fns";
import { useAuth } from "../Authorization";
import { useUserSessionQuery } from "../Sessions/api";
import { QueryRenderer } from "../QM/QueryRenderer";
import { Todos } from "../../components/Todos";

const ActionCardHeading = ({ heading, sx = {} }) => {
  return (
    <Box sx={{ ...sx }}>
      <H3>{heading}</H3>
    </Box>
  );
};

const ActionCard = ({ heading, children, button, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {heading && (
        <ActionCardHeading
          sx={{ mt: 1, alignSelf: "flex-start" }}
          heading={heading}
        />
      )}
      {children}
      {button && <Button fullWidth {...button} />}
    </Box>
  );
};

const EmptyActionCardContent = ({
  iconName = "RocketLaunch",
  title,
  perex,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx,
      }}
    >
      {iconName && (
        <Avatar
          sx={{ bgcolor: "#F9FAFB", width: 100, height: 100, mb: 5, mt: 3 }}
        >
          <Avatar sx={{ bgcolor: "#EAECF0", width: 60, height: 60 }}>
            <Icon name={iconName} sx={{ color: "#667085" }} />
          </Avatar>
        </Avatar>
      )}
      {title && (
        <P emphasized sx={{ mb: 1 }}>
          {title}
        </P>
      )}
      {perex && <P sx={{ mb: 5 }}>{perex}</P>}
    </Box>
  );
};

const Actions = ({ areaOfDevelopment, ...props }) => {
  const sessionQuery = useUserSessionQuery({
    enabled: !!areaOfDevelopment.length,
    refetchOnReconnect: true,
  });

  console.log("[Actions.rndr]", { sessionQuery });

  return (
    <Box {...props}>
      <QueryRenderer
        {...sessionQuery}
        loaderName="Block"
        // data={undefined}
        // isLoading
        success={({
          data: {
            actionSteps = [
              { checked: false, date: "2023-09-06", id: 52, label: "Task1" },
            ],
          },
        }) => (
          <Todos
            // sx={{ my: 2 }} // not working
            items={actionSteps}
            keyProp={"label"}
            {...props}
          />
        )}
      />
    </Box>
  );
};

const SessionsActionCard = ({ ...rest }) => {
  const { i18n } = useContext(I18nContext);
  const { user } = useAuth();
  const areaOfDevelopment = user.data.areaOfDevelopment || [];

  return (
    <Box {...rest}>
      <ActionCard
        heading={`${i18n.formatRelativeLocal(new Date())}, ${i18n.formatLocal(
          new Date(),
          "PP"
        )}`}
        // heading={i18n.translateTokenLocal("today")}
        // heading={i18n.formatLocal(new Date(), "")}
        button={{
          variant: "contained",
          href: routes.newSession,
          children: <Msg id="dashboard.rightmenu.upcoming.start" />,
        }}
      >
        <EmptyActionCardContent
          iconName="RocketLaunch"
          title={<Msg id="dashboard.rightmenu.upcoming.title.empty" />}
          perex={<Msg id="dashboard.rightmenu.upcoming.perex.empty" />}
        />
      </ActionCard>

      <ActionCard
        heading={<Msg id="dashboard.rightmenu.actions.heading" />}
        button={{
          variant: "outlined",
          href: !areaOfDevelopment.length ? routes.newSession : routes.sessions,
          children: <Msg id="dashboard.rightmenu.actions.set-area" />,
        }}
        sx={{ mt: 10, mb: 5 }}
      >
        {!areaOfDevelopment.length ? (
          <EmptyActionCardContent
            iconName="RocketLaunch"
            title={<Msg id="dashboard.rightmenu.actions.title.empty" />}
            perex={<Msg id="dashboard.rightmenu.actions.perex.empty" />}
          />
        ) : (
          <Actions
            areaOfDevelopment={areaOfDevelopment}
            sx={{ py: 0.5, minHeight: "140px" }}
          />
        )}
      </ActionCard>
    </Box>
  );
};

export const JourneyRightMenu = ({ user }) => {
  console.log("[JourneyRightMenu]", { user });

  return (
    <ScrollableRightMenu heading={<Msg id={"dashboard.rightmenu.title"} />}>
      <SessionsActionCard />
    </ScrollableRightMenu>
  );
};
