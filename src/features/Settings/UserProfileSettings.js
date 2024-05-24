import { FormProvider, useForm } from "react-hook-form";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { H2, P } from "../../components/Typography";
import { FormRow } from "./FormRow";
import { Box, Button } from "@mui/material";
import { useCompaniesQuery } from "./Admin/api";
import { useLoadableOptions } from "../../components/Forms/hooks";
import { AutocompleteSelect, BareInputField } from "../../components/Forms";
import {
  always,
  applySpec,
  identity,
  isNotNil,
  map,
  mergeRight,
  omit,
  pickBy,
  prop,
  useWith,
} from "ramda";
import { formatName } from "../Coaches/CoachCard";
import { WHITE_BG } from "./Settings.page";
import { RHForm } from "../../components/Forms/Form";
import { ControlsContainer } from "../Sessions/steps/Controls";

const FIELDS = {
  firstName: "firstName",
  lastName: "lastName",
  username: "username",

  company: "company",
  businessStrategy: "businessStrategy",
  manager: "manager",

  position: "position",
  aspiredCompetency: "aspiredCompetency",
  aspiredPosition: "aspiredPosition",

  // industry: "industry",
  // department: "department",
  // hrManager: "hrManager",
};
const READ_ONLY = [FIELDS.username, FIELDS.company, FIELDS.businessStrategy];

/* PUT
  "firstName": "changed first name",
  "lastName": "changed last name",
  
  "manager": "jakub.manager@dummy.com",

  "position": "new position",
  "aspiredCompetency": "changed aspired competency",
  "aspiredPosition": "changed aspired position"



TASK:

First name: User to edit eidtable
Last name: User to edit eidtable
Email: (to be populated)

Company: (to be populated) 
Company business strategy: (to be populated)
Manager: (to be populated)  eidtable

Position: (to be populated) eidtable
Aspired Competency: (to be populated) eidtable
Aspired Position (2-5 Years): (User to input) eidtable
  
*/

// GET
const DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  username: "jakub.svezi@dummy.com",

  company: "",
  businessStrategy: "",
  manager: "",

  position: "",
  aspiredCompetency: "",
  aspiredPosition: "",
};

