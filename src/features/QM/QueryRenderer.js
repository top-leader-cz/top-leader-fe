import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Skeleton,
} from "@mui/material";

export const Loaders = {
  Backdrop: () => (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ),
  Block: () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        my: 1,
        alignItems: "center",
        height: "100%",
        width: "100%",
        color: "primary.main",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  ),
  Skeleton: (_, loaderProps = {}) => {
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

export const QueryRenderer = ({
  children,
  success = (query) =>
    children?.(query) ||
    children || <pre>{JSON.stringify(query.data, null, 2)}</pre>,
  errored = ({ error }) =>
    error && (
      <Alert severity="error" sx={{ wordWrap: "break-word" }}>
        {error?.message || "Oops!"}
      </Alert>
    ),
  // errored = (e) => <pre>{JSON.stringify(e, null, 2)}</pre>,
  loaderName = "Backdrop",
  loaderProps,
  loading = Loaders[loaderName],
  query: queryProp,
  // queries,
  ...queryRest
}) => {
  const query = queryProp || queryRest; // TODO: migrate to separate prop, add queries renderer

  if (query.data) return success?.(query);
  if (query.isLoading) return loading?.(query, loaderProps);
  if (query.error) return errored?.(query);
};
