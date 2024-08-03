import { CircularProgress, Typography } from "@mui/material";
import { primary500 } from "../../theme";
import { Icon } from "../../components/Icon";

export const HeadingWithIcon = ({
  title,
  perex,
  isLoading = false,
  sx = {},
}) => {
  const size = 14;
  return (
    <>
      <Typography sx={{ color: primary500, fontSize: size, ...sx }}>
        {isLoading ? (
          <CircularProgress
            color="inherit"
            size={size}
            // thickness={2}
            sx={{ opacity: 0.25, mr: 1 }}
          />
        ) : (
          <Icon name={"AutoAwesome"} sx={{ fontSize: "inherit", mr: 1 }} />
        )}
        {title}
      </Typography>
      {perex && <Typography sx={{ mb: 2 }}>{perex}</Typography>}
    </>
  );
};
