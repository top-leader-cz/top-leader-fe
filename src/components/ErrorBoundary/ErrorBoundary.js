import { pipe, prop } from "ramda";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const createFefaultFallbackRender =
  ({ getErrorMsg, mapErrMsg }) =>
  ({ error, resetErrorBoundary }) => {
    return pipe(getErrorMsg, mapErrMsg)(error);
  };

const defaultMapErrMsg =
  ({ extraInfo }) =>
  (msg) => {
    const extra = ["object"].includes(typeof extraInfo)
      ? JSON.stringify(extraInfo)
      : extraInfo;
    return [msg, extra].filter(Boolean).join(" - ");
  };

export const ErrorBoundary = ({
  children,
  FallbackComponent,
  getErrorMsg = prop("message"),
  extraInfo = "",
  mapErrMsg = defaultMapErrMsg({ extraInfo }),
  fallbackRender = createFefaultFallbackRender({
    getErrorMsg,
    mapErrMsg,
    extraInfo,
  }),
  ...rest
}) => {
  const props = FallbackComponent ? { FallbackComponent } : { fallbackRender };

  return (
    <ReactErrorBoundary {...props} {...rest}>
      {children}
    </ReactErrorBoundary>
  );
};
