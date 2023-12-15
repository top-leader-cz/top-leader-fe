import {
  applySpec,
  defaultTo,
  evolve,
  filter,
  map,
  pick,
  pipe,
  prop,
} from "ramda";
import { useContext } from "react";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { UTC_DATE_FORMAT } from "../I18n/utils/date";

export const useUserSessionQuery = (rest = {}) => {
  const query = useMyQuery({
    queryKey: ["user-sessions"],
    fetchDef: { url: `/api/latest/user-sessions` },
    // be careful, following params affect form reinit
    cacheTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...rest,
  });
  return query;
};

export const useUserSessionMutation = (rest = {}) => {
  const { i18n } = useContext(I18nContext);
  const formatFP = (date) => i18n.formatLocalMaybe(date, UTC_DATE_FORMAT);
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: "/api/latest/user-sessions",
      from: evolve({
        actionSteps: pipe(
          defaultTo([]),
          map(pick(["label", "date"])),
          map(evolve({ date: formatFP }))
        ),
      }),
    },
    invalidate: [{ queryKey: ["user-sessions"] }, { queryKey: ["user-info"] }],
    ...rest,
  });
  return mutation;
};

export const useUserReflectionMutation = (rest = {}) => {
  const { i18n } = useContext(I18nContext);
  const formatFP = (date) => i18n.formatLocalMaybe(date, UTC_DATE_FORMAT);
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: "/api/latest/user-sessions-reflection",
      from: applySpec({
        reflection: prop("reflection"),
        newActionSteps: pipe(
          prop("actionSteps"),
          defaultTo([]),
          map(pick(["label", "date"])),
          map(evolve({ date: formatFP }))
        ),
        checked: pipe(
          prop("previousActionSteps"),
          defaultTo([]),
          filter(prop("checked")),
          map(prop("id"))
        ),
      }),
    },
    invalidate: [{ queryKey: ["user-sessions"] }, { queryKey: ["user-info"] }],
    ...rest,
  });
  return mutation;
};
