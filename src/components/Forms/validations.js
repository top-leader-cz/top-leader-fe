import { isFuture, isToday } from "date-fns";
import { isValid } from "date-fns/fp";
import { defineMessages } from "react-intl";
import { useMsg } from "../Msg/Msg";
import { getValidateParamsMaybe, getValidateOptionsMaybe } from "./Fields";
import { Fade } from "@mui/material";

export const validationMessages = defineMessages({
  "dict.validation.required": {
    id: "dict.validation.required",
    defaultMessage: "Required",
  },
  "dict.validation.notBlank": {
    id: "dict.validation.notBlank",
    defaultMessage: "Cannot be blank",
  },
  "dict.validation.minLength": {
    id: "dict.validation.minLength",
    defaultMessage: "Too short. Min length is {gteLength}",
  },
  "dict.validation.maxLength": {
    id: "dict.validation.maxLength",
    defaultMessage: "Too long. Max length is {lteLength}",
  },
  "dict.validation.validDate": {
    id: "dict.validation.validDate",
    defaultMessage: "Invalid date",
  },
  "dict.validation.forbiddenValues": {
    id: "dict.validation.forbiddenValues",
    defaultMessage: "Forbidden value",
  },
  "dict.validation.notUnique": {
    id: "dict.validation.notUnique",
    defaultMessage: "Must be unique",
  },
  "dict.validation.invalidDate": {
    id: "dict.validation.invalidDate",
    defaultMessage: "Invalid date",
  },
  "dict.validation.invalidTime": {
    id: "dict.validation.invalidTime",
    defaultMessage: "Invalid time",
  },
  "dict.validation.todayOrFuture": {
    id: "dict.validation.todayOrFuture",
    defaultMessage: "Must be in the future",
  },
});

const getError = ({ error, msg, name, rules, parametrizedValidate }) => {
  if (!error?.type) return undefined;
  const optionsMaybe = getValidateOptionsMaybe(
    error?.type,
    parametrizedValidate
  );
  const tsKey = optionsMaybe?.tsKey || `dict.validation.${error?.type}`;
  const paramsMaybe = getValidateParamsMaybe(error?.type, parametrizedValidate);
  const params = paramsMaybe || {
    gteLength: rules?.[error?.type] || "Unknown", // TODO
  };
  const translated = msg.maybe(tsKey, params);
  const errorMsg = translated || error?.type;

  if (errorMsg) {
    console.log("[getError] ", name, {
      error,
      tsKey,
      paramsMaybe,
      translated,
      errorMsg,
      rules,
      parametrizedValidate,
      optionsMaybe,
    });
    // debugger;
  }

  // if (true) {
  //   error?.ref?.focus?.();
  //   error?.ref?.select?.();
  // }
  // debugger;

  return errorMsg;
};

export const FieldError = ({
  fieldState: { error },
  rules,
  name,
  parametrizedValidate,
  customError,
}) => {
  const msg = useMsg({ dict: validationMessages });

  if (error)
    return (
      <Fade in={true} timeout={500}>
        <span>
          {getError({ error, msg, name, rules, parametrizedValidate })}
        </span>
      </Fade>
    );
  if (customError) return <span>{customError}</span>;
  return undefined;
  return getError({ error, msg, name, rules, parametrizedValidate });
};

// export const required = () => (v) => !!v;

export const notBlank =
  ({ gtLen = 0 } = {}) =>
  (v) =>
    console.log("%cnotBlank", "color:lime;", {
      v,
      gtLen,
      result: v?.trim?.()?.length > gtLen,
    }) || v?.trim?.()?.length > gtLen;
export const minLength =
  ({ gteLength = 1 } = {}) =>
  (v) =>
    v?.length >= gteLength;
export const maxLength =
  ({ lteLength = 1000 } = {}) =>
  (v) =>
    v?.length <= lteLength;
export const rePattern =
  ({ regexpToMatch } = {}) =>
  (v) => {
    if (!v?.length) return true;
    return !!v.match(regexpToMatch);
  };

export const validDate = () => (v) => {
  if (!v) return true; // optional date fields
  return isValid(v);
};

// TODO: cached fn, not reacting to forbiddenList changes
export const forbiddenValues =
  ({ forbiddenList = [] } = {}) =>
  (v) => {
    if (Array.isArray(v)) {
      debugger;
    } else {
      console.log("%c[forbiddenValues]", "color:lime", { forbiddenList, v });
      return !forbiddenList.includes(v);
    }
  };

// old validations for direct use in rules prop:
export const invalidDate = (v) => {
  if (!v) return true; // optional date fields
  return isValid(v);
};

export const invalidTime = (v) => {
  if (!v) return true; // optional date fields
  return isValid(v);
};

export const todayOrFuture = (v) => {
  if (!v) return true; // optional date fields
  return isToday(v) || isFuture(v);
};
