import { VersionVariants } from "@colart/enums";
import dynamic from "next/dynamic";
import { ButtonProps } from "./type";

const componentMap: any = {};
componentMap[VersionVariants.VERSION_ONE] = dynamic(() => import("./V1"));
componentMap[VersionVariants.VERSION_TWO] = dynamic(
  () => import("@colart/elements/NotImplemented")
);

const Button = (props: ButtonProps) => {
  let Component;
  if (Object.keys(componentMap).includes(props.version)) {
    Component = componentMap[props.version];
  } else {
    Component = componentMap[VersionVariants.VERSION_ONE];
  }
  return <Component {...props} />;
};

export default Button;
