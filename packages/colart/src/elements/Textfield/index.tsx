import { VersionVariants } from "@enums";
import dynamic from "next/dynamic";
import { TextFieldProps } from "./type";

const componentMap: any = {};
componentMap[VersionVariants.VERSION_ONE] = dynamic(() => import("./V1"));
componentMap[VersionVariants.VERSION_TWO] = dynamic(
  () => import("@elements/NotImplemented")
);

const TextField = (props: TextFieldProps) => {
  let Component;
  if (Object.keys(componentMap).includes(props.version)) {
    Component = componentMap[props.version];
  } else {
    Component = componentMap[VersionVariants.VERSION_ONE];
  }
  return <Component {...props} />;
};

export default TextField;
