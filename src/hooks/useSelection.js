import { useCallback, useState } from "react";

export function useSelection({
  keyName = "key",
  initialValue = [],
  limit = Infinity,
}) {
  const [selectedKeys, setSelectedKeys] = useState(initialValue);

  const toggleItem = useCallback(
    (item) =>
      setSelectedKeys((keys) =>
        keys.includes(item[keyName])
          ? keys.filter((k) => k !== item[keyName])
          : [...keys, item[keyName]].slice(0, limit)
      ),
    [keyName, limit]
  );

  return { selectedKeys, toggleItem };
}
