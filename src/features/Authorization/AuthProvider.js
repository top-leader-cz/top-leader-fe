import * as qs from "qs";
import { always, identity, prop, tryCatch } from "ramda";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { defineMessages, useIntl } from "react-intl";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSessionStorage } from "../../hooks/useLocalStorage";
import { useStaticCallback } from "../../hooks/useStaticCallback.hook";
import { useSnackbar } from "../Modal/ConfirmModal";

export const AuthContext = createContext(null);

const getInit = ({ method, data }) => {
  const isFormData = data instanceof FormData;
  return {
    method,
    headers: [
      ...(isFormData
        ? []
        : [
            ["Accept", "application/json"],
            ["Content-Type", "application/json"],
          ]),
      ["Access-Control-Allow-Origin", "*"],
    ],
    // credentials: "include", // TODO: test
    // mode: "no-cors", // "cors" | "navigate" | "no-cors" | "same-origin";
    ...(isFormData
      ? { body: data }
      : data
      ? { body: JSON.stringify(data) }
      : {}),
  };
};

const _login = ({ authFetch, username, password }) =>
  authFetch({
    type: FETCH_TYPE.FORMDATA,
    method: "POST",
    url: "/login",
    data: (() => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      // console.log("_login", { formData, username, password });
      return formData;
    })(),
  });

const _resetPass = ({ authFetch, password, token }) =>
  authFetch({
    type: FETCH_TYPE.FORMDATA,
    method: "POST",
    url: `/api/public/set-password/${token}`,
    data: { password },
  });

const _fetchUser = ({ authFetch }) =>
  authFetch({ url: "/api/latest/user-info" });

export const FETCH_TYPE = {
  JSON: "JSON",
  FORMDATA: "FORMDATA",
  TEXT: "TEXT",
};

// src/main/java/com/topleader/topleader/user/User.java
export const Authority = {
  COACH: "COACH",
  USER: "USER",
  ADMIN: "ADMIN",
  HR: "HR",
};

export const qstr = (url, query) => {
  if (!query) return url;
  const qStr = typeof query === "string" ? query : qs.stringify(query);
  return [url, qStr].filter(Boolean).join("?");
};

const ERROR_CODES = {
  FIELD_OUTSIDE_OF_FRAME: "field.outside.of.frame",
  MORE_THEN_24_EVENT: "event.longer.that.24",

  SESSION_IN_PAST: "session.in.past",
  TIME_NOT_AVAILABLE: "time.not.available",

  NOT_ENOUGH_CREDITS: "not.enough.credits",

  EMAIL_USED: "email.used",
  NOT_PART_OF_COMPANY: "not.part.of.company",

  INVALID_PASSWORD: "invalid.password",

  ALREADY_EXISTING: "already.existing",

  ALREADY_SUBMITTED: "form.already.submitted",
};

const getTsKey = (code = "", prop = "message") => `dict.error.${code}.${prop}`;

const errMessages = defineMessages({
  [getTsKey(ERROR_CODES.FIELD_OUTSIDE_OF_FRAME)]: {
    // id: getTsKey(ERROR_CODES.FIELD_OUTSIDE_OF_FRAME), // not working, extraction of messages is static analysis
    id: "dict.error.field.outside.of.frame.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.MORE_THEN_24_EVENT)]: {
    // id: getTsKey(ERROR_CODES.MORE_THEN_24_EVENT),
    id: "dict.error.event.longer.that.24.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.SESSION_IN_PAST)]: {
    // id: getTsKey(ERROR_CODES.SESSION_IN_PAST),
    id: "dict.error.session.in.past.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.TIME_NOT_AVAILABLE)]: {
    // id: getTsKey(ERROR_CODES.TIME_NOT_AVAILABLE),
    id: "dict.error.time.not.available.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.NOT_ENOUGH_CREDITS)]: {
    // id: getTsKey(ERROR_CODES.NOT_ENOUGH_CREDITS),
    id: "dict.error.not.enough.credits.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.EMAIL_USED)]: {
    // id: getTsKey(ERROR_CODES.EMAIL_USED),
    id: "dict.error.email.used.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.NOT_PART_OF_COMPANY)]: {
    // id: getTsKey(ERROR_CODES.NOT_PART_OF_COMPANY),
    id: "dict.error.not.part.of.company.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.INVALID_PASSWORD)]: {
    // id: getTsKey(ERROR_CODES.INVALID_PASSWORD),
    id: "dict.error.invalid.password.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.ALREADY_EXISTING)]: {
    // id: getTsKey(ERROR_CODES.ALREADY_EXISTING),
    id: "dict.error.already.existing.message",
    defaultMessage: "{apiMessage}",
  },
  [getTsKey(ERROR_CODES.ALREADY_SUBMITTED)]: {
    id: "dict.error.form.already.submitted.message",
    defaultMessage: "The form has already been submitted",
  },
});

