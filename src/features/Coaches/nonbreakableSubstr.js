import {
  gt,
  gte,
  ifElse,
  join,
  pipe,
  propSatisfies,
  reduce,
  split,
  tap,
} from "ramda";

export const nonbreakableSubstr = (nbToken, maxLen, text) =>
  pipe(
    split(nbToken),
    ifElse(
      pipe(join(""), propSatisfies(gte(maxLen), "length")),
      join(nbToken),
      pipe(
        // tap(console.log.bind(console)),
        reduce((acc, token) => {
          const length = acc.join("").length;
          // console.log(">", { acc, length, token });
          if (length === maxLen) return acc;
          else if (length + token.length <= maxLen) return [...acc, token];
          else return [...acc, token.substr(0, maxLen - length)];
        }, []),
        // tap(console.log.bind(console)),
        join(nbToken)
      )
    )
  )(text);
