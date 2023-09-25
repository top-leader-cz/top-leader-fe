import { Backdrop, Box, CircularProgress } from "@mui/material";

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
        my: 2,
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  ),
  // INLINE
};

export const QueryRenderer = ({
  children,
  success = (query) =>
    children?.(query) ||
    children || <pre>{JSON.stringify(query.data, null, 2)}</pre>,
  errored = (e) => <pre>{JSON.stringify(e, null, 2)}</pre>,
  loaderName = "Backdrop",
  loading = Loaders[loaderName],
  ...query
}) => {
  if (query.data) return success(query);
  if (query.isLoading) return loading(query);
  if (query.error) return errored(query.error);
};
