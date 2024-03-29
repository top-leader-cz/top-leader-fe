import { Box, Button, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { intersperse, pipe, split } from "ramda";
import { useCallback, useRef, useState } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { getCoachLanguagesOptions, getLabel } from "../../components/Forms";
import { useIntersection } from "../../components/Forms/hooks";
import { Icon } from "../../components/Icon";
import { useMsg } from "../../components/Msg/Msg";
import { H1, P } from "../../components/Typography";
import { AvailabilityCalendar } from "../Availability/AvailabilityCalendar";
import {
  LinkedInProfileMaybe,
  certificatesOptions,
} from "../Settings/ProfileSettings";
import { useFieldsDict } from "../Settings/useFieldsDict";
import { ContactModal } from "./ContactModal";
import { usePickCoach } from "./api";
import { messages } from "./messages";
import { nonbreakableSubstr } from "./nonbreakableSubstr";

// dangerouslySetInnerHTML is not safe, can we trust it?
const renderSafeWithBreaks = pipe(split("\n"), intersperse(<br />), (arr) => (
  <>{arr}</>
));

export const ShowMore = ({
  text: textProp,
  maxChars = 1000,
  moreTranslation = "Show more",
  initialShowAll = false,
}) => {
  const [isMore, setIsMore] = useState(initialShowAll);
  // const text = (textProp || "").replace(/(\\n){2,}/, "\n"); // TODO
  const text = textProp || "";
  const elipsis = "... ";
  const maxCharsWithOffset =
    maxChars + elipsis.length + (moreTranslation?.length || 0);
  const canFit = text.replaceAll("\n", "").length <= maxCharsWithOffset;

  const withShowMore = (text) => (
    <>
      {renderSafeWithBreaks(text)}
      {elipsis}
      <Button
        variant="text"
        sx={{ lineHeight: 1 }}
        onClick={() => setIsMore(true)}
        disableFocusRipple
        disableRipple
      >
        {moreTranslation}
      </Button>
    </>
  );

  return isMore || canFit
    ? renderSafeWithBreaks(text)
    : withShowMore(nonbreakableSubstr("\n", maxChars, text));
};

export const CoachInfo = ({
  coach: {
    name,
    role,
    experience,
    languages,
    rate,
    bio,
    fields,
    linkedinProfile,
  } = {},
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
      <LinkedInProfileMaybe href={linkedinProfile} />
    </Box>
  );
};

export const formatName = ({ firstName, lastName } = {}) =>
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
    linkedinProfile,
  } = coach;
  const [contactCoach, setContactCoach] = useState(null);
  const [wasVisible, setWasVisible] = useState(false);
  const handleContact = useCallback(() => setContactCoach(coach), [coach]);
  const pickCoach = usePickCoach({ coach });

  const elementRef = useRef();
  useIntersection({
    elementRef,
    onVisibleOnce: () => setWasVisible(true),
  });

  // console.log("[CoachCard.rndr]", name, { isVisible, coach, wasVisible });

  return (
    <>
      <Card sx={{ ...sx }} ref={elementRef}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            p: 3,
          }}
        >
          <Box
            sx={{
              borderRadius: 0.6,
              minWidth: { xs: 225 },
              width: { xs: 225 },
              maxHeight: 500,
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
              image={wasVisible ? getCoachPhotoUrl(username) : undefined}
              alt={name}
            />
            <IntroLink webLink={webLink} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              width: "100%",
              // justifyContent: "space-around",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: { xs: "center", md: "flex-end" },
              // justifyContent: "flex-start",
            }}
          >
            <ErrorBoundary>
              <CoachInfo
                coach={{
                  name,
                  role,
                  experience,
                  languages,
                  rate,
                  bio,
                  fields,
                  linkedinProfile,
                }}
                maxBioChars={250}
                sx={{
                  flexGrow: 2,
                  width: { md: "280px" },
                  maxWidth: "100%",
                }}
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <AvailabilityCalendar
                coach={coach}
                onContact={withContact && handleContact}
                onPick={pickCoach.onPick}
                pickPending={pickCoach.pickPending}
                fetchDisabled={!wasVisible}
                sx={{ alignSelf: { xs: "auto", md: "end" } }}
              />
            </ErrorBoundary>
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
