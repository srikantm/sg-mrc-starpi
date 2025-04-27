import { getAxiosInstance } from "@src/utils";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Box, Card, Typography } from "@mui/material";
import { Remarkable } from "remarkable";
import Image from "next/image";
import FormComponent from "../../components/Form";

export default async function Page(props: any) {
  return (
    <Box
      sx={{ p: 4 }}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Box position={"relative"} width={400} height={300}>
        <Image
          src="https://png2.cleanpng.com/dy/8f666f6653af2abe2f867c2055c04f37/L0KzQYm3U8MyN6loj5H0aYP2gLBuTfRwf59xh9NtLYT8gLFukvFxcKoyjNpqbnuwibF8TcViapdoSdVuY3HnR7W8TsE2PGI4UaM9MUW1Qoa4VsQ0OGk4SKs3cH7q/kisspng-download-typography-thank-you-5abfc1cecad7d5.1541391415225164308309.png"
          alt="thank you"
          fill
          objectFit="contain"
        />
      </Box>
      <Card sx={{ p: 5, borderRadius: 5, textAlign: "center", width: "100%" }}>
        <Typography variant="h2" color={"primary.main"}>
          Form is Submitted Successfully!
        </Typography>
        <Typography variant="subtitle1" fontSize={20}>
          Thank you for your Submission
        </Typography>
      </Card>
    </Box>
  );
}
