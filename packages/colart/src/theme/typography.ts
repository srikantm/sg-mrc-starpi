export default {
  // fontFamily: ['Droid Sans', 'san-serif'].join(','),
  fontFamily: ["Poppins", "san-serif"].join(","),
  button: {
    textTransform: "none",
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: "21px",
    fontWeight: 500,
    // '@media (max-width:600px) and (min-width:330px)': {
    //   fontSize: 18,
    //   lineHeight: '28px',
    // },
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: 500,
    // '@media (max-width:600px) and (min-width:330px)': {
    //   fontSize: 16,
    // },
  },
  subtitle3: {
    fontSize: 12,
    fontWeight: 500,
    // '@media (max-width:600px) and (min-width:330px)': {
    //   fontSize: 14,
    // },
  },
  body1: {
    fontSize: 16,
    fontWeight: 400,
    // '@media (max-width:600px) and (min-width:330px)': {
    //   fontSize: 18,
    // },
  },
  body2: {
    fontSize: 14,
    fontWeight: 400,
    // '@media (max-width:600px) and (min-width:330px)': {
    //   fontSize: 16,
    // },
  },
  body3: {
    fontSize: 12,
    fontWeight: 400,
    "@media (max-width:600px) and (min-width:330px)": {
      fontSize: 12,
    },
  },
  caption: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "14px",
  },
};

declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
    subtitle3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subtitle3: true;
  }
}
