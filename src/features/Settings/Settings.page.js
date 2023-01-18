import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  InputAdornment,
  OutlinedInput,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Forms";
import { TextHeader } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import {
  FIELD_OPTIONS,
  getLabel,
  LANGUAGE_OPTIONS,
  renderLanguageOption,
} from "../Coaches/Coaches.page";
import { AutocompleteSelect, color, getOption } from "../Coaches/Fields";

function TabPanel({ children, value, tabName }) {
  console.log("TabPanel", { value, tabName });
  return (
    <Box
      role="tabpanel"
      hidden={value !== tabName}
      id={`simple-tabpanel-${tabName}`}
      aria-labelledby={`simple-tab-${tabName}`}
      sx={{ mt: 3 }}
    >
      {value === tabName && children}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const StyledTab = Tab;

const StyledTabs = styled(Tabs)(({ theme }) => ({
  // padding: "0 8px",
  minWidth: 8,
  minHeight: "16px",
  borderBottom: `1px solid rgba(0,0,0,0.12)`,
  // fontWeight: 400,
  // textTransform: "none",
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 400,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: "8px",
  paddingLeft: 0,
  minWidth: 8,
  minHeight: "16px",
  margin: "0 16px",
  "&:first-of-type": {
    marginLeft: 0,
  },
}));

const StyledOutlinedInput = styled(OutlinedInput)({
  backgroundColor: "white",
});

const BareInputField = ({ name, rules, size = "small", ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState, formState }) => (
        <StyledOutlinedInput size={size} id={name} {...props} {...field} />
      )}
    />
  );
};

// const AutocompleteSelectStyled = styled(AutocompleteSelect)(({ theme }) => ({
//   ".MuiAutocomplete-root .MuiOutlinedInput-root": { backgroundColor: "white" },
// }));

// TODO
const WHITE_BG = { "& .MuiOutlinedInput-root": { bgcolor: "white" } };

// TODO: it seems Autocomplete works only with TextField

const FormRow = ({ children, label, name }) => {
  return (
    <>
      <Divider sx={{ mt: 3, mb: 3 }} />
      <Box display="flex" gap={3} alignItems="center" maxWidth={800}>
        <Box
          minWidth="190px"
          // flex="1 1 100%"
        >
          <P component={"label"} htmlFor={name}>
            {label}
          </P>
        </Box>
        {children}
      </Box>
    </>
  );
};

const B = styled("b")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const FileUpload = ({ name, src = COACH.imageSrc }) => {
  return (
    <>
      <Avatar variant="circular" src={src} sx={{ width: 80, height: 80 }} />
      <Button
        variant="outlined"
        component="label"
        disableRipple
        disableElevation
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          color: (theme) =>
            console.log({ theme }) || theme.palette.text.primary,
          borderColor: "rgba(0, 0, 0, 0.23)",
          backgroundColor: "white",
          boxShadow: "none",
          textTransform: "none",
          height: "130px",
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: "white",
            borderColor: (theme) => theme.palette.common.black,
          },
        }}
      >
        <input hidden accept="image/*" multiple type="file" />
        <Avatar
          variant="circular"
          sx={{ width: 48, height: 48, bgcolor: "#F9FAFB", opacity: 1.6 }}
        >
          <Avatar
            variant="circular"
            sx={{ width: 36, height: 36, bgcolor: "#EAECF0", opacity: 1.4 }}
          >
            <Icon name={"CloudUploadOutlined"} sx={{ color: "#667085" }} />
          </Avatar>
        </Avatar>
        <P gutterBottom sx={{ mt: 1 }}>
          <B>Click to upload </B>
          <span style={{ display: "none", color: "transparent" }}>
            or drag and drop
          </span>
        </P>
        <P>SVG, PNG, JPG or GIF (max. 800 x 400px)</P>
      </Button>
    </>
  );
};

const TABS = {
  PROFILE: "PROFILE",
  GENERAL: "GENERAL",
  AVAILABILITY: "AVAILABILITY",
};

const FIELDS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  imageSrc: "imageSrc",
  bio: "bio",
  timezone: "timezone", // TODO - unknown value
  languages: "languages",
  fields: "fields",
  certificates: "certificates",
  experience: "experience",
};

const FIELDS_GENERAL = {
  language: "language",
};

// const TIMEZONE_OPTIONS = [{ label: "timezone", value: "timezone" }];

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const timeZones = Intl.supportedValuesOf("timeZone");
const TIMEZONE_OPTIONS = timeZones.map((value) => ({ value, label: value })); // TODO: offset https://github.com/marnusw/date-fns-tz#gettimezoneoffset

console.log({ timeZones, TIMEZONE_OPTIONS, tz });

const COACH = {
  [FIELDS.firstName]: "Darnell",
  [FIELDS.lastName]: "Brekke",
  [FIELDS.email]: "darnell.brekke@gmail.com",
  [FIELDS.imageSrc]: `https://i.pravatar.cc/225?u=${Math.random()}`, // TODO: upload form field
  [FIELDS.bio]:
    "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
  [FIELDS.timezone]: Intl.DateTimeFormat().resolvedOptions().timeZone, // TODO: icon + offset
  [FIELDS.languages]: Intl.DateTimeFormat() // TODO: multi
    .resolvedOptions()
    .locale.substring(0, 2),
  // [FIELDS.languages]: navigator.language.substring(0, 2),
  // https://stackoverflow.com/questions/673905/how-to-determine-users-locale-within-browser
  // https://attacomsian.com/blog/javascript-current-timezone
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  [FIELDS.fields]: "business", // TODO: multi
  [FIELDS.certificates]: "Associate Coach Certified - Issued by ICF",
  [FIELDS.experience]: 3, // TODO: field
};

