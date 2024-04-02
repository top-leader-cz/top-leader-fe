import { Box, Button } from "@mui/material";
import { defineMessages } from "react-intl";
import { Icon } from "../../../components/Icon";
import { MsgProvider } from "../../../components/Msg";
import { useMsg } from "../../../components/Msg/Msg";

export const ControlsContainer = ({ sx, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "baseline",
        justifyContent: "flex-end",
        gap: 3,
        ...sx,
      }}
      {...props}
    />
  );
};

export const Controls2 = ({ ...props }) => {
  return <ControlsContainer></ControlsContainer>;
};

const ControlsInner = ({
  handleNext,
  nextProps,
  handleBack,
  data,
  sx = {},
}) => {
  const msg = useMsg();
  // console.log("[Controls.rndr]", { data });
  return (
    <ControlsContainer>
      <Button
        variant="outlined"
        endIcon={<Icon name="ArrowBack" />}
        onClick={() => handleBack(data)}
      >
        {msg("controls.back")}
      </Button>

      <Button
        type="button"
        variant="contained"
        endIcon={<Icon name="ArrowForward" />}
        onClick={(e) => {
          console.log(
            "%c[ControlsInner.submit] e.preventDefault()",
            "color:crimson",
            e
          );
          e.preventDefault();
          return handleNext(data);
        }}
        children={msg("controls.next")}
        {...nextProps}
      />
    </ControlsContainer>
  );
};

export const controlsMessages = defineMessages({
  "controls.back": { id: "controls.back", defaultMessage: "Back" },
  "controls.next": { id: "controls.next", defaultMessage: "Next" },
});

export const Controls = (props) => (
  <MsgProvider messages={controlsMessages}>
    <ControlsInner {...props} />
  </MsgProvider>
);
