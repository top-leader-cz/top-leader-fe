import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useHistoryEntries = ({ storageKey, idKey = "timestamp" }) => {
  const [history, setHistory] = useLocalStorage(storageKey, []);
  const last = history[history.length - 1];
  const [selectedId, setSelectedId] = useState(last?.[idKey]);
  const isSelected = useCallback(
    (entry) => selectedId && entry[idKey] === selectedId,
    [idKey, selectedId]
  );
  const selected = history.find(isSelected);

  return {
    last,
    all: history,
    selected,
    setSelected: useCallback((entry) => setSelectedId(entry?.[idKey]), []),
    push: useCallback(
      (entry) => setHistory((history) => [...history, entry]),
      [setHistory]
    ),
    update: useCallback(
      (newEntry) => {
        setHistory((entries) =>
          entries.map((entry) =>
            entry[idKey] === newEntry[idKey] ? { ...entry, ...newEntry } : entry
          )
        );
      },
      [idKey, setHistory]
    ),
    remove: useCallback(
      (rmEntry) =>
        setHistory((entries) =>
          entries.filter((entry) => entry[idKey] !== rmEntry[idKey])
        ),
      [idKey, setHistory]
    ),
    isSelected,
  };
};