export const useUserManagersQuery = () => {
  return useMyQuery({
    queryKey: ["user-settings", "managers"],
    fetchDef: { url: "/api/latest/user-settings/managers" },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const UserProfileSettings = () => {
  const msg = useMsg();
  //   const { authFetch, user } = useAuth();
  //   const { language, i18n, userTz } = useContext(I18nContext);

  const initialValuesQuery = useMyQuery({
    queryKey: ["user-settings"],
    fetchDef: {
      url: `/api/latest/user-settings`,
      //   to: useWith(mergeRight, [identity, pickBy(isNotNil)])(DEFAULT_VALUES),
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: DEFAULT_VALUES,
  });
  const saveMutation = useMyMutation({
    fetchDef: {
      url: "/api/latest/user-settings",
      method: "PUT",
      from: omit(READ_ONLY),
    },
    invalidate: [{ queryKey: ["user-settings"] }],
  });

  const companyOptionsProps = useLoadableOptions({
    query: useCompaniesQuery({ retry: false }),
    map: useCompaniesQuery.toOpts,
  });
  const managersProps = useLoadableOptions({
    query: useUserManagersQuery(),
    map: map(
      applySpec({
        value: prop("username"),
        label: formatName,
      })
    ),
  });

  const form = useForm({
    values: initialValuesQuery.data,
  });

  const onError = (errors, e, ...rest) =>
    console.log("[ProfileSettings.onError]", { errors, e, rest });

  const saveDisabled =
    saveMutation.isLoading ||
    !!initialValuesQuery.error ||
    initialValuesQuery.isFetching;

  return (
    <RHForm form={form} onSubmit={saveMutation.mutateAsync}>
      <H2 gutterBottom>{msg("settings.user-profile.heading")}</H2>
      <P sx={{ mb: -1 }}>{msg("settings.user-profile.perex")}</P>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <FormRow
          label={msg("settings.user-profile.field.name")}
          name={FIELDS.lastName}
        >
          <BareInputField
            name={FIELDS.firstName}
            disabled={READ_ONLY.includes(FIELDS.firstName)}
            placeholder={msg(
              "settings.user-profile.field.firstName.placeholder"
            )}
            parametrizedValidate={[
              ["required"],
              ["notBlank"],
              ["minLength", { gteLength: 2 }],
            ]}
          />
          <BareInputField
            name={FIELDS.lastName}
            disabled={READ_ONLY.includes(FIELDS.lastName)}
            placeholder={msg(
              "settings.user-profile.field.lastName.placeholder"
            )}
            parametrizedValidate={[
              ["required"],
              ["notBlank"],
              ["minLength", { gteLength: 2 }],
            ]}
          />
        </FormRow>
        <FormRow
          label={msg("settings.user-profile.field.username")}
          name={FIELDS.username}
          dividerTop={false}
        >
          <BareInputField
            name={FIELDS.username}
            disabled={READ_ONLY.includes(FIELDS.username)}
            placeholder={msg(
              "settings.user-profile.field.username.placeholder"
            )}
          />
        </FormRow>

        <FormRow
          label={msg("settings.user-profile.field.company")}
          name={FIELDS.company}
          dividerTop={false}
        >
          <AutocompleteSelect
            name={FIELDS.company}
            fullWidth
            disabled={READ_ONLY.includes(FIELDS.company)}
            placeholder={msg("settings.user-profile.field.company.placeholder")}
            {...companyOptionsProps}
          />
        </FormRow>
        <FormRow
          label={msg("settings.user-profile.field.businessStrategy")}
          name={FIELDS.businessStrategy}
          dividerTop={false}
        >
          <BareInputField
            name={FIELDS.businessStrategy}
            disabled={READ_ONLY.includes(FIELDS.businessStrategy)}
            placeholder={msg(
              "settings.user-profile.field.businessStrategy.placeholder"
            )}
          />
        </FormRow>
        <FormRow
          label={msg("settings.user-profile.field.manager")}
          name={FIELDS.manager}
          dividerTop={false}
        >
          <AutocompleteSelect
            sx={WHITE_BG}
            name={FIELDS.manager}
            enableIsOptionEqualToValue
            disabled={READ_ONLY.includes(FIELDS.manager)}
            placeholder={msg("settings.user-profile.field.manager.placeholder")}
            {...managersProps}
          />
        </FormRow>

        <FormRow
          label={msg("settings.user-profile.field.position")}
          name={FIELDS.position}
          dividerTop={false}
        >
          <BareInputField
            name={FIELDS.position}
            disabled={READ_ONLY.includes(FIELDS.position)}
            placeholder={msg(
              "settings.user-profile.field.position.placeholder"
            )}
          />
        </FormRow>
        <FormRow
          label={msg("settings.user-profile.field.aspiredCompetency")}
          name={FIELDS.aspiredCompetency}
          dividerTop={false}
        >
          <BareInputField
            name={FIELDS.aspiredCompetency}
            disabled={READ_ONLY.includes(FIELDS.aspiredCompetency)}
            placeholder={msg(
              "settings.user-profile.field.aspiredCompetency.placeholder"
            )}
          />
        </FormRow>
        <FormRow
          label={msg("settings.user-profile.field.aspiredPosition")}
          name={FIELDS.aspiredPosition}
          dividerTop={false}
        >
          <BareInputField
            name={FIELDS.aspiredPosition}
            disabled={READ_ONLY.includes(FIELDS.aspiredPosition)}
            placeholder={msg(
              "settings.user-profile.field.aspiredPosition.placeholder"
            )}
          />
        </FormRow>
        <FormRow dividerTop={false}>
          <ControlsContainer>
            <Button variant="contained" type="submit" disabled={saveDisabled}>
              {msg("settings.user-profile.save")}
            </Button>
          </ControlsContainer>
        </FormRow>
      </Box>
    </RHForm>
  );
};
