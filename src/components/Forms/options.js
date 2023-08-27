import { Box } from "@mui/material";

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "cs", label: "Čeština" },
  { value: "fr", label: "fr" },
  { value: "de_en", label: "de_en" },
  { value: "de_cz", label: "de_cz" },
  { value: "es", label: "es" },
];

const getFlagSrc = (option, isBigger) => {
  let code = option.value.toLowerCase();
  if (code === "en") code = "gb";
  if (code === "cs") code = "cz";

  if (isBigger) return `https://flagcdn.com/40x30/${code}.png 2x`;
  else return `https://flagcdn.com/20x15/${code}.png`;
};

export const renderLanguageOption = (props, option, { selected } = {}) => (
  <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
    <img
      loading="lazy"
      width="20"
      src={getFlagSrc(option)}
      srcSet={getFlagSrc(option, true)}
      alt=""
    />
    {option.label} ({option.value})
  </Box>
);

export const FIELD_OPTIONS = [
  { label: "Business", value: "business" },
  { label: "Career", value: "career" },
  { label: "Change", value: "change" },
  { label: "Communication", value: "communication" },
  { label: "Confidence", value: "confidence" },
  { label: "Conflict", value: "conflict" },
  { label: "Diversity", value: "diversity" },
  { label: "Entrepreneurship", value: "entrepreneurship" },
  { label: "Executive", value: "executive" },
  { label: "Facilitation", value: "facilitation" },
  { label: "Fitness", value: "fitness" },
  { label: "Health", value: "health" },
  { label: "Leadership", value: "leadership" },
  { label: "Life", value: "life" },
  { label: "Management", value: "management" },
  { label: "Mental fitness", value: "mental_fitness" },
  { label: "Mentorship", value: "mentorship" },
  { label: "Negotiations", value: "negotiations" },
  { label: "Organizational Development", value: "organizational_development" },
  { label: "Performance", value: "performance" },
  { label: "Relationships", value: "relationships" },
  { label: "Sales", value: "sales" },
  { label: "Teams", value: "teams" },
  { label: "Time Management", value: "time_management" },
  { label: "Transformations", value: "transformations" },
  { label: "Wellbeing", value: "wellbeing" },
  { label: "Women", value: "women" },
];

export const getLabel = (options) => (searchValue) =>
  options.find(({ value }) => value === searchValue)?.label || searchValue;
