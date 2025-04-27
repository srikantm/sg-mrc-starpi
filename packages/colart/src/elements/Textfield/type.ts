import { VersionVariants } from "@enums";
import { TextFieldProps as MuiTextFieldProps } from "@mui/material";

type OmmitedMuiProps = Omit<MuiTextFieldProps, "classes">;
export interface TextFieldProps extends OmmitedMuiProps {
  version: VersionVariants;
}
