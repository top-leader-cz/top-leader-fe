import { Box } from "@mui/material";

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Czech", value: "cs" },
  { value: "fr" },
  { value: "de_en" },
  { value: "de_cz" },
  { value: "es" },
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
  { label: "Life", value: "life" },
  { label: "Football", value: "football" },
];

export const getLabel = (options) => (searchValue) =>
  options.find(({ value }) => value === searchValue)?.label || searchValue;
