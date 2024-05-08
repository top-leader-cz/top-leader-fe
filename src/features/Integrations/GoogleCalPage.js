import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";
import { EmptyTemplate } from "../Feedback/EmptyTemplate";
import { routes } from "../../routes";
import { EmailTo } from "../Authorization/WelcomeScreenTemplate";
import { Layout } from "../../components/Layout";

const messages = defineMessages({
  "google.success.title": {
    id: "google.success.title",
    defaultMessage: "Success",
  },
  "google.success.description": {
    id: "google.success.description",
    defaultMessage:
      "Your Google Calendar has been successfully integrated with the TopLeader platform. You can now close this window by clicking the button below.",
  },

  "google.error.title": {
    id: "google.error.title",
    defaultMessage: "Failed",
  },
  "google.error.description": {
    id: "google.error.description",
    defaultMessage:
      "Unfortunately, we were unable to integrate your Google Calendar with the TopLeader platform at this time. Please try again later. If the issue persists, do not hesitate to contact us at {emailLink} for assistance.",
  },

  "google.back-to-dashboard": {
    id: "google.back-to-dashboard",
    defaultMessage: "Back to dashboard",
  },
});

export function GoogleCalPage({ result }) {
  const msg = useMsg({ dict: messages });

  if (result === "success")
    return (
      <Layout>
        <EmptyTemplate
          title={msg("google.success.title")}
          description={msg("google.success.description")}
          iconName="ChatBubbleOutlineOutlined"
          button={{
            variant: "contained",
            children: msg("google.back-to-dashboard"),
            href: routes.dashboard,
          }}
        />
      </Layout>
    );

  if (result === "error")
    return (
      <Layout>
        <EmptyTemplate
          title={msg("google.error.title")}
          description={msg("google.error.description", {
            emailLink: (
              <EmailTo
                email={"support@topleader.io"}
                subject={"Calendar Sync Failed"}
                withIcon={false}
              />
            ),
          })}
          iconName="ChatBubbleOutlineOutlined"
          button={{
            variant: "contained",
            children: msg("google.back-to-dashboard"),
            href: routes.dashboard,
          }}
        />
      </Layout>
    );

  return (
    <Layout>
      <EmptyTemplate
        title={" "}
        iconName="ChatBubbleOutlineOutlined"
        button={{
          variant: "contained",
          children: msg("google.back-to-dashboard"),
          href: routes.dashboard,
        }}
      />
    </Layout>
  );
}
