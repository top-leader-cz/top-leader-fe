import { Box, Button, styled } from "@mui/material";
import { useState } from "react";
import { defineMessages } from "react-intl";
import { useMsg } from "../../components/Msg/Msg";

const FocusedListRoot = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create(),
}));

const messages = defineMessages({
  "focused-list.show-another-question": {
    id: "focused-list.show-another-question",
    defaultMessage: "Show another question",
  },
});

export const FocusedList = ({ items, initialCount = 1 }) => {
  const msg = useMsg({ dict: messages });
  const [visibleCount, setVisibleCount] = useState(initialCount);

  return (
    <FocusedListRoot>
      <ul style={{ paddingLeft: "24px" }}>
        {Array(visibleCount)
          .fill(null)
          .map((_, i) => {
            const item = items[i];
            return (
              <li key={item} style={{ paddingTop: "10px" }}>
                {item}
              </li>
            );
          })}
      </ul>
      {visibleCount < items.length ? (
        <Button variant="text" onClick={() => setVisibleCount((c) => c + 1)}>
          {msg("focused-list.show-another-question")}
        </Button>
      ) : null}
    </FocusedListRoot>
  );
};
