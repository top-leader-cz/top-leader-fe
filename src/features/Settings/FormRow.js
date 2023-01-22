import { Box, Divider } from "@mui/material";
import { P } from "../../components/Typography";

export const FieldLayout = ({
  children,
  label,
  labelProps,
  sx,
  dividerTop,
  dividerBottom,
}) => {
  return (
    <>
      {dividerTop && <Divider sx={{ mt: 3, mb: 3 }} />}
      <Box display="flex" gap={3} alignItems="center" maxWidth={800} sx={sx}>
        <Box
          {...labelProps}
          minWidth="190px"
          // minHeight="20px"
          // flex="1 1 100%"
        >
          {label}
        </Box>
        {children}
      </Box>
      {dividerBottom && <Divider sx={{ mt: 3, mb: 3 }} />}
    </>
  );
};

export const FormRow = ({
  children,
  label,
  LabelComponent = P,
  name,
  sx,
  dividerTop = true,
  dividerBottom = false,
}) => {
  return (
    <FieldLayout
      label={!label ? null : <LabelComponent>{label}</LabelComponent>}
      labelProps={
        label ? { component: "label", htmlFor: name } : { component: "div" }
      }
      dividerTop={dividerTop}
      dividerBottom={dividerBottom}
      sx={sx}
    >
      {children}
    </FieldLayout>
  );
};
