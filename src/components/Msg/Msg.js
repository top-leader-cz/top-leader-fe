import { useCallback, useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useMsgCtx } from "./";

export const useMsg = () => {
  const msgCtx = useMsgCtx();
  const intl = useIntl();
  const messages = msgCtx.dict;

  const msg = useCallback(
    (id, values) =>
      intl.formatMessage({
        ...messages[id],
        id,
        values,
      }),
    [intl, messages]
  );
  return msg;
};

export const Msg = ({ id, values }) => {
  const msgCtx = useMsgCtx();
  const messages = msgCtx.dict;

  return <FormattedMessage {...messages[id]} id={id} values={values} />;
};
