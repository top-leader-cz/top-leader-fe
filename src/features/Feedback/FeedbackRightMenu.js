import { Divider, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
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
        Feedback on my leadership skills
      </P>
      <P>Below you can see the overview of your current form.</P>
      <Divider sx={{ my: 3 }} />
      <ProgressStats items={stats} />
      <Divider sx={{ my: 3 }} />
      <P gutterBottom emphasized>
        Responses collected
      </P>
      <LinearProgressStyled
        variant="determinate"
        value={(100 * collected.count) / collected.total}
        sx={{ my: 2 }}
      />
      <P>
        {collected.count}/{collected.total}
      </P>
    </ScrollableRightMenu>
  );
};
