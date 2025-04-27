import { Box, Typography } from "@mui/material";
import Image from "next/image";
export const NotFoundPage = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box width={300} height={300} position={"relative"}>
        <Image
          src="https://cdn.dribbble.com/users/458522/screenshots/3748761/404_not_found.jpg"
          alt="404"
          fill
          objectFit="contain"
        />
      </Box>

      <Typography variant="subtitle1" fontSize={24}>
        404 | Not Found
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
