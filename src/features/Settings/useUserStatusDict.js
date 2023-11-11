import { fromPairs, map, pipe } from "ramda";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  "dict.user_status.authorized.label": {
    id: "dict.user_status.authorized.label",
    defaultMessage: "Authorized",
  },
  "dict.user_status.pending.label": {
    id: "dict.user_status.pending.label",
    defaultMessage: "Pending",
  },
  "dict.user_status.paid.label": {
    id: "dict.user_status.paid.label",
    defaultMessage: "Paid",
  },
});

const USER_STATUS = {
  AUTHORIZED: "AUTHORIZED",
  PENDING: "PENDING",
  PAID: "PAID",
};
const colors = {
  AUTHORIZED: "#EAECF0",
  PENDING: "#EAAA084D",
  PAID: "#66C61C4D",
};
const DEFAULT_COLOR = "#FFF";

const userStatusKeys = Object.keys(USER_STATUS);

const translateStatus = (intl, key) => {
  const getId = (prop) => `dict.user_status.${key.toLocaleLowerCase()}.${prop}`;

  return {
    key,
    value: key,
    label: intl.formatMessage({ ...messages[getId("label")] }),
    bgcolor: colors[key] || DEFAULT_COLOR,
  };
};

export const useUserStatusDict = () => {
  const intl = useIntl();
  const userStatusDict = useMemo(
    () =>
      pipe(
        map((k) => [k, translateStatus(intl, k)]),
        fromPairs
      )(userStatusKeys),
    [intl]
  );

  return useMemo(
    () => ({
      userStatusDict,
      userStatusOptions: Object.values(userStatusDict),
    }),
    [userStatusDict]
  );
};
