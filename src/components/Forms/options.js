import { Box } from "@mui/material";

export const LANGUAGE_OPTIONS = [
  { value: "cs", label: "Čeština" },
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "en-GB", label: "GB English" },
  { value: "en-US", label: "US English" },
  { value: "fr", label: "Français" },
  // { value: "es", label: "es" },
  // { value: "de_en", label: "de_en" },
  // { value: "de_cz", label: "de_cz" },
];

const getFlagSrc = (option, isBigger) => {
  let code = option.value.toLowerCase();
  if (code === "en") code = "gb";
  if (code === "en-us") code = "us";
  if (code === "en-gb") code = "gb";
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

export const getLabel = (options) => (searchValue) =>
  options.find(({ value }) => value === searchValue)?.label || searchValue;
