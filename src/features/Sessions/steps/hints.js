import { pipe, uniq } from "ramda";
import { useMemo } from "react";
import { useMsg } from "../../../components/Msg/Msg";

export const lazyList = ({ i = 0, get, max, items = [] }) => {
  const item = items.length >= max ? undefined : get(i);

  if (!item) return items;

  return lazyList({ i: i + 1, get, max, items: [...items, item] });
};

export const getTranslatedList = ({ tsKey, msg, startIndex = 1, max = 10 }) => {
  return lazyList({
    max,
    get: (i) => {
      const index = startIndex + i;
      const translationKey = `${tsKey.replace(/\.$/, "")}.${index}`;
      const translationMaybe = msg.maybe(translationKey);

      return translationMaybe;
    },
  });
};

export const useLazyTranslatedList = ({ tsKey, msg, startIndex }) =>
  useMemo(
    () => pipe(getTranslatedList, uniq)({ tsKey, msg, startIndex }),
    [tsKey, msg, startIndex]
  );
export const useGoalHints = () => {
  const msg = useMsg();
  return useLazyTranslatedList({
    tsKey: "sessions.new.steps.goal.focusedlist",
    msg,
    startIndex: 1,
  });
};
export const useMotivationHints = () => {
  const msg = useMsg();
  return useLazyTranslatedList({
    tsKey: "sessions.new.steps.motivation.focusedlist",
    msg,
    startIndex: 1,
  });
};
export const useReflectionHints = () => {
  const msg = useMsg();
  return useLazyTranslatedList({
    tsKey: "sessions.edit.steps.reflect.hints",
    msg,
    startIndex: 1,
  });
};
