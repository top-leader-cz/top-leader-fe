import { call, identity } from "ramda";
import { useMsg } from "../Msg/Msg";
import { defineMessages } from "react-intl";
import { useEffect, useRef, useState } from "react";

const messages = defineMessages({
  "general.loadable-options.loading.placeholder": {
    id: "general.loadable-options.loading.placeholder",
    defaultMessage: "Loading options",
  },
  "general.loadable-options.error.placeholder": {
    id: "general.loadable-options.error.placeholder",
    defaultMessage: "Error loading options",
  },
});

export const useLoadableOptions = ({ query, map = identity }) => {
  const msg = useMsg({ dict: messages });
  if (query.data)
    return {
      options: map(query.data),
      disabled: false,
      placeholder: undefined,
    };
  if (query.isLoading)
    return {
      options: [],
      disabled: true,
      placeholder: msg("general.loadable-options.loading.placeholder"),
    };
  if (query.error)
    return {
      options: [],
      disabled: true,
      placeholder: msg("general.loadable-options.error.placeholder"),
    };
};

const noop = () => {};
export const useIntersection = ({
  elementRef,
  onVisibleOnce = noop,
  rootMargin = "0px",
}) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const current = elementRef?.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("[useIntersection]", entry.isIntersecting);
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );
    current && observer?.observe(current);

    return () => current && observer.unobserve(current);
  }, []);

  const calledRef = useRef(false);
  const onceFnRef = useRef(onVisibleOnce);
  onceFnRef.current = onVisibleOnce;
  useEffect(() => {
    if (isVisible && !calledRef.current) {
      calledRef.current = true;
      onceFnRef.current();
    }
  }, [isVisible]);

  return isVisible;
};
