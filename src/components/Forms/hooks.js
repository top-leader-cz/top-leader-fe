import { identity } from "ramda";
import { useMsg } from "../Msg/Msg";
import { defineMessages } from "react-intl";

const messages = defineMessages({
  "general.loadable-options.loading.placeholder": {
    id: "general.loadable-options.loading.placeholder",
    defaultMessage: "Loading options",
  },
  "general.loadable-options.error.placeholder": {
    id: "general.loadable-options.error.placeholder",
    defaultMessage: "Error loading options",
  },
});

export const useLoadableOptions = ({ query, map = identity }) => {
  const msg = useMsg({ dict: messages });
  if (query.data)
    return {
      options: map(query.data),
      disabled: false,
      placeholder: undefined,
    };
  if (query.isLoading)
    return {
      options: [],
      disabled: true,
      placeholder: msg("general.loadable-options.loading.placeholder"),
    };
  if (query.error)
    return {
      options: [],
      disabled: true,
      placeholder: msg("general.loadable-options.error.placeholder"),
    };
};
