import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { all } from "ramda";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export const Loaders = {
  Backdrop: () => (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ),
  Block: ({ loaderProps = {} }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        my: 1,
        alignItems: "center",
        height: "100%",
        width: "100%",
        color: "primary.main",
        ...(loaderProps.sx || {}),
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  ),
  Skeleton: ({ loaderProps = {} }) => {
    const { rows = 5, ...rest } = loaderProps;
    return (
      <Box {...rest}>
        {[...Array(rows)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </Box>
    );
  },
  // INLINE
};

const renderError = ({ error }) =>
  error && (
    <Alert severity="error" sx={{ wordWrap: "break-word" }}>
      {error?.message || "Oops!"}
    </Alert>
  );

export const SuspenseRenderer = ({
  children,
  loaderProps,
  loaderName = "Block",
  loading = Loaders[loaderName]({ loaderProps }),
  erroredRender = renderError,
}) => (
  <ErrorBoundary fallbackRender={erroredRender}>
    <React.Suspense fallback={loading}>{children}</React.Suspense>
  </ErrorBoundary>
);

SuspenseRenderer.Loaders = Loaders;

export const QueryRenderer = ({
  children,
  success = (query) =>
    children?.(query) ||
    children || <pre>{JSON.stringify(query.data, null, 2)}</pre>,
  errored = renderError,
  // errored = (e) => <pre>{JSON.stringify(e, null, 2)}</pre>,
  loaderName = "Backdrop",
  loaderProps,
  loading = Loaders[loaderName],
  query: queryProp,
  // queries: queriesProp,
  ...queryRest
}) => {
  const query = queryProp || queryRest; // TODO: migrate to separate prop, add queries renderer
  // const queries = queriesProp || [query];

  const render = () => {
    if (query.data) return success?.(query);
    if (query.isLoading) return loading?.({ loaderProps });
    if (query.error) return errored?.(query);
  };

  return <ErrorBoundary>{render()}</ErrorBoundary>;
};
