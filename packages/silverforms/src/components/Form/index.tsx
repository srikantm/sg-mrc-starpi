"use client";
import {
  Box,
  FormControl,
  Typography,
  TextField,
  Grid,
  FormHelperText,
} from "@mui/material";
import { Button } from "@colart/elements";
import { useState } from "react";
import { getAxiosInstance } from "@src/utils";
import { useRouter } from "next/navigation";
import { FieldComponent } from "../Field";
import { memo } from "react";

const axios = getAxiosInstance("https://api.yoursilvergenie.com");

export const FormComponent = ({ form }) => {
  const [formValue, setFormValue] = useState({});
  const [formError, setFormError] = useState({});
  const router = useRouter();

  const onSubmit = async () => {
    const requiredKeys = form.fields
      .filter((field) => field.isRequired)
      .map((field) => field.name);
    const error = {};
    console.log("🚀 ~ file: index.tsx:28 ~ onSubmit ~ formValue:", formValue);

    for (const requiredKey of requiredKeys) {
      if (!formValue[requiredKey]) {
        error[requiredKey] = true;
      }
    }

    setFormError({ ...formError, ...error });
    if (Object.keys(error).length) {
      return false;
    } else {
      try {
        const data = await axios.post("/api/silver-form-submits", {
          data: {
            silver_form: {
              id: form.id,
            },
            details: formValue,
          },
        });
        router.push("/success");
      } catch (error) {}
    }
  };
  const onChange = (event = undefined, value = undefined) => {
    const newFormValue = {};
    newFormValue[event.target.name] = event.target.value;
    console.log(event, value);
    setFormValue({ ...formValue, ...newFormValue });
    if (formError[event.target.name]) {
      const error = {};
      error[event.target.name] = false;
      setFormError({ ...formError, ...error });
    }
  };
  return (
    <Grid container rowSpacing={3}>
      {form?.fields?.map((field) => (
        <Grid item xs={12} key={field.id}>
          <FieldComponent
            {...field}
            onChange={onChange}
            formError={formError}
          />
        </Grid>
      ))}
      <Button
        sx={{ width: "100%", mt: 6 }}
        onClick={onSubmit}
        variant="contained"
        version={undefined}
        // show={false}
      >
        Submit
      </Button>
    </Grid>
  );
};

export default FormComponent;
