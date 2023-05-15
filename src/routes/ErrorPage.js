import { defineMessages } from "react-intl";
import { useRouteError } from "react-router-dom";
import { Msg, MsgProvider } from "../components/Msg";

const messages = defineMessages({
  "error-page.default.title": {
    id: "error-page.default.title",
    defaultMessage: "Oops!",
  },
  "error-page.default.message": {
    id: "error-page.default.message",
    defaultMessage: "Sorry, an unexpected error has occurred.",
  },
});

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <MsgProvider messages={messages}>
      <div id="error-page">
        <h1>
          <Msg id="error-page.default.title" />
        </h1>
        <p>
          <Msg id="error-page.default.message" />
        </p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </MsgProvider>
  );
}
