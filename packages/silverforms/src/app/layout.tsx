"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import { ThemeProvider } from "@colart/theme";
// import { defaultTheme } from "@colart/theme/theme";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={{}}>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css?family=Droid+Sans:400,700"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css?family=Comfortaa:400,600"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400i"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Neuton:300,400"
            rel="stylesheet"
          />
        </head>
        <Box
          sx={{ backgroundColor: "#F3F7FA" }}
          // display={"flex"}
          // justifyContent={"center"}
          component={"body"}
          // className={inter.className}
        >
          <div
          // sx={{ width: "100%", maxWidth: 1440 }}
          >
            {children}
          </div>
        </Box>
      </html>
    </ThemeProvider>
  );
}