const aErr = (jsonMaybe) => [].concat(jsonMaybe || []).filter(Boolean);

// https://github.com/top-leader-cz/top-leader-be/blob/main/src/main/java/com/topleader/topleader/exception/ErrorCodeConstants.java
const exampleJsonMaybe = [
  {
    errorCode: "not.enough.credits",
    fields: [{ name: "user", value: "no-credit-user" }],
    errorMessage: "User does not have enough credit",
  },
];
const feedbackExample = [
  {
    errorCode: "NotNull", // TODO: BE, not listed
    fields: [
      {
        name: "validTo",
        value: "null",
      },
    ],
    errorMessage: "must not be null",
  },
];

const extractApiMsg = (error) => {
  const fieldsMsgMaybe = error?.fields
    ?.map(({ name, value }) => name)
    ?.join(", ");
  const apiMessage = [
    error?.errorMessage,
    fieldsMsgMaybe,
    error?.error,
    error?.message,
  ]
    .filter(Boolean)
    .join(" - ");
  return apiMessage;
};

const translateErr = ({ intl, error }) => {
  const apiMessage = extractApiMsg(error);
  try {
    if (!error?.errorCode)
      return { translated: "", info: "No errorCode", apiMessage };

    const tsKey = getTsKey(error?.errorCode);
    const msgObj = errMessages[tsKey];
    if (!msgObj?.id) {
      return {
        translated: "",
        info: !msgObj
          ? "Missing translation for key: " + tsKey
          : "No id in translation object for key: " + tsKey,
        apiMessage,
        tsKey,
      };
    }
    return {
      translated: intl.formatMessage(msgObj, { apiMessage }),
      apiMessage,
      tsKey,
      info: "",
    };
  } catch (e) {
    debugger;
    console.log("[translateErr er]", { e, error });
    return { translated: "", info: "Error during translation", apiMessage };
  }
};

const DEFAULT_ERROR_MESSAGE = "Oops!";

const stringifySensitive = (data, defaultMsg = DEFAULT_ERROR_MESSAGE) => {
  return process.env.NODE_ENV === "production" &&
    process.env.REACT_APP_ENV !== "QA"
    ? defaultMsg
    : JSON.stringify(data);
};

const translateErrors = ({ response, jsonMaybe, textMaybe, intl }) => {
  const errArr = aErr(jsonMaybe); // just for sure, TODO: move to authFetch?
  if (!errArr.length) {
    return stringifySensitive({
      status: response?.status,
      textMaybe,
      jsonMaybe,
    });
  }
  const translatedArr = errArr.map((error) => {
    const { translated, info, apiMessage } = translateErr({ intl, error });

    return { error, info, translated, apiMessage };
  });

  if (translatedArr.filter(prop("translated")).length !== errArr.length) {
    // prettier-ignore
    console.log("TODO: untranslated error", { errArr, translatedArr, jsonMaybe, response, });
    // debugger;
  }

  return translatedArr
    .map(({ translated, apiMessage, error, info }) => {
      if (translated) return translated;
      if (apiMessage) {
        if (
          info &&
          (process.env.NODE_ENV !== "production" ||
            process.env.REACT_APP_ENV === "QA")
        )
          return `${apiMessage} [DEV info - using API message: ${info}]`;

        return apiMessage;
      }
      return stringifySensitive({ error, info });
    })
    .join(". ");
};

const throwResponse = ({ response, jsonMaybe, textMaybe, intl }) => {
  const message = translateErrors({
    response,
    jsonMaybe,
    textMaybe,
    intl,
  });
  const error = new Error(message);
  error.response = response;
  error.jsonMaybe = jsonMaybe;
  error.textMaybe = textMaybe;
  // debugger;
  throw error;
};

const hasContentType = (type, res) =>
  res.headers.get("content-type")?.includes(type);

const MOCK_USER_INFO = {
  username: "user5@gmail.com",
  firstName: "",
  lastName: "",
  userRoles: ["USER"],
  timeZone: "Europe/Prague",
  strengths: [
    "intellectual",
    "empathizer",
    "responsible",
    "strategist",
    "connector",
    "coach",
    "selfDeveloper",
    "analyser",
    "leader",
    "selfBeliever",
    "believer",
    "solver",
    "flexible",
    "ideamaker",
    "loverOfOrder",
    "initiator",
    "positive",
    "concentrated",
    "communicator",
    "challenger",
  ],
  values: ["family", "independence", "love", "creativity", "peace", "health"],
  areaOfDevelopment: [],
  // areaOfDevelopment: ["Become effective in dig marketing"],
  notes: "test\n",
  coach: "coach1@gmail.com",
  locale: "en",
};

