import { defaultTo, evolve, map, pick, pipe } from "ramda";
import { useContext } from "react";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { UTC_DATE_FORMAT } from "../I18n/utils/date";

export const useUserSessionQuery = ({ ...rest } = {}) => {
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

export const useUserSessionMutation = ({ onSuccess, ...rest } = {}) => {
  const { i18n } = useContext(I18nContext);
  const formatFP = (date) => i18n.formatLocalMaybe(date, UTC_DATE_FORMAT);
  const mutation = useMyMutation({
    debug: true,
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

export const useUserReflectionMutation = ({ onSuccess, ...rest } = {}) => {
  const { i18n } = useContext(I18nContext);
  const formatFP = (date) => i18n.formatLocalMaybe(date, UTC_DATE_FORMAT);
  const mutation = useMyMutation({
    debug: true,
    fetchDef: {
      method: "POST",
      url: "/api/latest/user-sessions-reflection",
      from: ({ actionSteps = [], previousActionSteps = [], ...data }) => ({
        ...data,
        // newActionSteps: map( applySpec({ label: prop("label"), date: pipe(prop("date"), formatFP), }), actionSteps ),
        newActionSteps2: actionSteps.map(({ label, date }) => ({
          label,
          date: i18n.formatLocalMaybe(date, UTC_DATE_FORMAT),
        })),
        checked: previousActionSteps
          .filter(({ checked }) => checked)
          .map(({ id }) => id),
      }),
    },
    invalidate: [{ queryKey: ["user-sessions"] }, { queryKey: ["user-info"] }],
    ...rest,
  });
  return mutation;
};
