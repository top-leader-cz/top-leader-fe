import { Box, Divider } from "@mui/material";
import { P } from "../../components/Typography";
import { ErrorBoundary } from "react-error-boundary";

export const FL_MAX_WIDTH = 800;

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
      <Box
        display="flex"
        gap={3}
        alignItems="center"
        maxWidth={FL_MAX_WIDTH}
        sx={sx}
      >
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
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        console.log("FormRow", {
          name,
          error,
        });
        return `${error?.message}`;
      }}
    >
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
    </ErrorBoundary>
  );
};
