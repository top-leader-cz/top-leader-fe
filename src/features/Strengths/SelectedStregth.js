import { CardContent } from "@mui/material";
import React from "react";
import { InfoBox } from "../../components/InfoBox";
import { Msg } from "../../components/Msg";
import { SwipeableStepper } from "./SwipeableStepper";

export const SelectedStregth = ({
  positives = [],
  tips = [],
  positivesHeading = <Msg id="strengths.positives.title" />,
}) => {
  return (
    <CardContent sx={{ display: "flex", gap: 2, width: "100%" }}>
      <InfoBox
        color="primary"
        heading={positivesHeading}
        sx={{
          width: "50%",
          minWidth: "49%",
          maxWidth: "50%",
          overflow: "hidden",
        }}
      >
        <ul>
          {positives.map((text) => (
            <li>{text}</li>
          ))}
        </ul>
      </InfoBox>
      <InfoBox
        color="default"
        heading={<Msg id="strengths.tips.title" />}
        sx={{
          width: "50%",
          minWidth: "49%",
          maxWidth: "50%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SwipeableStepper
          key={JSON.stringify(tips)} // reset to first step when tips change
          steps={tips.map((text) => ({ key: text, text }))}
        />
      </InfoBox>
    </CardContent>
  );
};
