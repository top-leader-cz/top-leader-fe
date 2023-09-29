import { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useMsgCtx } from "./";

const displayKeys = false;

export const useMsg = ({ dict } = {}) => {
  const msgCtx = useMsgCtx();
  const intl = useIntl();
  const messages = dict || msgCtx.dict;

  const msg = useCallback(
    (id, values) => {
      if (displayKeys) return `${id}`;
      return intl.formatMessage(
        {
          ...messages[id],
          id,
        },
        values
      );
    },
    [intl, messages]
  );
  // useEffect(() => {
  //   console.log("[useMsg] intl changed");
  // }, [intl]);
  // useEffect(() => {
  //   console.log("[useMsg] messages changed");
  // }, [messages]);

  return msg;
};

export const Msg = ({ id, values }) => {
  const msgCtx = useMsgCtx();
  const messages = msgCtx.dict;

  if (displayKeys) return `${id}`;

  return <FormattedMessage {...messages[id]} id={id} values={values} />;
};
