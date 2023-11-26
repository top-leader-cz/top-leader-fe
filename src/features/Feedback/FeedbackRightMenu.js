import { Divider, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import { Msg } from "../../components/Msg";
import { ProgressStats } from "../../components/ProgressStats";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { P } from "../../components/Typography";

const LinearProgressStyled = styled(LinearProgress)(({ theme }) => ({
  height: 14,
  backgroundColor: "#EAECF0",
}));

export const FeedbackRightMenu = ({ buttonProps, stats, collected }) => {
  return (
    <ScrollableRightMenu heading={"Overview"} buttonProps={buttonProps}>
      <P gutterBottom emphasized>
        <Msg id="feedback.aside.text" />
      </P>
      <P>
        <Msg id="feedback.aside.perex" />
      </P>
      <Divider sx={{ my: 3 }} />
      {stats ? <ProgressStats items={stats} /> : null}
      {collected ? (
        <>
          <Divider sx={{ my: 3 }} />
          <P gutterBottom emphasized>
            <Msg id="feedback.aside.collected" />
          </P>
          <LinearProgressStyled
            variant="determinate"
            value={(100 * collected.count) / collected.total}
            sx={{ my: 2 }}
          />
          <P>
            {collected.count}/{collected.total}
          </P>
        </>
      ) : null}
    </ScrollableRightMenu>
  );
};
