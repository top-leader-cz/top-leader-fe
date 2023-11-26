import { Box, Button, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { useCallback, useState } from "react";
import { getCoachLanguagesOptions, getLabel } from "../../components/Forms";
import { useMsg } from "../../components/Msg/Msg";
import { H1, P } from "../../components/Typography";
import { AvailabilityCalendar } from "../Availability/AvailabilityCalendar";
import { useFieldsDict } from "../Settings/useFieldsDict";
import { ContactModal } from "./ContactModal";
import { usePickCoach } from "./api";
import { messages } from "./messages";
import { certificatesOptions } from "../Settings/ProfileSettings";
import { Icon } from "../../components/Icon";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export const ShowMore = ({
  text = "",
  maxChars = 1000,
  moreTranslation = "Show more",
  initialShowAll = false,
}) => {
  const [isMore, setIsMore] = useState(initialShowAll);
  const elipsis = "... ";
  const getShortened = () => (
    <>
      {text.substring(0, maxChars)}
      {elipsis}
      <Button variant="text" onClick={() => setIsMore(true)}>
        {moreTranslation}
      </Button>
    </>
  );
  const maxCharsWithOffset =
    maxChars + elipsis.length + (moreTranslation?.length || 0);

  return isMore || text.length <= maxCharsWithOffset ? text : getShortened();
};

export const CoachInfo = ({
  coach: { name, role, experience, languages, rate, bio, fields } = {},
  maxBioChars = 50,
  sx = {},
}) => {
  const msg = useMsg({ dict: messages });
  const { fieldsOptions } = useFieldsDict();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        ...sx,
      }}
    >
      <H1 gutterBottom>{name}</H1>
      <P gutterBottom>{getLabel(certificatesOptions)(rate)}</P>
      <P gutterBottom>{msg("coaches.coach.experience", { experience })}</P>
      <P gutterBottom>
        {msg("coaches.coach.languages")}
        {": "}
        {languages.map(getLabel(getCoachLanguagesOptions())).join(", ")}
      </P>
      <P gutterBottom>
        {msg("coaches.coach.rate")}
        {": "}
        {rate}
      </P>
      <P
        emphasized
        gutterBottom
        sx={{ fontSize: 14, my: 2, whiteSpace: "normal" }}
      >
        <ShowMore
          maxChars={maxBioChars}
          text={bio}
          moreTranslation={msg("coaches.coach.show-more")}
        />
      </P>
      <Box flex="1 1 auto" display="flex" />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {fields.map(getLabel(fieldsOptions)).map((label) => (
          <Chip
            key={label}
            sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
            label={label}
          />
        ))}
      </Box>
    </Box>
  );
};

export const formatName = ({ firstName, lastName }) =>
  `${firstName ?? ""} ${lastName ?? ""}`.trim();

export const getCoachPhotoUrl = (username) =>
  username ? `/api/latest/coaches/${username}/photo` : "";

export const IntroLink = ({ webLink }) => {
  const msg = useMsg({ dict: messages });

  if (!webLink) return null;

  return (
    <Box
      component={"a"}
      target="_blank"
      rel="noreferrer"
      href={webLink}
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "#101828CC",
        color: "white",
        py: 1,
        textAlign: "center",
        fontSize: 14,
        textDecoration: "none",
      }}
    >
      {msg("coaches.coach.introduction-link")}&nbsp;
      <Icon name={"OpenInNew"} sx={{ fontSize: 14 }} />
    </Box>
  );
};

export const CoachCard = ({
  coach,
  withContact,
  sx = { mb: 3 },
  // onAvailabilityClick,
}) => {
  const {
    username,
    email,
    rate, // TODO
    firstName,
    lastName,
    name = formatName({ firstName, lastName }),
    role, // TODO: rm?
    experience,
    languages,
    bio,
    fields,
    webLink,
  } = coach;
  const [contactCoach, setContactCoach] = useState(null);
  const handleContact = useCallback(() => setContactCoach(coach), [coach]);
  const pickCoach = usePickCoach({ coach });

  // console.log("[CoachCard.rndr]", name, {
  //   coach,
  // });

  return (
    <>
      <Card sx={{ ...sx }}>
        <CardContent sx={{ display: "flex", gap: 3, p: 3 }}>
          <Box
            sx={{
              borderRadius: 0.6,
              minWidth: 225,
              width: 225,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 0.6,
              }}
              image={getCoachPhotoUrl(username)}
              alt={name}
            />
            <IntroLink webLink={webLink} />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <ErrorBoundary>
              <CoachInfo
                coach={{ name, role, experience, languages, rate, bio, fields }}
                maxBioChars={50}
                sx={{
                  // maxWidth: "50%",
                  flexGrow: 2,
                  // minWidth: "200px",
                  maxWidth: "400px",
                  // width: "fit-content",
                }}
              />
            </ErrorBoundary>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                // width: "100%",
              }}
            >
              <ErrorBoundary>
                <AvailabilityCalendar
                  coach={coach}
                  onContact={withContact && handleContact}
                  onPick={pickCoach.onPick}
                  pickPending={pickCoach.pickPending}
                  sx={{ flexShrink: 0 }}
                />
              </ErrorBoundary>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <ContactModal
        coach={contactCoach}
        onClose={() => setContactCoach(null)}
      />
    </>
  );
};
