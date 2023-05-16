import { fromPairs, map, pipe } from "ramda";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

export const messages = defineMessages({
  "dict.areas.1": {
    id: "dict.areas.1",
    defaultMessage: "Become an active listener",
  },
  "dict.areas.2": {
    id: "dict.areas.2",
    defaultMessage: "Become more efficient",
  },
  "dict.areas.3": {
    id: "dict.areas.3",
    defaultMessage: "Show appreciation, recognition and empathy for your team",
  },
  "dict.areas.4": {
    id: "dict.areas.4",
    defaultMessage: "Be honest, transparent and accountable",
  },
  "dict.areas.5": {
    id: "dict.areas.5",
    defaultMessage: "Be an effective communicator",
  },
  "dict.areas.6": {
    id: "dict.areas.6",
    defaultMessage: "Being more assertive",
  },
  "dict.areas.7": {
    id: "dict.areas.7",
    defaultMessage: "Negotiate effectively",
  },
  "dict.areas.8": {
    id: "dict.areas.8",
    defaultMessage: "Be more self-confident",
  },
  "dict.areas.9": {
    id: "dict.areas.9",
    defaultMessage: "Apply critical thinking",
  },
});

const areasKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const useAreasDict = () => {
  const intl = useIntl();
  const areas = useMemo(
    () =>
      pipe(
        map((k) => [
          k,
          { label: intl.formatMessage({ ...messages[`dict.areas.${k}`] }) },
        ]),
        fromPairs
      )(areasKeys),
    [intl]
  );

  return useMemo(() => ({ areas }), [areas]);
};
