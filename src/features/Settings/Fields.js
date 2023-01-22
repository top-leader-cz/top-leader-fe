import { Avatar, Button, OutlinedInput, styled } from "@mui/material";
import { Controller } from "react-hook-form";
import { Icon } from "../../components/Icon";
import { P } from "../../components/Typography";

const StyledOutlinedInput = styled(OutlinedInput)({
  backgroundColor: "white",
});

export const BareInputField = ({
  name,
  rules,
  size = "small",
  fullWidth = true,
  ...props
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState, formState }) => (
        <StyledOutlinedInput
          size={size}
          id={name}
          fullWidth={fullWidth}
          {...props}
          {...field}
        />
      )}
    />
  );
};

// const AutocompleteSelectStyled = styled(AutocompleteSelect)(({ theme }) => ({
//   ".MuiAutocomplete-root .MuiOutlinedInput-root": { backgroundColor: "white" },
// }));

export const B = styled("b")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

export const FileUpload = ({ name, src }) => {
  return (
    <>
      <Avatar variant="circular" src={src} sx={{ width: 80, height: 80 }} />
      <Button
        variant="outlined"
        component="label"
        disableRipple
        disableElevation
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          color: (theme) =>
            console.log({ theme }) || theme.palette.text.primary,
          borderColor: "rgba(0, 0, 0, 0.23)",
          backgroundColor: "white",
          boxShadow: "none",
          textTransform: "none",
          height: "130px",
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: "white",
            borderColor: (theme) => theme.palette.common.black,
          },
        }}
      >
        <input hidden accept="image/*" multiple type="file" />
        <Avatar
          variant="circular"
          sx={{ width: 48, height: 48, bgcolor: "#F9FAFB", opacity: 1.6 }}
        >
          <Avatar
            variant="circular"
            sx={{ width: 36, height: 36, bgcolor: "#EAECF0", opacity: 1.4 }}
          >
            <Icon name={"CloudUploadOutlined"} sx={{ color: "#667085" }} />
          </Avatar>
        </Avatar>
        <P gutterBottom sx={{ mt: 1 }}>
          <B>Click to upload </B>
          <span style={{ display: "none", color: "transparent" }}>
            or drag and drop
          </span>
        </P>
        <P>SVG, PNG, JPG or GIF (max. 800 x 400px)</P>
      </Button>
    </>
  );
};
