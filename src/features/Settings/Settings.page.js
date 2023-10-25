import { useMemo } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { useAuth } from "../Authorization";
import { AvailabilitySettings } from "./AvailabilitySettings";
import { GeneralSettings } from "./GeneralSettings";
import { messages } from "./messages";
import { ProfileSettings } from "./ProfileSettings";
import { TLTabs } from "./Tabs";
import { AdminSettings } from "./AdminSettings";

export const WHITE_BG = { "& .MuiOutlinedInput-root": { bgcolor: "white" } };

const TABS = {
  PROFILE: "PROFILE",
  GENERAL: "GENERAL",
  AVAILABILITY: "AVAILABILITY",
  ADMIN: "ADMIN",
};

const GET_COACH_TABS = ({ msg }) => [
  {
    key: TABS.PROFILE,
    label: msg("settings.tabs.profile.label"),
    Component: ProfileSettings,
  },
  {
    key: TABS.GENERAL,
    label: msg("settings.tabs.general.label"),
    Component: GeneralSettings,
  },
  {
    key: TABS.AVAILABILITY,
    label: msg("settings.tabs.availability.label"),
    Component: AvailabilitySettings,
  },
];
const GET_ADMIN_TAB = ({ msg }) => ({
  key: TABS.ADMIN,
  label: msg("settings.tabs.admin.label"),
  Component: AdminSettings,
});

function SettingsPageInner() {
  // const [tab, setTab] = useState(TABS.AVAILABILITY);
  const msg = useMsg();
  const { isCoach, TODO_RM_isAdmin: isAdmin = true } = useAuth(); // TODO

  const tabs = useMemo(() => {
    const COACH_TABS = GET_COACH_TABS({ msg });
    const tabs = isCoach
      ? COACH_TABS
      : [COACH_TABS.find(({ key }) => key === TABS.GENERAL)];

    return isAdmin ? [...tabs, GET_ADMIN_TAB({ msg })] : tabs;
  }, [isAdmin, isCoach, msg]);

  console.log("[SettingsPageInner.rndr]", { tabs });

  return (
    <Layout>
      <Header text={msg("settings.heading")} noDivider />
      <TLTabs tabs={tabs} />
    </Layout>
  );
}

export function SettingsPage() {
  return (
    <MsgProvider messages={messages}>
      <SettingsPageInner />
    </MsgProvider>
  );
}
