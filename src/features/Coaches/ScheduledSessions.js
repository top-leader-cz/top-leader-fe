import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { ScheduledSessionsTableRow } from "../Clients/ClientsPage";

// const myCoachMessages = defineMessages({
//   "my-coach.upcoming.all-sessions": {
//     id: "my-coach.upcoming.all-sessions",
//     defaultMessage: "All upcoming sessions",
//   },
// });

export const ScheduledSessionsCard = ({ data }) => {
  //   const msg = useMsg({ dict: myCoachMessages });
  if (!data?.length) return null;
  return (
    <TLTableWithHeader
      headerBefore={
        // <QueryRenderer
        //   {...upcomingSessionsQuery}
        //   success={({ data }) => (
        <ScheduledSessionsTableRow
          data={data}
          colSpan={1}
          sx={{ bgcolor: "white" }}
          type="user"
        />
        //   )}
        // />
      }
    />
  );
};
