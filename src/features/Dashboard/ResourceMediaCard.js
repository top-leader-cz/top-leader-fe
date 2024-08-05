import { Box, Chip } from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import * as React from "react";
import { Icon } from "../../components/Icon";
import { P } from "../../components/Typography";
import { gray500, gray900 } from "../../theme";
import { RESOURCE_COLORS } from "./Dashboard.page";

export const ResourceMediaCard = ({
  title,
  previewSrc,
  type,
  estimatedTime,
  sx = {},
}) => {
  const {
    color,
    bgcolor,
    iconName = "PlayCircleOutline",
    actionName = "watch",
  } = RESOURCE_COLORS[type] || RESOURCE_COLORS["default"];
  return (
    <Card
      sx={{
        // maxWidth: 345,
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <CardMedia
        sx={{ height: 130 }}
        image={previewSrc}
        title="preview"
        // component="img"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          pb: 2,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <P sx={{ fontWeight: 500, color: gray900 }}>{title}</P>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <P
            sx={{
              fontSize: 12,
              color: gray500,
              fontWeight: 400,
              display: "inline-flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              name={iconName}
              sx={{ color: "inherit", fontSize: "inherit", mr: 0.5 }}
            />
            <span>
              {estimatedTime} {actionName}
            </span>
          </P>
          <Chip
            label={type}
            size="small"
            sx={{
              borderRadius: "6px",
              p: "4px 0px 4px 0px",
              height: "auto",
              fontSize: 12,
              color,
              bgcolor,
              fontWeight: 400,
            }}
          />
        </Box>
      </Box>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};
