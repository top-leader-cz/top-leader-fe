import { isFuture, isToday } from "date-fns";
import { isValid } from "date-fns/fp";
import { defineMessages } from "react-intl";
import { useMsg } from "../Msg/Msg";
import { getValidateParamsMaybe, getValidateOptionsMaybe } from "./Fields";

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
  const tsKey =
    getValidateOptionsMaybe(error?.type, parametrizedValidate)?.tsKey ||
    `dict.validation.${error?.type}`;
  const paramsMaybe = getValidateParamsMaybe(error?.type, parametrizedValidate);
  const params = paramsMaybe || {
    gteLength: rules?.[error?.type] || "Unknown", // TODO
  };
  const translated = msg.maybe(tsKey, params);
  const errorMsg = translated || error?.type;

  if (errorMsg) {
    console.log("[getError] ", name, { error, tsKey, translated, errorMsg });
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
}) => {
  const msg = useMsg({ dict: validationMessages });

  if (!error) return undefined;
  return getError({ error, msg, name, rules, parametrizedValidate });
};

// export const required = () => (v) => !!v;

export const notBlank =
  (gtLen = 0) =>
  (v) =>
    v?.trim?.()?.length > gtLen;
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