export function AuthProvider({ children }) {
  // Should reflect JSESSIONID cookie obtained during login (httpOnly, not accessible by JS):
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage("isLoggedIn", false);
  const queryClient = useQueryClient();
  const intl = useIntl();

  const qcRef = useRef(queryClient);
  if (qcRef.current !== queryClient) {
    console.log("qcRef.current!==queryClient");
    qcRef.current = queryClient;
  }
  const signout = useCallback(() => {
    qcRef.current.removeQueries();
    qcRef.current.clear();
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const intlRef = useRef(intl);
  intlRef.current = intl;
  const authFetch = useCallback(
    ({
      url,
      query,
      method = "GET",
      type = FETCH_TYPE.JSON,
      payload,
      data = payload, // TODO: data is too ambiguous, rename to payload
      isPublicApi = url?.includes("/api/public/"),
    }) =>
      // console.log("[authFetch] ", method, url, { data, query }) ||
      fetch(qstr(url, query), getInit({ method, data }))
        .then(async (response) => {
          let jsonMaybe, parsingError, textMaybe;
          try {
            if (
              hasContentType("text/html", response) || // TODO: AND instead of OR = self-documented code
              type === FETCH_TYPE.TEXT
            )
              textMaybe = await response.text();
            else if (
              hasContentType("application/json", response) &&
              type === FETCH_TYPE.JSON
            )
              jsonMaybe = await response.json();
          } catch (e) {
            parsingError = e;
            console.log("FETCH ERR NOT PARSED", { response, parsingError });
          }

          if (parsingError) {
            // prettier-ignore
            console.log("Response not parsed. TODO: remove this.", method + url, { response, parsingError, });
            debugger;
            return { response };
          }

          if (!response.ok) {
            throwResponse({
              response,
              jsonMaybe,
              textMaybe,
              intl: intlRef.current,
            });
          }
          if (jsonMaybe) return jsonMaybe;
          if (textMaybe) return textMaybe;

          return { response };
        })
        .catch((e) => {
          if (e?.response?.status === 401 && !isPublicApi) {
            console.error("[authFetch] removing queries and logging out", {
              e,
              url,
              method,
            });
            signout();
          }

          throw e;
        }),
    [signout]
  );

  const userQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: () => _fetchUser({ authFetch }),
    // .then( (data) => console.log("userInfo", { data }) || MOCK_USER_INFO || data ),
    enabled: !!isLoggedIn,
    // retry: false,
    // retryOnMount: false,
    // refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: (e) => {
      console.log("%c[AuthProvider.userQuery.onError]", "color:coral", { e });
      // if (e?.response?.status === 401) signout(); // TODO: move to authFetch?
    },
  });

  const loginMutation = useMutation({
    mutationFn: (fields) => _login({ authFetch, ...fields }),
    onSuccess: () => setIsLoggedIn(true),
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (fields) => _resetPass({ authFetch, ...fields }),
    onSuccess: () => setIsLoggedIn(true),
  });
  const hasRole = useCallback(
    (authority) => {
      return userQuery.data?.userRoles?.includes(authority);
    },
    [userQuery.data?.userRoles]
  );

  const value = {
    isLoggedIn,
    loginMutation,
    resetPasswordMutation,
    userQuery,
    user: userQuery, // TODO: replace by userQuery
    signout,
    authFetch,
    fetchUser: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
    hasAuthority: hasRole,
    isUser: hasRole(Authority.USER),
    isCoach: hasRole(Authority.COACH),
    isHR: hasRole(Authority.HR),
    isAdmin: hasRole(Authority.ADMIN),
  };

  // console.log("[AP.rndr]", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

const noop = () => {};

// Following code fixes onSuccess and onError removed in react-query 5
// https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5
// https://github.com/TanStack/query/discussions/5279
export const useMyQuery = ({
  fetchDef: { from: fromProp, to = identity, ...restFD } = {},
  debug,
  onSuccess,
  onError,
  queryFn,
  ...rest
}) => {
  const { authFetch } = useAuth();
  const query = useQuery({
    queryFn: performCall({
      debug,
      fetchDef: { ...restFD, from: fromProp ?? always(undefined), to },
      performCallFnMaybe: queryFn,
      authFetch,
    }),
    ...rest,
  });

  const data = query.data;
  const sCurrent = useStaticCallback(onSuccess ?? noop);
  useEffect(() => {
    if (data) sCurrent(data);
  }, [data, sCurrent]);

  const error = query.error;
  const eCurrent = useStaticCallback(onError ?? noop);
  useEffect(() => {
    if (error) eCurrent(error);
  }, [error, eCurrent]);

  return query;
};

