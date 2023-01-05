import { Box, Button, styled } from "@mui/material";
import { useState } from "react";

const FocusedListRoot = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create(),
}));

export const FocusedList = ({
  items,
  initialCount = 1,
  showMoreLabel = "Show another",
}) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  return (
    <FocusedListRoot>
      <ul>
        {Array(visibleCount)
          .fill(null)
          .map((_, i) => {
            const item = items[i];
            return <li key={item}>{item}</li>;
          })}
      </ul>
      {visibleCount < items.length ? (
        <Button variant="text" onClick={() => setVisibleCount((c) => c + 1)}>
          {showMoreLabel}
        </Button>
      ) : null}
    </FocusedListRoot>
  );
};
