import { Box } from "@mui/material";
import { curryN, when } from "ramda";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { useAuth } from "../Authorization";
import { AvailabilityCalendar } from "../Availability/AvailabilityCalendar";
import { CoachInfo } from "../Coaches/CoachCard";
import { usePickCoach } from "../Coaches/api";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useCoachQuery } from "./api";
import { useImgLoading } from "./Messages.page";

const errIs = curryN(2, (statusCode, e) => e?.response?.status === statusCode);

export const MessagesRightMenu = ({
  username,
  msg,
  rightOpen,
  setRightOpen,
}) => {
  const { user } = useAuth();
  const coachQuery = useCoachQuery({
    username,
    onError: when(errIs(404), () => setRightOpen(false)),
    onSuccess: () => setRightOpen(true),
  });
  const pickCoach = usePickCoach({ coach: coachQuery.data });
  const profilePhotoSrc = `/api/latest/coaches/${username}/photo`;
  const canPickCoach = user.data.coach !== username;

  const avatarImgBag = useImgLoading({ imgId: profilePhotoSrc });
  //   console.log("[MessagesRightMenu.rndr]", { coachQuery });

  return (
    <ScrollableRightMenu
      buttonProps={
        canPickCoach &&
        pickCoach.onPick && {
          children: msg("messages.aside.pick-coach"),
          type: "button",
          variant: "outlined",
          disabled: pickCoach.pickPending,
          onClick: pickCoach.onPick,
        }
      }
      sx={{ whiteSpace: "normal" }}
    >
      <Box width="100%" align="left" mt={3}>
        {/* <object data="https://placehold.co/400x400?text=Incognito" type="image/png" > */}
        <Box
          component="img"
          borderRadius={1}
          width={225}
          alignSelf={"center"}
          src={profilePhotoSrc}
          alt={`${username}`}
          onLoad={avatarImgBag.onLoad}
          sx={avatarImgBag.fadeInOutSx}
        />
        {/* </object> */}
      </Box>
      <QueryRenderer
        {...coachQuery}
        loaderName="Block"
        errored={(e) => {
          // console.log("coachQuery.errored.rndr", { e })
          return null;
        }}
        success={({ data: coach }) => (
          <>
            <CoachInfo coach={coach} maxBioChars={2000} sx={{ my: 3 }} />
            <AvailabilityCalendar coach={coach} sx={{ flexShrink: 0 }} />
          </>
        )}
      />
    </ScrollableRightMenu>
  );
};
