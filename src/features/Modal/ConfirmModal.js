import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import React from "react";
import { Icon } from "../../components/Icon";
import { H2, P } from "../../components/Typography";

export const ConfirmModal = ({
  open,
  onClose,
  iconName,
  title,
  desc,
  children,
  buttons,
  noDivider,
  sx = {},
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "800px" },
          bgcolor: "background.paper",
          borderRadius: "6px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          ...sx,
          // border: "2px solid #000",
          // boxShadow: 24,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
            <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
              <Icon name={iconName} sx={{ color: "#667085" }} />
            </Avatar>
          </Avatar>
          <IconButton onClick={onClose}>
            <Icon name="Close" sx={{ color: "#667085" }} />
          </IconButton>
        </Box>
        {title && (
          <H2 id="modal-modal-title" {...(title?.props ?? {})}>
            {title?.children ?? title}
          </H2>
        )}
        {desc && (
          <P id="modal-modal-description" {...(desc?.props ?? {})}>
            {desc?.children ?? desc}
          </P>
        )}
        {children}
        {!noDivider && <Divider flexItem />}
        {buttons && (
          <Box display="flex" flexDirection="row" gap={3}>
            {buttons.map(({ Component = Button, ...button }) => (
              <Component key={JSON.stringify(button)} fullWidth {...button} />
            ))}
          </Box>
        )}
      </Paper>
    </Modal>
  );
};
