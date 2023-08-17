import { Box, Typography } from "@mui/material";

const Count = ({ label, value, sx = {} }) => {
  return (
    <Box sx={{ display: "flex", flexFlow: "column nowrap", ...sx }}>
      <Typography variant="body" mb={2}>
        {label}
      </Typography>
      <Typography variant="h1">{value}</Typography>
    </Box>
  );
};

export const ProgressStats = ({ items }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
      }}
    >
      {items.map(({ label, value, key }) => (
        <Count
          key={key || label}
          sx={{ flexGrow: 1 }}
          label={label}
          value={value}
        />
      ))}
    </Box>
  );
};
