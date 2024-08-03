import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { primary25, primary500 } from "../../theme";
import { Icon } from "../../components/Icon";
import { ShowMore } from "../Coaches/CoachCard";
import { P } from "../../components/Typography";

export const ExpandableInfoBox = ({
  heading,
  headingElement = (
    <P
      sx={{
        // p: 3,
        // borderRadius: 0.5,
        color: primary500,
        fontSize: 16,
        fontWeight: 500,
        py: 1,
      }}
    >
      {heading}
    </P>
  ),
  text,
  hideEmpty,
}) => {
  const showMoreMaxChars = 1500;

  if (hideEmpty && !text) {
    return null;
  }

  return (
    <Accordion
      sx={{
        bgcolor: primary25,
        mb: 1,
        boxShadow: "none",
        borderRadius: "6px",
        "&:before": {
          display: "none", // remove border
        },
      }}
    >
      <AccordionSummary
        expandIcon={<Icon name="ExpandMore" />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {headingElement}
      </AccordionSummary>
      <AccordionDetails>
        {showMoreMaxChars ? (
          <ShowMore maxChars={showMoreMaxChars} text={text} />
        ) : (
          text
        )}
      </AccordionDetails>
    </Accordion>
  );
};
