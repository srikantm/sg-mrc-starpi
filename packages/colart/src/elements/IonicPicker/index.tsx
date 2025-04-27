import { VersionVariants } from "@enums";
import dynamic from "next/dynamic";
import { ButtonProps as MuiButtonProps } from "@mui/material";

type OmmitedMuiProps = Omit<MuiButtonProps, "variant">;
export interface ButtonProps extends OmmitedMuiProps {
  variant: VersionVariants;
  show: boolean;
  actionUrl?: string;
  actionLabel?: string;
  container?: any;
}
const componentMap: any = {};
componentMap[VersionVariants.VERSION_ONE] = dynamic(() => import("./V1"));
componentMap[VersionVariants.VERSION_TWO] = dynamic(
  () => import("@elements/NotImplemented")
);

const Alert = (props: ButtonProps) => {
  let Component;
  if (Object.keys(componentMap).includes(props.variant)) {
    Component = componentMap[props.variant];
  } else {
    Component = componentMap[VersionVariants.VERSION_ONE];
  }
  return <Component {...props} />;
};

export default Alert;
