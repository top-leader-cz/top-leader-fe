import { Card, CardContent, Chip, Divider, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { primary25 } from "../theme";

export const ChipsCard = ({
  keys = [],
  dict = {},
  renderSummary = () => {},
  renderSelected = () => {},
  isSelectable = () => true,
  sx = { mb: 3 },
}) => {
  const [selectedKey, setSelectedKey] = useState();
  const selectedItem = selectedKey ? dict[selectedKey] : undefined;
  useEffect(() => {
    if (
      selectedKey &&
      (!keys.includes(selectedKey) || !isSelectable(selectedItem))
    )
      setSelectedKey(undefined);
  }, [selectedKey, keys, isSelectable, selectedItem]);

  return (
    <Card sx={{ display: "flex", ...sx }} elevation={0}>
      <CardContent>
        <Stack direction="column" spacing={1}>
          {keys.map((key) => (
            <Chip
              key={key}
              color={key === selectedKey ? "primary" : "default"}
              sx={{
                borderRadius: 1,
                justifyContent: "flex-start",
                bgcolor: key === selectedKey ? "primary.main" : primary25,
              }}
              label={[dict[key]?.emoji, dict[key]?.name || key]
                .filter(Boolean)
                .join(" ")}
              onClick={(e) => {
                if (isSelectable(dict[key]))
                  setSelectedKey((selectedKey) =>
                    selectedKey === key ? undefined : key
                  );
              }}
            />
          ))}
        </Stack>
      </CardContent>
      <Divider sx={{ my: 2 }} orientation="vertical" flexItem />
      {!selectedItem ? renderSummary() : renderSelected(selectedItem)}
    </Card>
  );
};
