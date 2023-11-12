import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export const ConversationMessage = ({ message, scrollIntoView }) => {
  const ref = useRef();
  const messageRef = useRef(message);
  messageRef.current = message;
  useEffect(() => {
    if (scrollIntoView) {
      console.log("[ConversationMessage.scrollIntoView] should scroll now", {
        ...messageRef.current,
        ref,
      });
      if (ref.current) setTimeout(() => ref.current.scrollIntoView(), 100);
      // TODO: rm timeout - side menu not initially rendered - without timeout this effect executes on "wider screen"
      else
        console.log(
          "[ConversationMessage.scrollIntoView] ref missing, NOT scrolling into view",
          { ...messageRef.current }
        );
    }
  }, [scrollIntoView]);

  const { fromMe, text } = message;
  const addresseeSx = fromMe
    ? {
        alignSelf: "flex-end",
        color: "white",
        bgcolor: "primary.main",
        border: `1px solid #4720B7`,
        // border: `1px solid primary.main`,
        borderBottomRightRadius: 0,
      }
    : {
        alignSelf: "flex-start",
        color: "#475467",
        bgcolor: "#F9F8FF",
        border: `1px solid #907ACF`,
        borderBottomLeftRadius: 0,
      };

  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: "6px",
        width: "90%",
        maxWidth: "500px",
        mt: 3,
        "&:first-of-type": { mt: 0 },
        p: 2,
        opacity: message.isOptimisticUpdate ? 0.5 : 1,
        ...addresseeSx,
      }}
    >
      {text}
    </Box>
  );
};
