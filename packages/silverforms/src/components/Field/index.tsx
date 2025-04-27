"use client";
import {
  FormControl as MuiFormControl,
  FormControlProps,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { kebabCase } from "lodash";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FormControl: any = styled(MuiFormControl)(({ theme }) => ({
  width: "100%",
}));

export const FieldComponent = ({ type, formError, ...field }) => {
  const onChange = (e, v) => {
    console.log(e, v);
    if (field.onChange) {
      field.onChange(e, v);
    }
  };
  // console.log(onChange, "ffffff");
  if (type === "option") {
    return (
      <FormControl error={formError[field.name]} onChange={onChange}>
        <FormLabel id={kebabCase(field.name)}>
          <Typography variant="subtitle2">{field.label}</Typography>
        </FormLabel>
        {field.description && (
          <Typography variant="caption">{field.description}</Typography>
        )}
        <Typography variant="caption">{field.description}</Typography>
        <RadioGroup aria-labelledby={kebabCase(field.name)} name={field.name}>
          {field?.options?.split("\n").map((f) => (
            <FormControlLabel key={f} value={f} control={<Radio />} label={f} />
          ))}
        </RadioGroup>
        {formError[field.name] && (
          <FormHelperText>This field is Required</FormHelperText>
        )}
      </FormControl>
    );
  }
  if (type === "date") {
    return (
      <FormControl error={formError[field.name]}>
        <FormLabel id={kebabCase(field.name)}>
          <Typography variant="subtitle2">{field.label}</Typography>
        </FormLabel>
        {field.description && (
          <Typography variant="caption">{field.description}</Typography>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(e, v) => {
              onChange(
                {
                  target: {
                    name: field.name,
                    value: e,
                  },
                },
                {}
              );
            }}
          />
        </LocalizationProvider>
        {formError[field.name] && (
          <FormHelperText>This field is Required</FormHelperText>
        )}
      </FormControl>
    );
  } else {
    return (
      <FormControl error={formError[field.name]}>
        <FormLabel id={kebabCase(field.name)}>
          <Typography variant="subtitle2">{field.label}</Typography>
        </FormLabel>
        {field.description && (
          <Typography variant="caption">{field.description}</Typography>
        )}

        <TextField
          size="small"
          name={field.name}
          onChange={onChange}
          error={formError[field.name]}
          placeholder={field.placeholder}
        />
        {formError[field.name] && (
          <FormHelperText>This field is Required</FormHelperText>
        )}
      </FormControl>
    );
  }
};