const logAndThrowTryCatch = (fn, msg, rawData) =>
  tryCatch(fn, (e) => {
    console.error(msg, { e, rawData });
    throw e;
  })(rawData);

const performCall = ({
  debug,
  fetchDef: {
    from = identity,
    to = identity,
    url: urlMaybe,
    getUrl: getUrlMaybe,
    ...fetchDef
  } = {}, // TODO: to authFetch?
  performCallFnMaybe,
  authFetch,
}) => {
  return async (...args) => {
    const [rawPayload, ...restArgs] = args;
    const url = logAndThrowTryCatch(
      (payload) => getUrlMaybe?.(payload) || urlMaybe,
      "Error durign getUrlMaybe execution, note - called with raw payload: " +
        getUrlMaybe?.toString(),
      rawPayload // TODO: payload vs rawPayload
    );
    if (debug) {
      console.log(`[performCall] start ${fetchDef.method} ${url}`, {
        rawPayload,
      });
      if (typeof debug === "string") debugger; // "debugger", "break", "d", "b"
    }
    try {
      const payload = logAndThrowTryCatch(
        from,
        `Error during 'from' execution: ${JSON.stringify({ fetchDef: { url, ...fetchDef }, rawPayload })}`, // prettier-ignore
        rawPayload
      );
      const rawResponseData = await (performCallFnMaybe?.(
        payload,
        ...restArgs
      ) ?? authFetch({ payload, url, ...fetchDef }));
      const resData = logAndThrowTryCatch(
        to,
        `Error during 'to' execution: ${JSON.stringify({ fetchDef: { url, ...fetchDef }, rawResponseData })}`, // prettier-ignore
        rawResponseData
      );

      if (debug) {
        console.log(`[performCall] success ${fetchDef.method} ${url}`, {
          payload,
          ...(from !== identity ? { from, rawPayload } : {}),
          resData,
          ...(to !== identity ? { to, rawResponseData } : {}),
        });
        if (typeof debug === "string") debugger; // "debugger", "break", "d", "b"
      }
      return resData;
    } catch (e) {
      if (debug) {
        console.log(`[performCall] error ${fetchDef.method} ${url}`, {
          rawPayload,
          e,
          ...(to === identity ? {} : { to }),
          ...(from === identity ? {} : { from, rawPayload }),
        });
        if (typeof debug === "string") debugger; // "debugger", "break", "d", "b"
      }
      throw e;
    }
  };
};

const mapSnackBarProps = (snackbar = {}, args = [], defaultMessage) => {
  // TODO: tsKey
  const { message, getMessage, ...rest } = snackbar;

  return {
    message: message || getMessage?.(...args) || defaultMessage,
    ...rest,
  };
};

export const useMyMutation = ({
  fetchDef,
  mutationFn: mutationFnProp,
  invalidate,
  onSuccess: onSuccessProp,
  onError: onErrorProp,
  debug, // true || "debugger" == "break" == "d" == "b"
  snackbar = { success: false, error: true },
  ...rest
}) => {
  const { authFetch } = useAuth();
  const { show } = useSnackbar();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: performCall({
      debug,
      fetchDef,
      performCallFnMaybe: mutationFnProp,
      authFetch,
    }),
    onSuccess: (...args) => {
      try {
        if (debug) console.log(`[useMyMutation.onSuccess]`, { args, fetchDef, invalidate, snackbar: snackbar.success, mutationFnProp, rest }); // prettier-ignore

        if (invalidate) {
          if (Array.isArray(invalidate))
            invalidate.forEach((queryKey) =>
              queryClient.invalidateQueries(queryKey)
            );
          else queryClient.invalidateQueries(invalidate);
        }

        if (snackbar.success) {
          const props = mapSnackBarProps({ ...snackbar.success }, args, "👍");
          show({ type: "success", ...props });
        }
        onSuccessProp?.(...args);
      } catch (e) {
        console.log("UMM", { e });
        debugger;
      }
    },
    onError: (...args) => {
      if (debug) console.log(`[useMyMutation.onError]`, { args, fetchDef, snackbar: snackbar.error, mutationFnProp, rest }); // prettier-ignore

      if (snackbar.error) {
        const props = mapSnackBarProps(
          { ...snackbar.error },
          args,
          args[0]?.message
        );
        show({ type: "error", ...props });
      }
      onErrorProp?.(...args);
    },
    ...rest,
  });

  return mutation;
};
