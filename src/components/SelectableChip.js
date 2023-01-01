// https://mui.com/material-ui/react-chip/
// https://mui.com/material-ui/api/chip/

import { Check, Close } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { styled } from "@mui/system";

// https://mui.com/system/styled/#custom-components
// https://mui.com/material-ui/customization/how-to-customize/#2-reusable-component
// https://mui.com/system/styled/#styled-component-options-styles-component
// https://mui.com/material-ui/customization/theme-components/#creating-new-component-variants

const SelectableChip2 = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "bgcolor" && prop !== "selected",
  name: "SelectableChip",
  slot: "Root",
  // We are specifying here how the styleOverrides are being applied based on props
  overridesResolver: (props, styles) =>
    console.log("overridesResolver", { props, styles }) || [
      styles.root,
      props.color === "primary" && styles.primary,
      props.color === "secondary" && styles.secondary,
    ],
})(
  ({ theme, ...props }) =>
    console.log("styled", { theme, props }) || {
      backgroundColor: "pink",
    }
);

export const SelectableChip = ({ selected, ...props }) => {
  const selectedProps = selected
    ? { variant: "selected", icon: <Check /> }
    : { variant: "unselected", icon: <Close /> };

  return <Chip {...props} {...selectedProps} />;
};

SelectableChip.wrapperSx = {
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: 3,
  pb: 3,
};
