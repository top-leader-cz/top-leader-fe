import { Box, Button } from "@mui/material";
import { H1, P } from "../../components/Typography";
import { IconTile } from "../Sessions/EditSession.page";

export const EmptyTemplate = ({ title, description, iconName, button }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(90vh - 125px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconTile
        sx={{ bgcolor: "transparent" }}
        iconName={iconName}
        renderCaption={() => (
          <H1 mt={3} mb={1}>
            {title}
          </H1>
        )}
        renderText={() => (
          <P bigger mb={4}>
            {description}
          </P>
        )}
      >
        {button && <Button {...button} />}
      </IconTile>
    </Box>
  );
};
