import { TextField } from "@mui/material";
import { TextFieldProps } from "../type";

const Component = ({ children, ...props }: TextFieldProps) => {
  return <TextField {...props}>{children}</TextField>;
};
export default Component;
