import { alpha, Avatar, Box } from "@mui/material";
import { Icon } from "./Icon";
import { H2 } from "./Typography";

export const PRIMARY_BG_LIGHT = (theme) =>
  alpha(theme.palette.primary.main, 0.05);
export const GRAY_BG_LIGHT = (theme) =>
  alpha(theme.palette.action.selected, 0.05);

export const InfoBox = ({
  heading,
  children,
  iconName,
  color = "default",
  sx = {},
}) => {
  const renderIcon = (iconName, rightContent) => {
    if (!iconName) return rightContent;
    return (
      <Box display="flex" flexDirection="row" flexWrap="nowrap">
        <Avatar
          variant="circular"
          sx={{ width: 48, height: 48, bgcolor: "#DAD2F1", mr: 3 }}
        >
          <Icon name={iconName} sx={{ fontSize: 30, color: "primary.main" }} />
        </Avatar>
        <Box sx={{ whiteSpace: "normal" }}>{rightContent}</Box>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 0.5,
        bgcolor: color === "primary" ? PRIMARY_BG_LIGHT : GRAY_BG_LIGHT,
        ...sx,
      }}
    >
      {renderIcon(
        iconName,
        <>
          {heading && (
            <H2 gutterBottom color={color}>
              {heading}
            </H2>
          )}
          {children}
        </>
      )}
    </Box>
  );
};
