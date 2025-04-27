import { Button as MuiButton } from "@mui/material";
import { ButtonProps } from "../type";

const Component = ({ children, ...props }: ButtonProps) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};
export default Component;
