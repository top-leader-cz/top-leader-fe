import {
  applySpec,
  identity,
  map,
  not,
  path,
  pathOr,
  pipe,
  prop,
  when,
} from "ramda";
import { useContext } from "react";
import { useMyQuery } from "../../features/Authorization/AuthProvider";
import { I18nContext } from "../../features/I18n/I18nProvider";
import { formatName } from "../../features/Coaches/CoachCard";

export const useNotificationsQuery = (rest = {}) => {
  const { i18n } = useContext(I18nContext);
  const query = useMyQuery({
    queryKey: ["notifications"],
    fetchDef: {
      url: `/api/latest/notifications`,
      query: { page: 0, size: 10000, sort: "createdAt,desc" },
      to: pipe(
        pathOr([], ["content"]),
        map(
          applySpec({
            key: prop("id"),
            from: path(["context", "fromUser"]),
            fromName: ({ context }) =>
              formatName({
                firstName: context?.fromUserFirstName,
                lastName: context.fromUserLastName,
              }) || context?.fromUser,
            text: path(["context", "message"]),
            unread: pipe(prop("read"), not),
            createdAt: pipe(
              prop("createdAt"),
              when(identity, i18n.parseUTCLocal)
            ),
          })
        )
      ),
    },
  });

  return query;
};