// TODO
export const Profile = ({ coach }) => {
  return null;
};

export function SettingsPage() {
  console.log("[SettingsPage.rndr]", {});
  const form = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues: { ...COACH, ...{ language: "en" } },
  });

  const [tab, setTab] = useState(TABS.PROFILE);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  console.log({ tab });

  return (
    <Layout
      rightMenuContent={
        tab !== TABS.PROFILE ? null : (
          <ScrollableRightMenu
            heading={"Your coach profile preview"}
            buttonProps={{
              children: "Save",
              onClick: () => console.log("Save click"),
            }}
          >
            <Box width="100%" align="left" mt={3}>
              <Box
                component="img"
                borderRadius={2}
                width={225}
                alignSelf={"center"}
                src={COACH.imageSrc}
              />
            </Box>
            <H2 mt={3}>{`${COACH.firstName} ${COACH.lastName}`}</H2>
            <P mt={1}>{COACH.certificates}</P>
            <P mt={1}>Experience: {COACH.experience} years</P>
            <P mt={1}>Languages: {[].concat(COACH.languages).join(", ")}</P>
            <P my={3} color="black">
              {COACH.bio}
            </P>
            <Box display="flex" gap={1}>
              {[]
                .concat(COACH.fields)
                .map(getLabel(FIELD_OPTIONS))
                .map((label) => (
                  <Chip
                    key={label}
                    sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
                    label={label}
                  />
                ))}
            </Box>
          </ScrollableRightMenu>
        )
      }
    >
      <TextHeader text={"Settings"} noDivider />
      <Box sx={{ width: "100%" }}>
        {/* <Box sx={{ borderBottom: 2, borderColor: "divider" }}> */}
        <StyledTabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab
            label={"Profile"}
            value={TABS.PROFILE}
            {...a11yProps(TABS.PROFILE)}
          />
          <StyledTab
            label={"General"}
            value={TABS.GENERAL}
            {...a11yProps(TABS.GENERAL)}
          />
          <StyledTab
            label={"Availability"}
            value={TABS.AVAILABILITY}
            {...a11yProps(TABS.AVAILABILITY)}
          />
        </StyledTabs>
        {/* </Box> */}
        <TabPanel value={tab} tabName={TABS.PROFILE}>
          <FormProvider {...form}>
            <H2 gutterBottom>Personal Info</H2>
            <P sx={{ mb: -1 }}>Update your info here</P>

            <FormRow label="Name" name={FIELDS.lastName}>
              <BareInputField
                name={FIELDS.firstName}
                rules={{ required: true, minLength: 2 }}
                // placeholder={"Type your message"}
                fullWidth
              />
              <BareInputField
                name={FIELDS.lastName}
                rules={{ required: true, minLength: 2 }}
                // placeholder={"Type your message"}
                fullWidth
              />
            </FormRow>

            <FormRow label="Email" name={FIELDS.email}>
              <BareInputField
                name={FIELDS.email}
                autoComplete="email"
                rules={{ required: true, minLength: 4 }}
                fullWidth
              />
            </FormRow>

            <FormRow label="Photo">
              <FileUpload name={FIELDS.imageSrc} />
            </FormRow>

            <FormRow label="Bio" name={FIELDS.bio}>
              <BareInputField
                name={FIELDS.bio}
                rules={{ required: true }}
                fullWidth
                multiline
                rows={4}
              />
            </FormRow>

            <FormRow label="Timezone" name={FIELDS.timezone}>
              <AutocompleteSelect
                sx={WHITE_BG}
                name={FIELDS.timezone}
                options={TIMEZONE_OPTIONS}
                rules={{ required: true }}
                fullWidth
              />
            </FormRow>

            <FormRow label="Languages" name={FIELDS.languages}>
              <AutocompleteSelect
                sx={WHITE_BG}
                name={FIELDS.languages}
                options={LANGUAGE_OPTIONS}
                renderOption={renderLanguageOption}
                placeholder="Select languages you speak"
              />
            </FormRow>

            <FormRow label="Fields" name={FIELDS.fields}>
              <AutocompleteSelect
                sx={WHITE_BG}
                name={FIELDS.fields}
                options={FIELD_OPTIONS}
                placeholder="Select fields you work in"
              />
            </FormRow>

            <FormRow label="Certificates" name={FIELDS.certificates}>
              <BareInputField name={FIELDS.certificates} rules={{}} fullWidth />
            </FormRow>
          </FormProvider>
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.GENERAL}>
          <FormProvider {...form}>
            <H2 gutterBottom>General</H2>
            <P sx={{ mb: -1 }}>Pavel</P>

            <FormRow label="Language" name={FIELDS_GENERAL.language}>
              <AutocompleteSelect
                sx={WHITE_BG}
                name={FIELDS_GENERAL.language}
                options={LANGUAGE_OPTIONS}
                renderOption={renderLanguageOption}
                placeholder="Select languages you speak"
              />
            </FormRow>
          </FormProvider>
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.AVAILABILITY}></TabPanel>
      </Box>
    </Layout>
  );
}
