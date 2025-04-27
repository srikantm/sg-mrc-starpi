import { VersionVariants } from "@colart/enums";
import { ButtonProps as MuiButtonProps } from "@mui/material";

// type OmmitedMuiProps = Omit<MuiButtonProps, "variant">;
export interface ButtonProps extends MuiButtonProps {
  version: VersionVariants;
  show?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  container?: any;
}
