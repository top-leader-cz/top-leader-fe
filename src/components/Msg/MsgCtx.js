import { createContext, useContext, useMemo } from "react";

export const MsgCtx = createContext(null);

export const MsgProvider = ({ children, messages }) => {
  const ctxMemo = useMemo(() => ({ dict: messages }), [messages]);

  return <MsgCtx.Provider value={ctxMemo}>{children}</MsgCtx.Provider>;
};

export const useMsgCtx = () => {
  const ctx = useContext(MsgCtx);

  return ctx;
};
