import { Card, CardContent, Chip, Divider, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export const ChipsCard = ({
  keys = [],
  dict = {},
  renderSummary = () => {},
  renderSelected = () => {},
  sx = { mb: 3 },
}) => {
  const [selectedKey, setSelectedKey] = useState();
  const selected = selectedKey ? dict[selectedKey] : undefined;
  useEffect(() => {
    if (selectedKey && !keys.includes(selectedKey)) setSelectedKey(undefined);
  }, [selectedKey, keys]);

  return (
    <Card sx={{ display: "flex", ...sx }} elevation={0}>
      <CardContent>
        <Stack direction="column" spacing={1}>
          {keys.map((key) => (
            <Chip
              color={key === selectedKey ? "primary" : "default"}
              sx={{ borderRadius: 1, justifyContent: "flex-start" }}
              label={[dict[key]?.emoji ?? "👤", dict[key]?.name || key]
                .filter(Boolean)
                .join(" ")}
              onClick={(e) =>
                setSelectedKey((selectedKey) =>
                  selectedKey === key ? undefined : key
                )
              }
            />
          ))}
        </Stack>
      </CardContent>
      <Divider sx={{ my: 2 }} orientation="vertical" flexItem />
      {!selected ? renderSummary() : renderSelected(selected)}
    </Card>
  );
};
