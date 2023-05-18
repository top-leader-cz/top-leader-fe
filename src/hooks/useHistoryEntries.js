import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useHistoryEntries = ({
  storageKey,
  initialSelectedId,
  idKey = "timestamp",
}) => {
  const [stack, setStack] = useLocalStorage(storageKey, []);
  const last = stack[stack.length - 1];
  const [selectedId, setSelectedId] = useState(
    initialSelectedId || last?.[idKey]
  );
  const isSelected = useCallback(
    (entry) => selectedId && entry[idKey] === selectedId,
    [idKey, selectedId]
  );
  const selected = stack.find(isSelected);

  // console.log("%c[useHistoryEntries.rndr]", "color:blue;", {
  //   selectedId,
  //   selected,
  //   idKey,
  //   all: stack,
  // });

  return {
    last,
    all: stack,
    selected,
    setSelected: useCallback((entry) => setSelectedId(entry?.[idKey]), []),
    push: useCallback(
      (entry) => setStack((stack) => [...stack, entry]),
      [setStack]
    ),
    update: useCallback(
      (newEntry) => {
        setStack((entries) =>
          entries.map((entry) =>
            entry[idKey] === newEntry[idKey] ? { ...entry, ...newEntry } : entry
          )
        );
      },
      [idKey, setStack]
    ),
    remove: useCallback(
      (rmEntry) =>
        setStack((entries) =>
          entries.filter((entry) => entry[idKey] !== rmEntry[idKey])
        ),
      [idKey, setStack]
    ),
    isSelected,
  };
};
