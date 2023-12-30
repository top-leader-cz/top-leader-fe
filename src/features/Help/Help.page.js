import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";
import { EmptyTemplate } from "../Feedback/EmptyTemplate";
import { routes } from "../../routes";
import { EmailTo } from "../Authorization/WelcomeScreenTemplate";
import { Layout } from "../../components/Layout";

const messages = defineMessages({
  "help.title": {
    id: "help.title",
    defaultMessage: "Get help",
  },
  "help.description": {
    id: "help.description",
    defaultMessage: "If you need help, please email us at {emailLink}",
  },
  "help.back-to-dashboard": {
    id: "help.back-to-dashboard",
    defaultMessage: "Back to dashboard",
  },
});

export function HelpPage() {
  const msg = useMsg({ dict: messages });
  return (
    <Layout>
      <EmptyTemplate
        title={msg("help.title")}
        description={msg("help.description", {
          // emailLink: "support@topleader.io",
          emailLink: (
            <EmailTo
              email={"support@topleader.io"}
              subject={"GetHelp"}
              withIcon={false}
            />
          ),
        })}
        iconName="ChatBubbleOutlineOutlined"
        button={{
          variant: "contained",
          children: msg("help.back-to-dashboard"),
          href: routes.dashboard,
        }}
      />
    </Layout>
  );
}
