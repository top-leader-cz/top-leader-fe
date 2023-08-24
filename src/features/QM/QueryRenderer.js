import { Backdrop, CircularProgress } from "@mui/material";

export const QueryRenderer = ({
  children,
  success = (query) =>
    children || <pre>{JSON.stringify(query.data, null, 2)}</pre>,
  error = (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
  loading = () => (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ),
  ...query
}) => {
  if (query.data) return success(query);
  if (query.isLoading) return loading(query);
  if (query.error) return loading(query);
};
