// /* eslint-disable react-hooks/rules-of-hooks */
// "use client";
import { getAxiosInstance } from "@src/utils";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Box, Card, Typography } from "@mui/material";
import { Remarkable } from "remarkable";
import Image from "next/image";
import FormComponent from "../../components/Form";
import { useEffect, useRef, useState } from "react";
const md = new Remarkable();

// import { Box } from "@mui/material";

const axios = getAxiosInstance("https://api.yoursilvergenie.com");

async function getFormWithSlug(slug: string) {
  try {
    const res = await axios.get("/api/silver-forms/", {
      params: {
        filters: { slug },
        populate: "*",
      },
    });
    return res.data.data;
  } catch (error) {
    return;
  }
}

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {
    params: { slug },
  } = props;

  const data = await getFormWithSlug(slug);
  const form = data?.length
    ? { ...data[0].attributes, id: data[0].id }
    : undefined;

  if (!form) {
    notFound();
    return;
  }

  return {
    title: `${form.name} Form | Yoursilvergenie.com`,
    openGraph: {
      images: [
        "https://www.yoursilvergenie.com/wp-content/uploads/2021/06/sg-logo.f706d385.png",
      ],
    },
  };
}
export default async function Page(props: any) {
  // const imageRef = useRef(undefined);
  const {
    params: { slug },
  } = props;

  // const getForm = async () => {

  //   // setForm(form);
  // };
  const data = await getFormWithSlug(slug);
  // const form = data.length ? data[0].attributes : undefined;
  const form = data?.length
    ? { ...data[0].attributes, id: data[0].id }
    : undefined;
  if (!form) {
    notFound();
  }

  // useEffect(() => {
  //   console.log(imageRef);
  // });

  return (
    <Box mb={10}>
      <Box
        sx={{
          position: "absolute",
          background: "linear-gradient(90deg, #225448 0%, #7E9F67 100%)",
          // backgroundColor: "#225448",
          height: { xs: form.description ? "80vh" : "50vh", md: "50vh" },
          width: "100%",
          zIndex: -1,
        }}
      ></Box>
      <Box
        sx={{
          width: "80%",
          // position: "absolute",
          // top: { xs: 100, md: "200px" },
          margin: "0 auto",
          // right: "0",
          // left: "0",
          pt: 10,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
          // ref={imageRef}
        >
          <Typography
            variant="h1"
            fontSize={{ xs: 30, md: 40, lg: 50 }}
            fontWeight={500}
            color="primary.contrastText"
          >
            {form.name}
          </Typography>
          <Box
            sx={{ color: "primary.contrastText", fontSize: 14 }}
            dangerouslySetInnerHTML={{ __html: md.render(form.description) }}
          ></Box>
        </Box>
        <Card
          sx={{
            p: 5,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            borderRadius: 6,
          }}
          elevation={4}
        >
          <Box display={"flex"} justifyContent={"center"}>
            <Box width={150} height={70} position={"relative"}>
              <Image
                src="http://www.yoursilvergenie.com/wp-content/uploads/2021/06/sg-logo.f706d385.png"
                alt="MIT"
                fill
                quality={50}
                objectFit="contain"
              />
            </Box>
          </Box>
          <FormComponent form={form} />
        </Card>
      </Box>
    </Box>
  );
}
